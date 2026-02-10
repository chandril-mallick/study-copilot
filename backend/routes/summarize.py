from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ollama_utils import run_ollama, check_ollama_availability

router = APIRouter()

class SummarizeRequest(BaseModel):
    content: str
    maxLength: int = 200

class SummarizeResponse(BaseModel):
    success: bool
    summary: str
    message: str = ""

@router.post("/tools/summarize", response_model=SummarizeResponse)
async def summarize_text(request: SummarizeRequest):
    try:
        if not check_ollama_availability():
            raise HTTPException(status_code=503, detail="Ollama service is not available. Please ensure Ollama is running and the gemma3:1b model is installed.")
        prompt = f"Summarize the following content in under {request.maxLength} words.\n\nContent:\n{request.content}"
        ai_response = run_ollama(prompt)
        if ai_response is None:
            raise HTTPException(status_code=503, detail="Failed to get response from Ollama AI model")
        return SummarizeResponse(success=True, summary=ai_response.strip())
    except HTTPException:
        raise
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Error summarizing content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to summarize content: {str(e)}")
