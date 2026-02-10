# Student Revision Engine API

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from database.connection import get_db
from models.user import User
from middleware.rbac import require_student
from routes.auth import get_current_user
from ollama_utils import run_ollama
from embedding_manager import EmbeddingManager

router = APIRouter(prefix="/api/student/revision", tags=["Student - Revision"])
embedding_manager = EmbeddingManager()

class SummaryRequest(BaseModel):
    content: str
    subject: str
    max_length: int = 500

class MindMapRequest(BaseModel):
    topic: str
    subject: str
    content: str = ""

class FlashcardRequest(BaseModel):
    content: str
    subject: str = ""
    num_cards: int = 10

@router.post("/summary")
async def generate_summary(
    request: SummaryRequest,
    current_user: User = Depends(require_student)
):
    """Generate AI summary of study material (RAG-enabled)"""
    
    # 1. Determine context source
    context_content = request.content
    
    # If content is empty/short but subject is provided, try to fetch from FAISS
    if (not context_content or len(context_content) < 50) and request.subject:
        print(f"Searching FAISS for context on: {request.subject}")
        # Increase top_k to get more context
        search_results = embedding_manager.search(request.subject, top_k=10)
        if search_results:
            context_content = "\n\n".join([r['text'] for r in search_results])
            print(f"Retrieved {len(context_content)} chars of context")
    
    if not context_content:
        return {"success": False, "summary": "No content provided and no relevant material found in knowledge base."}

    prompt = f"""Summarize the following content about {request.subject} in approximately {request.max_length} words.
    
    Structure the summary with the following sections using Markdown:
    # Key Concepts
    # Detailed Analysis
    # Exam-Relevant Points
    # Conclusion

    Make it easy to read and focus on understanding rather than just copying text.
    
    Content:
    {context_content[:4000]}  # Limit context window
    
    Summary:"""
    
    try:
        summary = run_ollama(prompt, model="gemma3:1b")
    except Exception as e:
        summary = f"Error generating summary: {str(e)}"
    
    return {
        "success": True,
        "summary": summary,
        "word_count": len(summary.split())
    }

@router.post("/mindmap")
async def generate_mindmap(
    request: MindMapRequest,
    current_user: User = Depends(require_student)
):
    """Generate mind map structure for a topic (RAG-enabled)"""
    
    # Determine context source
    context_str = request.content
    
    # If content is empty/short but subject is provided, fetch from FAISS
    if not context_str or len(context_str) < 50:
        search_query = f"{request.topic} {request.subject}"
        search_results = embedding_manager.search(search_query, top_k=5)
        if search_results:
            context_str = "\n".join([r['text'] for r in search_results])
    
    prompt = f"""Create a hierarchical mind map structure for the topic: {request.topic}.
    Use the following context if relevant:
    
    Context:
    {context_str[:3000]}
    
    Output ONLY valid JSON. Do not include any explanation or markdown formatting (like ```json).
    Structure:
    {{
        "central_topic": "Main Topic",
        "branches": [
            {{
                "name": "Branch 1",
                "sub_branches": ["Sub 1.1", "Sub 1.2"]
            }}
        ]
    }}
    """
    
    try:
        mindmap_text = run_ollama(prompt, model="gemma3:1b")
        # Try to parse as JSON, fallback to text
        import json
        import re
        
        # Clean up potential markdown code blocks
        clean_text = mindmap_text.replace("```json", "").replace("```", "").strip()
        
        try:
            # Extract JSON block - Find first { and last }
            start_idx = clean_text.find('{')
            end_idx = clean_text.rfind('}')
            
            if start_idx != -1 and end_idx != -1:
                json_str = clean_text[start_idx:end_idx+1]
                mindmap = json.loads(json_str)
            else:
                # Fallback: try parsing the whole string
                mindmap = json.loads(clean_text)
                
            # Validate structure
            if "branches" not in mindmap:
                mindmap["branches"] = []
                
        except Exception as e:
            print(f"JSON Parse Error: {e}")
            # Intelligent fallback for list-based output
            mindmap = {
                "central_topic": request.topic,
                "branches": [
                    {"name": line.strip("-* "), "sub_branches": []} 
                    for line in clean_text.split('\n') 
                    if line.strip().startswith(('-', '*')) and len(line) < 50
                ][:5], # Limit to top 5 points
                "raw_response": mindmap_text
            }
            if not mindmap["branches"]:
                mindmap["branches"] = [
                     {"name": "Overview", "sub_branches": ["Definition", "Key Concepts"]},
                     {"name": "Error Parsing AI Response", "sub_branches": ["Please try again"]}
                ]
    except Exception as e:
        mindmap = {"error": str(e)}
    
    return {
        "success": True,
        "mindmap": mindmap
    }

@router.post("/flashcards")
async def generate_flashcards(
    request: FlashcardRequest,
    current_user: User = Depends(require_student)
):
    """Generate flashcards from content (RAG-enabled)"""

    # Fetch context if content is missing
    context_content = request.content
    if (not context_content or len(context_content) < 50) and request.subject:
        search_results = embedding_manager.search(request.subject, top_k=5)
        if search_results:
            context_content = "\n\n".join([r['text'] for r in search_results])

    if not context_content:
        return {"success": False, "cards": [{"question": "No content found", "answer": "Please upload materials first."}]}
    
    prompt = f"""Generate {request.num_cards} flashcards based on the following context about {request.subject}.
    
    Context:
    {context_content[:4000]}
    
    Strictly follow this format for each card (no numbering, no bolding):
    Question: [Your question here]
    Answer: [Your answer here]
    
    Make questions test understanding, not just memorization.
    """
    
    try:
        flashcards_text = run_ollama(prompt, model="gemma3:1b")
        
        # Parse flashcards
        cards = []
        lines = flashcards_text.split('\n')
        current_q = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Remove markdown bolding if present
            clean_line = line.replace("**", "").replace("*", "")
            lower_line = clean_line.lower()
            
            # Robust parsing for various model outputs
            if lower_line.startswith(('q:', 'question:', 'q.', 'question.')):
                # Save previous card if exists
                if current_q and current_a:
                     cards.append({"question": current_q, "answer": current_a})
                     current_a = None
                
                # Extract content
                parts = clean_line.split(':', 1)
                if len(parts) > 1:
                    current_q = parts[1].strip()
                else:
                    parts = clean_line.split('.', 1)
                    if len(parts) > 1: 
                        current_q = parts[1].strip()
                        
            elif lower_line.startswith(('a:', 'answer:', 'a.', 'answer.')) and current_q:
                # Extract content
                parts = clean_line.split(':', 1)
                answer_text = ""
                if len(parts) > 1:
                    answer_text = parts[1].strip()
                else:
                     parts = clean_line.split('.', 1)
                     if len(parts) > 1:
                         answer_text = parts[1].strip()
                
                if answer_text:
                    current_a = answer_text
                    # Auto-append if next line starts new Q, otherwise wait (allows multi-line answers potentially, though simple logic here)
                    cards.append({
                        "question": current_q,
                        "answer": answer_text
                    })
                    current_q = None
                    current_a = None
        
        # Fallback if parsing fails
        if not cards:
            cards = [
                {"question": "Error parsing AI response", "answer": flashcards_text[:100]}
            ]
    
    except Exception as e:
        cards = [{"question": "Error", "answer": str(e)}]
    
    return {
        "success": True,
        "cards": cards,
        "count": len(cards)
    }

@router.get("/history")
async def get_revision_history(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Get revision history for student"""
    
    # TODO: Implement actual history tracking
    
    return {
        "history": [
            {
                "date": "2024-01-15",
                "type": "summary",
                "subject": "Computer Science",
                "topic": "Data Structures"
            },
            {
                "date": "2024-01-14",
                "type": "flashcards",
                "subject": "Mathematics",
                "topic": "Calculus"
            }
        ]
    }
