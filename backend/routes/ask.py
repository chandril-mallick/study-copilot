from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from ollama_utils import run_ollama, check_ollama_availability
from embedding_manager import EmbeddingManager
from math_utils import solve_math_query

router = APIRouter()

embedding_manager = EmbeddingManager()

class QuestionRequest(BaseModel):
    question: str
    language: str = "en"
    use_context: bool = True
    math_mode: bool = False

class QuestionResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]

@router.post("/ask", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    try:
        import logging
        logger = logging.getLogger(__name__)
        question = request.question.strip()
        lang = request.language.lower() if hasattr(request, 'language') else "en"
        use_context = getattr(request, 'use_context', False)
        math_mode = getattr(request, 'math_mode', False)
        logger.info(f"Received question: {question} | use_context: {use_context} | math_mode: {math_mode}")
        
        # Check for math query first
        # If math_mode is ON, we prioritize math solving or use it to inform detection
        math_solution = solve_math_query(question)
        if math_solution or math_mode:
            if math_solution:
                logger.info("Math query detected and solved.")
                return QuestionResponse(
                    answer=math_solution,
                    sources=[]
                )
            elif math_mode:
                logger.info("Math mode ON: Attempting rigorous math response via LLM")
                # If SymPy couldn't solve it but math_mode is ON, we can prompt LLM with math focus
                prompt = f"""
Goal: Solve the following mathematical problem following the exact structure of "Principles of Discrete Applied Mathematics".

Course: MIT 18.200 Principles of Discrete Applied Mathematics
Question: {question}

Rules:
1. Use EXACTLY this header structure at the very top:
   #### Principles of Discrete Applied Mathematics
   ### [Category: Operation Type]

2. Use horizontal rules (---) between sections.
3. Divide the explanation into EXACTLY these 4 or 5 numbered sections:
   **1. Problem Statement** (State the problem clearly in LaTeX)
   **2. Theoretical Foundation** (Briefly explain the underlying concept)
   **3. Analytical Derivation** (Provide step-by-step rigorous solving)
   **4. Final Analytical Result** (The answer in a bold boxed-style LaTeX expression: $$ \\mathbf{{result}} $$)
   **5. Mathematical Insight** (Brief note on the significance)

4. Use LaTeX for ALL math ($...$ or $$...$$).
5. If you identify an error in the user's provided reasoning, politely correct it with the right formula in the derivation.
"""
                ai_response = run_ollama(prompt)
                return QuestionResponse(
                    answer=ai_response or "I'm sorry, I couldn't solve this mathematical problem.",
                    sources=[]
                )

        lang_map = {
            "en": "English",
            "hi": "Hindi",
            "bn": "Bangla",
            "bengali": "Bangla",
            "hindi": "Hindi"
        }
        target_lang = lang_map.get(lang, "English")
        if not question:
            logger.warning("Question is empty")
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        if not check_ollama_availability():
            logger.error("Ollama service is not available")
            raise HTTPException(status_code=503, detail="Ollama service is not available. Please ensure Ollama is running and the gemma3:1b model is installed.")
        if not use_context:
            logger.info("Context OFF: Providing general answer")
            prompt = f"Question: {question}\n\nPlease provide a general answer to this question in {target_lang}."
            ai_response = run_ollama(prompt)
            return QuestionResponse(
                answer=ai_response or f"Sorry, I don't have enough information to answer this question.",
                sources=[]
            )
        logger.info("Context ON: Searching for relevant context in FAISS index")
        search_results = embedding_manager.search(question, top_k=3)
        logger.info(f"Search results: {len(search_results)} found")
        if not search_results:
            logger.info("No relevant context found, providing general answer")
            prompt = f"Question: {question}\n\nPlease provide a general answer to this question in {target_lang}."
            ai_response = run_ollama(prompt)
            return QuestionResponse(
                answer=ai_response or f"Sorry, I don't have enough information to answer this question.",
                sources=[]
            )
        context = "\n\n".join([result['text'] for result in search_results])
        logger.info(f"Context used in prompt (first 200 chars): {context[:200]}")
        prompt = f"""
Context:
{context}

Question: {question}

Please provide a highly structured and educational answer in {target_lang} based ONLY on the context above.

Follow this exact structure:
1. **Definition**: Start with a strong, bolded definition.
2. **Key Points**: Use bullet points with emojis for main features.
3. **Examples**: Provide real-world or context-based examples.
4. **Types/Categories** (if applicable): Use subheadings.
5. **Simple Explanation**: A "How it works" or simplified flow if possible.
6. **Importance**: Why it matters.
7. **One-line Exam Definition**: A distinct blockquote for a concise definition.

Formatting Rules:
- Use Markdown headers () for sections.
- Use emojis generously (e.g., 🧠, 📚, 🚀).
- Use code blocks for flows or processes.
- Keep sentences clear and concise.
- If the context doesn't have enough info for a section, skip that section but keep the rest.
- Do not use filler phrases like "Based on the text".
"""
        ai_response = run_ollama(prompt)
        if ai_response is None:
            logger.error("Failed to get response from AI model")
            raise HTTPException(status_code=503, detail="Failed to get response from AI model")
        sources = [{
            "text": result['text'][:200] + "..." if len(result['text']) > 200 else result['text'],
            "score": result['score'],
            "metadata": result['metadata']
        } for result in search_results]
        logger.info(f"Returning answer with {len(sources)} sources")
        return QuestionResponse(
            answer=ai_response,
            sources=sources
        )
    except HTTPException:
        raise
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Error processing question: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process question: {str(e)}")
