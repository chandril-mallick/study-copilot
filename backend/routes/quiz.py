from fastapi import APIRouter, HTTPException, Form, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Any
from ollama_utils import run_ollama, check_ollama_availability
from embedding_manager import EmbeddingManager
from file_utils import chunk_text
import logging
import re

router = APIRouter()
embedding_manager = EmbeddingManager()

class QuizRequest(BaseModel):
    content: str = ""
    file_type: str = "text"
    subject: str = ""
    topic: str = ""
    difficulty: str = "intermediate"
    numQuestions: int = 5
    questionType: str = "multiple-choice"

class QuizResponse(BaseModel):
    success: bool
    quiz: Dict[str, Any]
    message: str = ""

# Fallback endpoint for FormData (legacy support)
@router.post("/tools/quiz-form", response_model=QuizResponse)
async def generate_quiz_formdata(
    subject: str = Form(...),
    difficulty: str = Form("intermediate"),
    numQuestions: int = Form(5),
    questionType: str = Form("multiple-choice"),
    content: str = Form(""),
    file: UploadFile = File(None)
):
    try:
        # Handle file upload
        if file and file.filename:
            file_content = await file.read()
            content = file_content.decode('utf-8')

        # Create request object
        request = QuizRequest(
            content=content,
            subject=subject,
            topic="",  # No topic in form data
            difficulty=difficulty,
            numQuestions=numQuestions,
            questionType=questionType
        )

        return await generate_quiz(request)
    except Exception as e:
        logging.error(f"Error in quiz form endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

@router.post("/tools/quiz", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    try:
        if not check_ollama_availability():
            raise HTTPException(status_code=503, detail="Ollama service is not available. Please ensure Ollama is running and the gemma3:1b model is installed.")

        if not request.content and not request.subject:
            return QuizResponse(success=False, quiz={}, message="Please provide content or subject information")

        # Process uploaded/pasted content through FAISS indexing
        if request.content and len(request.content.strip()) > 50:
            logging.info(f"Processing uploaded content for quiz ({len(request.content)} chars)")

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
            return QuizResponse(success=False, quiz={}, message="Please provide meaningful content or subject/topic information")

        logging.info(f"Searching for relevant content with query: '{search_query}'")
        search_results = embedding_manager.search(search_query, top_k=min(10, request.numQuestions * 3))  # Get more results for better coverage

        if not search_results:
            return QuizResponse(success=False, quiz={}, message=f"No relevant materials found for '{search_query}'. Please upload relevant study materials first.")

        # Combine relevant chunks into context
        relevant_chunks = [result['text'] for result in search_results]
        context = "\n\n".join(relevant_chunks)
        context_sources = [f"Chunk {result['metadata'].get('chunk_index', 'N/A')} (score: {result['score']:.3f})" for result in search_results]

        logging.info(f"Found {len(relevant_chunks)} relevant chunks with sources: {context_sources}")

        # Generate quiz using the context
        prompt = f"""
📦 Output Format: JSON

🎯 You are Dabbabot — an expert AI educator that creates intelligent and adaptive quizzes for teachers.

📝 Task: Generate clear, accurate, and concept-based quiz questions **ONLY** from the provided context below.

🧠 Guidelines:
1. **ANALYZE ONLY the provided context** — extract key definitions, concepts, facts, and relationships directly from the chunks.
2. **STRICTLY BASE questions on the context** — every question must be answerable using information from the provided chunks.
3. **Consider chunk relevance scores** — prioritize information from higher-scoring (more relevant) chunks.
4. Create questions that test understanding, not just memorization.
5. Question type: {request.questionType}
6. Each question must have:
   - **question** — concise, concept-checking question based ONLY on the provided context
   - **options** — 4 multiple choice options in format "A) actual option text B) actual option text C) actual option text D) actual option text" (only for multiple-choice)
   - **correct_answer** — the letter (A, B, C, or D) of the correct option (only for multiple-choice) or the correct answer text
   - **explanation** — brief explanation of why the answer is correct, based on the context

📝 Context Information:
- Search Query: "{search_query}"
- Question Type: {request.questionType}
- Difficulty: {request.difficulty}
- Relevant Chunks Found: {len(relevant_chunks)}
- Source Chunks: {', '.join(context_sources)}
- Context Length: {len(context)} characters

📝 Context Content:
{context[:4000]}

⚠️ **IMPORTANT**: All questions and answers must be derived directly from the provided context chunks. If a chunk doesn't contain enough information for a question, skip that concept.

📝 Output Format:
{{
  "questions": [
    {{
      "question": "What is the main concept discussed?",
      "options": ["A) First concept", "B) Second concept", "C) Third concept", "D) Fourth concept"],
      "correct_answer": "B",
      "explanation": "The context discusses the second concept in detail."
    }}
  ]
}}

🤔 Please generate {request.numQuestions} {request.questionType} quiz questions **BASED ONLY** on the provided context chunks above. Do not use any external knowledge or general information about the topic.
"""

        logging.info("Sending prompt to AI model...")
        ai_response = run_ollama(prompt)
        if ai_response is None:
            raise HTTPException(status_code=503, detail="Failed to get response from Ollama AI model")

        # Parse the JSON response
        questions = []
        try:
            import json

            # Helper to clean and extract JSON
            def clean_and_extract_json(text):
                # Remove markdown code blocks
                text = re.sub(r'```json\s*', '', text)
                text = re.sub(r'```\s*', '', text)
                
                # Try to find the outer object definition
                match = re.search(r'\{.*\}', text, re.DOTALL)
                if match:
                    return match.group(0)
                
                # Fallback: Try to find just the list
                match_list = re.search(r'\[.*\]', text, re.DOTALL)
                if match_list:
                    return f'{{"questions": {match_list.group(0)}}}'
                
                return text

            json_str = clean_and_extract_json(ai_response)
            parsed_data = json.loads(json_str)

            # Handle case where it returns just a list instead of {"questions": [...]}
            if isinstance(parsed_data, list):
                questions = parsed_data
            else:
                questions = parsed_data.get("questions", [])

            # Clean up questions and ensure proper format
            cleaned_questions = []
            for q in questions:
                if isinstance(q, dict) and 'question' in q:
                    question = {
                        "question": q.get("question", ""),
                        "correct_answer": q.get("correct_answer", ""),
                        "explanation": q.get("explanation", "")
                    }

                    # Handle options based on question type
                    if request.questionType == "multiple-choice":
                        options = q.get("options", [])
                        if isinstance(options, str):
                            # If options is a string, split by common delimiters
                            options = [opt.strip() for opt in re.split(r'[A-D]\)', options) if opt.strip()]
                        question["options"] = options[:4]  # Ensure max 4 options
                    else:
                        question["options"] = []

                    cleaned_questions.append(question)

            questions = cleaned_questions
            logging.info(f"Successfully parsed {len(questions)} quiz questions from AI response")

        except Exception as e:
            logging.error(f"Error parsing quiz response: {str(e)}")
            logging.error(f"Raw AI response: {ai_response}")
            return QuizResponse(success=False, quiz={}, message="Failed to parse AI response. Please try again.")

        return QuizResponse(
            success=True,
            quiz={"questions": questions[:request.numQuestions]},
            message=f"Generated {len(questions)} quiz questions using FAISS vector search and {len(relevant_chunks)} relevant content chunks"
        )

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error generating quiz: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")
