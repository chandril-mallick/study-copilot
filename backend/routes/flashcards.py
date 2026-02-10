from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from ollama_utils import run_ollama, check_ollama_availability
from embedding_manager import EmbeddingManager
from file_utils import chunk_text
import logging
import re

router = APIRouter()
embedding_manager = EmbeddingManager()

class FlashCardRequest(BaseModel):
    content: str = ""
    file_type: str = "text"
    subject: str = ""
    topic: str = ""
    difficulty: str = "intermediate"
    numCards: int = 10
    cardType: str = "mcq"  # mcq, true_false, short_answer
    priorityAreas: List[str] = []

class FlashCardResponse(BaseModel):
    success: bool
    cards: List[Dict[str, Any]]
    message: str = ""

@router.post("/tools/flashcards", response_model=FlashCardResponse)
async def generate_flashcards(request: FlashCardRequest):
    try:
        if not check_ollama_availability():
            raise HTTPException(status_code=503, detail="Ollama service is not available. Please ensure Ollama is running and the gemma3:1b model is installed.")

        if not request.content and not request.subject:
            return FlashCardResponse(success=False, cards=[], message="Please provide content or subject information")

        # Process uploaded/pasted content through FAISS indexing
        if request.content and len(request.content.strip()) > 50:
            logging.info(f"Processing uploaded content ({len(request.content)} chars)")

            # Chunk the content intelligently
            chunks = chunk_text(request.content.strip(), chunk_size=500)
            logging.info(f"Created {len(chunks)} chunks from content")

            if chunks:
                # Add chunks to FAISS index with metadata
                chunk_metadata = [{
                    "source": "uploaded_content",
                    "subject": request.subject,
                    "topic": request.topic,
                    "chunk_index": i,
                    "content_length": len(chunk)
                } for i, chunk in enumerate(chunks)]

                doc_ids = embedding_manager.add_documents(chunks, chunk_metadata)
                logging.info(f"Added {len(chunks)} chunks to FAISS index with IDs: {doc_ids}")

            # Use the uploaded content for search
            search_query = f"{request.subject} {request.topic}".strip() if request.subject or request.topic else request.content[:100]
        else:
            # No new content, use existing indexed materials
            search_query = f"{request.subject} {request.topic}".strip()

        # Perform vector search to find relevant chunks
        if not search_query:
            return FlashCardResponse(success=False, cards=[], message="Please provide meaningful content or subject/topic information")

        logging.info(f"Searching for relevant content with query: '{search_query}'")
        search_results = embedding_manager.search(search_query, top_k=min(10, request.numCards * 2))  # Get more results for better coverage

        if not search_results:
            return FlashCardResponse(success=False, cards=[], message=f"No relevant materials found for '{search_query}'. Please upload relevant study materials first.")

        # Combine relevant chunks into context
        relevant_chunks = [result['text'] for result in search_results]
        context = "\n\n".join(relevant_chunks)
        context_sources = [f"Chunk {result['metadata'].get('chunk_index', 'N/A')} (score: {result['score']:.3f})" for result in search_results]

        logging.info(f"Found {len(relevant_chunks)} relevant chunks with sources: {context_sources}")

        # Generate flashcards using the context
        prompt = f"""
📦 Output Format: JSON

🎯 You are Dabbabot — an expert AI educator that creates intelligent and adaptive flashcards for learners.

📝 Task: Generate clear, accurate, and concept-based MCQ flashcards **ONLY** from the provided context below. Create actual questions and options based on the content, not placeholder text.

🧠 Guidelines:
1. **ANALYZE ONLY the provided context** — extract key definitions, concepts, facts, and relationships directly from the chunks.
2. **STRICTLY BASE questions on the context** — every question must be answerable using information from the provided chunks.
3. **Consider chunk relevance scores** — prioritize information from higher-scoring (more relevant) chunks.
4. Create flashcards that test understanding, not just memorization.
5. Each flashcard must have:
   - **question** — concise, concept-checking question based ONLY on the provided context (replace the example with actual question)
   - **answer** — simple, factual explanation from the context
   - **options** — 4 multiple choice options in format "A) actual option text B) actual option text C) actual option text D) actual option text" (replace the example with actual options from the context)
   - **correct_answer** — the letter (A, B, C, or D) of the correct option
   - **explanation** — brief explanation of why the answer is correct, based on the context (replace the example with actual explanation)
   - **difficulty** — reflect based on user input (Beginner/Intermediate/Advanced)
   - **priority** — reflect based on user input (High/Medium/Low)

📝 Output Format:
[
  {{
    "question": "What is machine learning?",
    "options": "A) A type of computer hardware B) A method of data analysis that automates analytical model building C) A programming language D) A database management system",
    "correct_answer": "B",
    "explanation": "Machine learning is a method of data analysis that automates analytical model building using algorithms that iteratively learn from data.",
    "difficulty": "Beginner",
    "priority": "High"
  }}
]

⚠️ **CRITICAL**: Replace all placeholder text in the examples below with actual content derived from the provided context. Do not use "..." or example text.

📝 Context Information:
- Search Query: "{search_query}"
- Relevant Chunks Found: {len(relevant_chunks)}
- Source Chunks: {', '.join(context_sources)}
- Context Length: {len(context)} characters

📝 Context Content:
{context[:4000]}

⚠️ **IMPORTANT**: All questions and answers must be derived directly from the provided context chunks. If a chunk doesn't contain enough information for a question, skip that concept.

🤔 Please generate {request.numCards} MCQ flashcards **BASED ONLY** on the provided context chunks above. Do not use any external knowledge or general information about the topic. Replace all placeholder text with actual content from the context. Generate real questions, real options, and real explanations.
"""

        logging.info("Sending prompt to AI model...")
        ai_response = run_ollama(prompt)
        if ai_response is None:
            raise HTTPException(status_code=503, detail="Failed to get response from Ollama AI model")

        # Parse the JSON response
        cards = []
        try:
            import json

            # Clean the response to extract JSON
            json_match = re.search(r'\[.*\]', ai_response, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                parsed_cards = json.loads(json_str)
            else:
                # Fallback: try to parse the entire response as JSON
                parsed_cards = json.loads(ai_response)

            for card in parsed_cards:
                if isinstance(card, dict) and 'question' in card and 'options' in card:
                    # Clean up options format if needed
                    options = card.get("options", "")
                    if isinstance(options, str):
                        # Remove any placeholder text like "..."
                        options = options.replace("...", "").strip()
                        # Ensure proper A) B) C) D) format
                        if not options or options == "A)  B)  C)  D) ":
                            continue  # Skip cards with empty or placeholder options

                    cards.append({
                        "question": card.get("question", ""),
                        "options": options,
                        "correct_answer": card.get("correct_answer", ""),
                        "explanation": card.get("explanation", ""),
                        "difficulty": card.get("difficulty", request.difficulty.capitalize()),
                        "priority": card.get("priority", "Medium")
                    })

            logging.info(f"Successfully parsed {len(cards)} flashcards from AI response")

        except Exception as e:
            logging.error(f"Error parsing flashcard response: {str(e)}")
            logging.error(f"Raw AI response: {ai_response}")
            return FlashCardResponse(success=False, cards=[], message="Failed to parse AI response. Please try again.")

        # Apply priority area filtering if specified
        if request.priorityAreas:
            priority_order = {'high': 3, 'medium': 2, 'low': 1}
            cards.sort(key=lambda x: priority_order.get(x.get('priority', 'medium'), 2), reverse=True)

        return FlashCardResponse(
            success=True,
            cards=cards[:request.numCards],
            message=f"Generated {len(cards)} flashcards using FAISS vector search and {len(relevant_chunks)} relevant content chunks"
        )

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error generating flashcards: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate flashcards: {str(e)}")
