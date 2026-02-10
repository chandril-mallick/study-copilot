# Student Assignment Assistant API

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database.connection import get_db
from models.user import User
from models.assignment import Assignment, Submission
from middleware.rbac import require_student
from models.user import UserRole
from routes.auth import get_current_user
from ollama_utils import run_ollama

router = APIRouter(prefix="/api/student/assignments", tags=["Student - Assignments"])

class AssignmentListItem(BaseModel):
    id: int
    title: str
    subject: str
    due_date: Optional[datetime]
    status: str
    submitted: bool

class AssignmentDetail(BaseModel):
    id: int
    title: str
    description: str
    subject: str
    due_date: Optional[datetime]
    max_marks: float
    submission: Optional[dict]

class HintRequest(BaseModel):
    question: str
    context: Optional[str] = None

def require_student_or_faculty(current_user: User = Depends(get_current_user)):
    """Allow both students and faculty to access assignments"""
    if current_user.role not in [UserRole.STUDENT, UserRole.FACULTY]:
        raise HTTPException(
            status_code=403,
            detail="Student or Faculty access required"
        )
    return current_user

@router.get("", response_model=List[AssignmentListItem])
async def list_assignments(
    current_user: User = Depends(require_student_or_faculty),
    db: Session = Depends(get_db)
):
    """List all assignments (for students and faculty)"""
    
    # TODO: Filter by student's courses/subjects
    assignments = db.query(Assignment).all()
    
    result = []
    for assignment in assignments:
        # Check if student has submitted
        submission = db.query(Submission).filter(
            Submission.assignment_id == assignment.id,
            Submission.student_id == current_user.id
        ).first()
        
        status = "pending"
        if submission:
            status = submission.status
        elif assignment.due_date and assignment.due_date < datetime.now():
            status = "overdue"
        
        result.append({
            "id": assignment.id,
            "title": assignment.title,
            "subject": assignment.subject,
            "due_date": assignment.due_date,
            "status": status,
            "submitted": submission is not None
        })
    
    return result

@router.get("/{assignment_id}", response_model=AssignmentDetail)
async def get_assignment(
    assignment_id: int,
    current_user: User = Depends(require_student_or_faculty),
    db: Session = Depends(get_db)
):
    """Get assignment details"""
    
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    submission = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.student_id == current_user.id
    ).first()
    
    submission_data = None
    if submission:
        submission_data = {
            "id": submission.id,
            "submitted_at": submission.submitted_at,
            "grade": submission.grade,
            "feedback": submission.feedback,
            "grade": submission.grade,
            "feedback": submission.feedback,
            "grade": submission.grade,
            "feedback": submission.feedback,
            "grade": submission.grade,
            "feedback": submission.feedback,
            "status": submission.status,
            "content": submission.content,
            "content": submission.content,
            "content": submission.content
        }
    
    return {
        "id": assignment.id,
        "title": assignment.title,
        "description": assignment.description,
        "subject": assignment.subject,
        "due_date": assignment.due_date,
        "max_marks": assignment.max_marks,
        "submission": submission_data
    }

@router.post("/{assignment_id}/hints")
async def get_assignment_hints(
    assignment_id: int,
    request: HintRequest,
    current_user: User = Depends(require_student),  # Only students can get hints
    db: Session = Depends(get_db)
):
    """Get AI-powered hints for assignment (plagiarism-safe)"""
    
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    # Create a prompt that gives hints without direct answers
    prompt = f"""You are a helpful teaching assistant. A student is working on an assignment about {assignment.subject}.
    
    Assignment question: {request.question}
    {f"Student's current understanding: {request.context}" if request.context else ""}
    
    Provide helpful hints and guidance WITHOUT giving the direct answer:
    1. Break down the problem into smaller steps
    2. Suggest relevant concepts to review
    3. Ask guiding questions
    4. Provide analogies or examples from different contexts
    
    Remember: Guide them to discover the answer themselves. Don't solve it for them.
    """
    
    try:
        hints = run_ollama(prompt, model="gemma3:1b")
    except Exception as e:
        hints = f"Error generating hints: {str(e)}"
    
    return {
        "assignment_id": assignment_id,
        "hints": hints,
        "reminder": "These are hints to guide your thinking. Make sure to write your answer in your own words."
    }

class SubmitAssignmentRequest(BaseModel):
    content: str

@router.post("/{assignment_id}/submit")
async def submit_assignment(
    assignment_id: int,
    request: SubmitAssignmentRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Submit assignment"""
    
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    # Check if already submitted
    existing = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.student_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Assignment already submitted")
    
    # Create submission
    submission = Submission(
        assignment_id=assignment_id,
        student_id=current_user.id,
        content=request.content,
        status="submitted"
    )
    
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    return {
        "success": True,
        "submission_id": submission.id,
        "message": "Assignment submitted successfully"
    }

class PlagiarismCheckRequest(BaseModel):
    content: str

@router.post("/{assignment_id}/plagiarism-check")
async def check_plagiarism(
    assignment_id: int,
    request: PlagiarismCheckRequest,
    current_user: User = Depends(require_student)
):
    """Check plagiarism score (self-check before submission)"""
    
    # TODO: Implement actual plagiarism detection
    # For now, return mock score
    
    import random
    plagiarism_score = random.uniform(5.0, 25.0)
    
    return {
        "plagiarism_score": round(plagiarism_score, 2),
        "status": "safe" if plagiarism_score < 15 else "warning",
        "message": "Low plagiarism detected" if plagiarism_score < 15 else "Consider rephrasing some sections"
    }

@router.put("/{assignment_id}/submit")
async def update_submission(
    assignment_id: int,
    request: SubmitAssignmentRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Update an existing submission"""
    
    submission = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.student_id == current_user.id
    ).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    submission.content = request.content
    submission.submitted_at = datetime.now() # Update timestamp
    
    db.commit()
    db.refresh(submission)
    
    return {
        "success": True,
        "submission_id": submission.id,
        "message": "Submission updated successfully"
    }

@router.delete("/{assignment_id}/submit")
async def delete_submission(
    assignment_id: int,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Delete a submission"""
    
    submission = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.student_id == current_user.id
    ).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    db.delete(submission)
    db.commit()
    
    return {
        "success": True,
        "message": "Submission deleted successfully"
    }
