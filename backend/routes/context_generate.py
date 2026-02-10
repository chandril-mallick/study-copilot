from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Any
import logging
from embedding_manager import EmbeddingManager
from ollama_utils import run_ollama, check_ollama_availability

# ---------------------------------------
# 🪶 Setup
# ---------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("context_generate")

router = APIRouter()
embedding_manager = EmbeddingManager()


# ---------------------------------------
# 🧩 Models
# ---------------------------------------
class QuestionRequest(BaseModel):
    question: str
    language: str = "en"
    use_context: bool = True


class QuestionResponse(BaseModel):
    answer: str
    formatted: Dict[str, Any]
    sources: List[Dict[str, Any]]


# ---------------------------------------
# ⚙️ Contextual Generation Endpoint
# ---------------------------------------
@router.post("/api/ai/context-generate", response_model=QuestionResponse)
async def context_generate(request: QuestionRequest):
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="❌ Question cannot be empty.")

    # Normalize language
    lang_map = {
        "en": "English",
        "hi": "Hindi",
        "bn": "Bangla",
        "bengali": "Bangla",
        "hindi": "Hindi",
    }
    lang = request.language.lower().strip() if hasattr(request, "language") else "en"
    target_lang = lang_map.get(lang, "English")

    try:
        # 🧠 Check Ollama
        if not check_ollama_availability():
            raise HTTPException(
                status_code=503,
                detail="⚠️ Ollama service unavailable. Please ensure the model is running.",
            )

        # 🔍 Search Embeddings (if enabled)
        search_results = []
        if request.use_context:
            try:
                search_results = embedding_manager.search(question, top_k=8)
            except Exception as e:
                logger.warning(f"Embedding search failed: {e}")

        # 🎯 Filter & Sort by Relevance
        RELEVANCE_THRESHOLD = 0.55
        relevant_results = [
            r for r in search_results if r.get("score", 0) >= RELEVANCE_THRESHOLD
        ]
        relevant_results.sort(key=lambda x: x["score"], reverse=True)

        # 🧾 If no context, fallback to standalone answer
        if not relevant_results:
            prompt = f"""
You are Dabbabot — a professional AI tutor who provides detailed and engaging explanations.

Rules:
1. say "I am sorry, I do not have enough information to answer that question." if you cannot answer.

User Question: {question}

Answer in {target_lang}:
"""
            ai_response = run_ollama(prompt)
            if not ai_response or len(ai_response.strip()) < 10:
                raise HTTPException(status_code=500, detail="⚠️ Empty AI response.")
            return QuestionResponse(
                answer=ai_response.strip(),
                formatted={
                    "title": "📘 AI Contextual Answer",
                    "language": target_lang,
                    "follow_ups_section": "💡 Suggested Follow-Ups",
                },
                sources=[],
            )

        # 🧱 Combine Context
        weighted_contexts = []
        for idx, result in enumerate(relevant_results[:5], start=1):
            weight = 1.5 if idx == 1 else 1.2 if idx == 2 else 1.0
            score = result.get("score", 0)
            text = result["text"].strip()
            metadata = result.get("metadata", {})
            label = metadata.get("filename", f"Reference {idx}")
            weighted_contexts.append(
                f"[{label}] (Relevance: {round(score * weight, 3)})\n{text}"
            )

        merged_context = "\n\n".join(weighted_contexts)

        # 💬 Structured Prompt (Professional Output)
        prompt = f"""
You are Dabbabot — a professional contextual AI educator.
Read the context below and answer the question clearly.

---context---
{merged_context}
---endcontext---

Question: {question}

1. Write the answer **like a student-friendly note or definition**, similar to a textbook.
  
2. Keep the tone **educational, formal, and easy to understand**.
3. Use **Markdown formatting** for clarity:
   - 💡 **Heading** for topic or concept name
   - **Bold** key terms
   - Use simple bullet points only when needed
4. Avoid unnecessary jargon or advanced technical words.
4. End with a section:
    💡 Suggested Follow-Ups
   - Related Question 1
   - Related Question 2
5. If not enough data, say "_Not enough context available to answer confidently._"
"""

        ai_response = run_ollama(prompt)
        if not ai_response or len(ai_response.strip()) < 10:
            raise HTTPException(status_code=500, detail="⚠️ Invalid AI response.")

        # 📚 Build Sources Summary
        sources = []
        for r in relevant_results[:5]:
            metadata = r.get("metadata", {})
            sources.append(
                {
                    "text": (
                        r["text"][:250] + "..."
                        if len(r["text"]) > 250
                        else r["text"]
                    ),
                    "score": round(r.get("score", 0), 3),
                    "relevance": (
                        "High"
                        if r["score"] >= 0.8
                        else "Medium"
                        if r["score"] >= 0.6
                        else "Low"
                    ),
                    "metadata": {
                        **metadata,
                        "excerpt_length": len(r["text"]),
                        "full_match": r["score"] >= 0.8,
                    },
                }
            )

        # 🧾 Log output summary
        logger.info(
            {
                "event": "context_generation_complete",
                "question_preview": question[:80],
                "num_sources": len(relevant_results),
                "language": target_lang,
            }
        )

        # ✅ Return professional structured response
        return QuestionResponse(
            answer=ai_response.strip(),
            formatted={
                "title": "📘 AI Contextual Answer",
                "language": target_lang,
                "follow_ups_section": "💡 Suggested Follow-Ups",
            },
            sources=sources,
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.exception("❌ Unexpected error in context_generate")
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred while generating the response.",
        )
