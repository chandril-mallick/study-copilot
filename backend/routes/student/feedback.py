# Student Feedback API Routes

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date
from database.connection import get_db
from models.class_feedback import ClassSession, DailyFeedback, FeedbackResponse
from models.user import User
from routes.auth import get_current_user

router = APIRouter(prefix="/api/student/feedback", tags=["Student Feedback"])

# Pydantic Models
class FeedbackSubmit(BaseModel):
    class_session_id: int
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5 stars")
    query: Optional[str] = Field(None, description="Student's question or comment")

class FeedbackResponse(BaseModel):
    id: int
    class_session_id: int
    subject: str
    topic: Optional[str]
    date: datetime
    rating: int
    query: Optional[str]
    status: str
    submitted_at: datetime
    teacher_response: Optional[str]
    responded_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class ClassSessionResponse(BaseModel):
    id: int
    subject: str
    topic: Optional[str]
    date: datetime
    faculty_name: str
    
    class Config:
        from_attributes = True

# Endpoints
@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    feedback_data: FeedbackSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit daily class feedback"""
    
    # Verify user is a student
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can submit feedback"
        )
    
    # Check if class session exists
    class_session = db.query(ClassSession).filter(
        ClassSession.id == feedback_data.class_session_id
    ).first()
    
    if not class_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class session not found"
        )
    
    # Check if feedback already exists for this student and class
    existing_feedback = db.query(DailyFeedback).filter(
        DailyFeedback.class_session_id == feedback_data.class_session_id,
        DailyFeedback.student_id == current_user.id
    ).first()
    
    if existing_feedback:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted feedback for this class"
        )
    
    # Create new feedback
    new_feedback = DailyFeedback(
        class_session_id=feedback_data.class_session_id,
        student_id=current_user.id,
        rating=feedback_data.rating,
        query=feedback_data.query,
        status="pending"
    )
    
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    
    return {
        "message": "Feedback submitted successfully",
        "feedback_id": new_feedback.id
    }

@router.get("/my-feedback", response_model=List[FeedbackResponse])
async def get_my_feedback(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get student's feedback history with teacher responses"""
    
    # Verify user is a student
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access this endpoint"
        )
    
    # Get all feedback for this student with class session and response details
    feedbacks = db.query(DailyFeedback).options(
        joinedload(DailyFeedback.class_session),
        joinedload(DailyFeedback.response)
    ).filter(
        DailyFeedback.student_id == current_user.id
    ).order_by(
        DailyFeedback.submitted_at.desc()
    ).all()
    
    # Format response
    result = []
    for feedback in feedbacks:
        result.append({
            "id": feedback.id,
            "class_session_id": feedback.class_session_id,
            "subject": feedback.class_session.subject,
            "topic": feedback.class_session.topic,
            "date": feedback.class_session.date,
            "rating": feedback.rating,
            "query": feedback.query,
            "status": feedback.status,
            "submitted_at": feedback.submitted_at,
            "teacher_response": feedback.response.response if feedback.response else None,
            "responded_at": feedback.response.responded_at if feedback.response else None
        })
    
    return result

@router.get("/class-sessions", response_model=List[ClassSessionResponse])
async def get_class_sessions(
    date_filter: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get available class sessions for feedback submission"""
    
    # Verify user is a student
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can access this endpoint"
        )
    
    # Build query
    query = db.query(ClassSession).join(User, ClassSession.faculty_id == User.id)
    
    # Filter by date if provided (default to today)
    if date_filter:
        query = query.filter(func.date(ClassSession.date) == date_filter)
    else:
        today = datetime.now().date()
        query = query.filter(func.date(ClassSession.date) == today)
    
    class_sessions = query.order_by(ClassSession.date.desc()).all()
    
    # Format response
    result = []
    for session in class_sessions:
        faculty = db.query(User).filter(User.id == session.faculty_id).first()
        result.append({
            "id": session.id,
            "subject": session.subject,
            "topic": session.topic,
            "date": session.date,
            "faculty_name": faculty.name if faculty else "Unknown"
        })
    
    return result
