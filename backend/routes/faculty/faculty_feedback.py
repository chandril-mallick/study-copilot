# Faculty Feedback API Routes

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date
from database.connection import get_db
from models.class_feedback import ClassSession, DailyFeedback, FeedbackResponse
from models.user import User
from routes.auth import get_current_user

router = APIRouter(prefix="/api/faculty/feedback", tags=["Faculty Feedback"])

# Pydantic Models
class RespondToFeedback(BaseModel):
    feedback_id: int
    response: str = Field(..., min_length=1, description="Teacher's response to student feedback")

class StudentFeedbackItem(BaseModel):
    id: int
    student_id: int
    student_name: str
    student_enrollment: Optional[str]
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

class FeedbackStats(BaseModel):
    total_feedback: int
    pending_feedback: int
    responded_feedback: int
    average_rating: float
    rating_distribution: dict

class CreateClassSession(BaseModel):
    subject: str
    topic: Optional[str] = None
    date: datetime

# Endpoints
@router.post("/create-session", status_code=status.HTTP_201_CREATED)
async def create_class_session(
    session_data: CreateClassSession,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new class session (for faculty to mark classes)"""
    
    # Verify user is faculty
    if current_user.role != "faculty":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty can create class sessions"
        )
    
    # Create new class session
    new_session = ClassSession(
        faculty_id=current_user.id,
        subject=session_data.subject,
        topic=session_data.topic,
        date=session_data.date
    )
    
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    return {
        "message": "Class session created successfully",
        "session_id": new_session.id
    }

@router.get("/daily", response_model=List[StudentFeedbackItem])
async def get_daily_feedback(
    date_filter: Optional[date] = None,
    subject_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all feedback for faculty's classes on a specific date"""
    
    # Verify user is faculty
    if current_user.role != "faculty":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty can access this endpoint"
        )
    
    # Build query for faculty's class sessions
    query = db.query(DailyFeedback).join(
        ClassSession, DailyFeedback.class_session_id == ClassSession.id
    ).join(
        User, DailyFeedback.student_id == User.id
    ).options(
        joinedload(DailyFeedback.class_session),
        joinedload(DailyFeedback.response)
    ).filter(
        ClassSession.faculty_id == current_user.id
    )
    
    # Apply date filter
    if date_filter:
        query = query.filter(func.date(ClassSession.date) == date_filter)
    
    # Apply subject filter
    if subject_filter:
        query = query.filter(ClassSession.subject == subject_filter)
    
    feedbacks = query.order_by(DailyFeedback.submitted_at.desc()).all()
    
    # Format response
    result = []
    for feedback in feedbacks:
        student = db.query(User).filter(User.id == feedback.student_id).first()
        
        # Get student enrollment number if available
        from models.student import StudentProfile
        student_profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == feedback.student_id
        ).first()
        
        result.append({
            "id": feedback.id,
            "student_id": feedback.student_id,
            "student_name": student.name if student else "Unknown",
            "student_enrollment": student_profile.enrollment_no if student_profile else None,
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

@router.get("/pending", response_model=List[StudentFeedbackItem])
async def get_pending_feedback(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all unresponded feedback for faculty's classes"""
    
    # Verify user is faculty
    if current_user.role != "faculty":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty can access this endpoint"
        )
    
    # Query for pending feedback
    feedbacks = db.query(DailyFeedback).join(
        ClassSession, DailyFeedback.class_session_id == ClassSession.id
    ).options(
        joinedload(DailyFeedback.class_session)
    ).filter(
        and_(
            ClassSession.faculty_id == current_user.id,
            DailyFeedback.status == "pending"
        )
    ).order_by(DailyFeedback.submitted_at.asc()).all()
    
    # Format response
    result = []
    for feedback in feedbacks:
        student = db.query(User).filter(User.id == feedback.student_id).first()
        
        from models.student import StudentProfile
        student_profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == feedback.student_id
        ).first()
        
        result.append({
            "id": feedback.id,
            "student_id": feedback.student_id,
            "student_name": student.name if student else "Unknown",
            "student_enrollment": student_profile.enrollment_no if student_profile else None,
            "class_session_id": feedback.class_session_id,
            "subject": feedback.class_session.subject,
            "topic": feedback.class_session.topic,
            "date": feedback.class_session.date,
            "rating": feedback.rating,
            "query": feedback.query,
            "status": feedback.status,
            "submitted_at": feedback.submitted_at,
            "teacher_response": None,
            "responded_at": None
        })
    
    return result

@router.post("/respond", status_code=status.HTTP_200_OK)
async def respond_to_feedback(
    response_data: RespondToFeedback,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit response to student feedback"""
    
    # Verify user is faculty
    if current_user.role != "faculty":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty can respond to feedback"
        )
    
    # Get the feedback
    feedback = db.query(DailyFeedback).options(
        joinedload(DailyFeedback.class_session)
    ).filter(
        DailyFeedback.id == response_data.feedback_id
    ).first()
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    # Verify this faculty owns the class session
    if feedback.class_session.faculty_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only respond to feedback for your own classes"
        )
    
    # Check if response already exists
    existing_response = db.query(FeedbackResponse).filter(
        FeedbackResponse.feedback_id == response_data.feedback_id
    ).first()
    
    if existing_response:
        # Update existing response
        existing_response.response = response_data.response
        existing_response.responded_at = datetime.now()
    else:
        # Create new response
        new_response = FeedbackResponse(
            feedback_id=response_data.feedback_id,
            faculty_id=current_user.id,
            response=response_data.response
        )
        db.add(new_response)
    
    # Update feedback status
    feedback.status = "responded"
    
    db.commit()
    
    return {
        "message": "Response submitted successfully",
        "feedback_id": feedback.id
    }

@router.get("/stats", response_model=FeedbackStats)
async def get_feedback_stats(
    date_filter: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get feedback statistics for faculty"""
    
    # Verify user is faculty
    if current_user.role != "faculty":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only faculty can access this endpoint"
        )
    
    # Build base query
    query = db.query(DailyFeedback).join(
        ClassSession, DailyFeedback.class_session_id == ClassSession.id
    ).filter(
        ClassSession.faculty_id == current_user.id
    )
    
    # Apply date filter if provided
    if date_filter:
        query = query.filter(func.date(ClassSession.date) == date_filter)
    
    feedbacks = query.all()
    
    # Calculate statistics
    total_feedback = len(feedbacks)
    pending_feedback = len([f for f in feedbacks if f.status == "pending"])
    responded_feedback = len([f for f in feedbacks if f.status == "responded"])
    
    # Calculate average rating
    if total_feedback > 0:
        average_rating = sum(f.rating for f in feedbacks) / total_feedback
    else:
        average_rating = 0.0
    
    # Rating distribution
    rating_distribution = {
        "1": len([f for f in feedbacks if f.rating == 1]),
        "2": len([f for f in feedbacks if f.rating == 2]),
        "3": len([f for f in feedbacks if f.rating == 3]),
        "4": len([f for f in feedbacks if f.rating == 4]),
        "5": len([f for f in feedbacks if f.rating == 5])
    }
    
    return {
        "total_feedback": total_feedback,
        "pending_feedback": pending_feedback,
        "responded_feedback": responded_feedback,
        "average_rating": round(average_rating, 2),
        "rating_distribution": rating_distribution
    }
