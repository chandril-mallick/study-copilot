# Student AI Tutor API

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from database.connection import get_db
from models.user import User
from models.chat import ChatSession, ChatMessage
from middleware.rbac import require_student
from routes.auth import get_current_user
from ollama_utils import run_ollama
import json

router = APIRouter(prefix="/api/student/tutor", tags=["Student - AI Tutor"])

class ChatRequest(BaseModel):
    message: str
    mode: str = "explain"  # explain, socratic, eli5, advanced
    session_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    session_id: int
    mode: str

class TutorMode(BaseModel):
    id: str
    name: str
    description: str
    icon: str

@router.get("/modes", response_model=List[TutorMode])
async def get_tutor_modes():
    """Get available AI tutor modes"""
    return [
        {
            "id": "explain",
            "name": "Explain",
            "description": "Clear, detailed explanations",
            "icon": "📚"
        },
        {
            "id": "socratic",
            "name": "Socratic",
            "description": "Learn through guided questions",
            "icon": "💭"
        },
        {
            "id": "eli5",
            "name": "ELI5",
            "description": "Explain like I'm 5 years old",
            "icon": "🧒"
        },
        {
            "id": "advanced",
            "name": "Advanced",
            "description": "In-depth technical discussion",
            "icon": "🎓"
        }
    ]

@router.post("/chat", response_model=ChatResponse)
async def chat_with_tutor(
    request: ChatRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Chat with AI tutor in different modes"""
    
    # Get or create session
    if request.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == request.session_id,
            ChatSession.user_id == current_user.id
        ).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        session = ChatSession(
            user_id=current_user.id,
            title=f"AI Tutor - {request.mode.capitalize()}"
        )
        db.add(session)
        db.commit()
        db.refresh(session)
    
    # Save user message
    user_message = ChatMessage(
        session_id=session.id,
        role="user",
        content=request.message
    )
    db.add(user_message)
    db.commit()
    
    # Prepare prompt based on mode
    mode_prompts = {
        "explain": "You are a helpful tutor. Provide clear, detailed explanations with examples.",
        "socratic": "You are a Socratic tutor. Guide the student to discover answers through thoughtful questions. Don't give direct answers.",
        "eli5": "You are explaining to a 5-year-old. Use simple language, analogies, and avoid jargon.",
        "advanced": "You are an expert professor. Provide in-depth technical explanations with advanced concepts."
    }
    
    system_prompt = mode_prompts.get(request.mode, mode_prompts["explain"])
    full_prompt = f"{system_prompt}\n\nStudent question: {request.message}\n\nResponse:"
    
    # Get AI response
    try:
        ai_response = run_ollama(full_prompt, model="gemma3:1b")
    except Exception as e:
        ai_response = f"I'm having trouble connecting to the AI service. Error: {str(e)}"
    
    # Save AI response
    assistant_message = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=ai_response
    )
    db.add(assistant_message)
    db.commit()
    
    return {
        "response": ai_response,
        "session_id": session.id,
        "mode": request.mode
    }

@router.post("/explain")
async def get_step_by_step_explanation(
    topic: str,
    difficulty: str = "intermediate",
    current_user: User = Depends(require_student)
):
    """Get step-by-step explanation of a topic"""
    
    prompt = f"""Provide a step-by-step explanation of {topic} at {difficulty} level.
    
    Format your response as:
    1. Overview
    2. Step-by-step breakdown
    3. Example
    4. Common mistakes to avoid
    5. Practice suggestions
    """
    
    try:
        explanation = run_ollama(prompt, model="gemma3:1b")
    except Exception as e:
        explanation = f"Error generating explanation: {str(e)}"
    
    return {
        "topic": topic,
        "difficulty": difficulty,
        "explanation": explanation
    }
