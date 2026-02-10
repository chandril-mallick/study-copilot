# Faculty Auto-Grader and Dashboard APIs (Combined)

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

from database.connection import get_db
from models.user import User
from models.assignment import Assignment, Submission
from middleware.rbac import require_faculty
from routes.auth import get_current_user
from ollama_utils import run_ollama

router = APIRouter(prefix="/api/faculty", tags=["Faculty"])

# Auto-Grader Models
class GradeSubmissionRequest(BaseModel):
    submission_id: int
    rubric: Optional[str] = None

class BulkGradeRequest(BaseModel):
    assignment_id: int
    auto_grade: bool = True

class ManualGradeRequest(BaseModel):
    submission_id: int
    grade: float
    feedback: str

# Dashboard Models
class DashboardStats(BaseModel):
    total_students: int
    pending_submissions: int
    avg_class_performance: float
    at_risk_students: int

# Assignment Creation Models
class CreateAssignmentRequest(BaseModel):
    title: str
    description: str
    subject: str
    due_date: datetime
    max_marks: float = 100.0

class UpdateAssignmentRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    subject: Optional[str] = None
    due_date: Optional[datetime] = None
    max_marks: Optional[float] = None

class AssignmentResponse(BaseModel):
    id: int
    title: str
    subject: str
    due_date: datetime
    max_marks: float
    created_at: datetime

@router.post("/assignments", response_model=AssignmentResponse)
async def create_assignment(
    request: CreateAssignmentRequest,
    current_user: User = Depends(require_faculty),
    db: Session = Depends(get_db)
):
    """Create a new assignment"""
    
    assignment = Assignment(
        faculty_id=current_user.id,
        title=request.title,
        description=request.description,
        subject=request.subject,
        due_date=request.due_date,
        max_marks=request.max_marks
    )
    
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    
    return {
        "id": assignment.id,
        "title": assignment.title,
        "subject": assignment.subject,
        "due_date": assignment.due_date,
        "max_marks": assignment.max_marks,
        "created_at": assignment.created_at
    }

@router.get("/assignments")
async def list_faculty_assignments(
    current_user: User = Depends(require_faculty),
    db: Session = Depends(get_db)
):
    """List all assignments created by this faculty"""
    
    assignments = db.query(Assignment).filter(
        Assignment.faculty_id == current_user.id
    ).all()
    
    result = []
    for assignment in assignments:
        # Count submissions
        submission_count = db.query(Submission).filter(
            Submission.assignment_id == assignment.id
        ).count()
        
        result.append({
            "id": assignment.id,
            "title": assignment.title,
            "subject": assignment.subject,
            "due_date": assignment.due_date,
            "max_marks": assignment.max_marks,
            "created_at": assignment.created_at,
            "submission_count": submission_count
        })
    
    return {"assignments": result, "count": len(result)}

@router.delete("/assignments/{assignment_id}")
async def delete_assignment(
    assignment_id: int,
    current_user: User = Depends(require_faculty),
    db: Session = Depends(get_db)
):
    """Delete an assignment and all its submissions"""
    
    assignment = db.query(Assignment).filter(
        Assignment.id == assignment_id,
        Assignment.faculty_id == current_user.id
    ).first()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found or permission denied")
    
    # Delete all associated submissions first
    db.query(Submission).filter(Submission.assignment_id == assignment_id).delete()
    
    # Delete the assignment
    db.delete(assignment)
    db.commit()
    
    return {"message": "Assignment and associated submissions deleted successfully"}

@router.put("/assignments/{assignment_id}")
async def update_assignment(
    assignment_id: int,
    request: UpdateAssignmentRequest,
    current_user: User = Depends(require_faculty),
    db: Session = Depends(get_db)
):
    """Update an existing assignment"""
    
    assignment = db.query(Assignment).filter(
        Assignment.id == assignment_id,
        Assignment.faculty_id == current_user.id
    ).first()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found or permission denied")
    
    if request.title:
        assignment.title = request.title
    if request.description:
        assignment.description = request.description
    if request.subject:
        assignment.subject = request.subject
    if request.due_date:
        assignment.due_date = request.due_date
    if request.max_marks is not None:
        assignment.max_marks = request.max_marks
        
    db.commit()
    db.refresh(assignment)
    
    return {
        "success": True,
        "assignment": {
            "id": assignment.id,
            "title": assignment.title,
            "subject": assignment.subject,
            "due_date": assignment.due_date,
            "max_marks": assignment.max_marks
        }
    }

@router.get("/assignments/{assignment_id}/submissions")
async def get_assignment_submissions(
    assignment_id: int,
    current_user: User = Depends(require_faculty),
    db: Session = Depends(get_db)
):
    """Get all submissions for an assignment"""
    
    assignment = db.query(Assignment).filter(
        Assignment.id == assignment_id,
        Assignment.faculty_id == current_user.id
    ).first()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found or permission denied")
    
    submissions = db.query(Submission).filter(Submission.assignment_id == assignment_id).all()
    
    result = []
    for sub in submissions:
        student = db.query(User).filter(User.id == sub.student_id).first()
        student_name = student.name if student else "Unknown Student"
        
        result.append({
            "id": sub.id,
            "student_id": sub.student_id,
            "student_name": student_name,
            "submitted_at": sub.submitted_at,
            "grade": sub.grade,
            "status": sub.status,
            "plagiarism_score": sub.plagiarism_score,
            "file_path": sub.file_path
        })
    
    return {"submissions": result, "count": len(result)}

@router.post("/grade/auto")
async def auto_grade_submission(
    request: GradeSubmissionRequest,
    current_user: User = Depends(require_faculty),
    db: Session = Depends(get_db)
):
    """Auto-grade a submission using AI"""
    
    submission = db.query(Submission).filter(Submission.id == request.submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    
    # AI grading prompt
    prompt = f"""Grade the following student submission for {assignment.subject}.
    
    Assignment: {assignment.title}
    Description: {assignment.description}
    Max Marks: {assignment.max_marks}
    
    Student Answer:
    {submission.content}
    
    {f"Rubric: {request.rubric}" if request.rubric else ""}
    
    Provide:
    1. Grade (out of {assignment.max_marks})
    2. Detailed feedback
    3. Strengths
    4. Areas for improvement
    """
    
    try:
        grading_result = run_ollama(prompt, model="gemma3:1b")
        
        # Parse grade (simple extraction, can be improved)
        import re
        grade_match = re.search(r'Grade:?\s*(\d+\.?\d*)', grading_result)
        grade = float(grade_match.group(1)) if grade_match else assignment.max_marks * 0.7
        
        # Update submission
        submission.grade = grade
        submission.feedback = grading_result
        submission.status = "graded"
        db.commit()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Grading failed: {str(e)}")
    
    return {
        "success": True,
        "submission_id": submission.id,
        "grade": grade,
        "feedback": grading_result
    }

@router.get("/grade/pending")
async def get_pending_submissions(
    current_user: User = Depends(require_faculty),
    db: Session = Depends(get_db)
):
    """Get pending submissions for faculty's assignments"""
    
    # Get faculty's assignments
    assignments = db.query(Assignment).filter(Assignment.faculty_id == current_user.id).all()
    assignment_ids = [a.id for a in assignments]
    
    # Get pending submissions
    pending = db.query(Submission).filter(
        Submission.assignment_id.in_(assignment_ids),
        Submission.status == "submitted"
    ).all()
    
    result = []
    for sub in pending:
        assignment = db.query(Assignment).filter(Assignment.id == sub.assignment_id).first()
        result.append({
            "submission_id": sub.id,
            "assignment_title": assignment.title,
            "student_id": sub.student_id,
            "submitted_at": sub.submitted_at
        })
    
    return {"pending_submissions": result, "count": len(result)}

@router.post("/grade/bulk")
async def bulk_grade(
    request: BulkGradeRequest,
    current_user: User = Depends(require_faculty),
    db: Session = Depends(get_db)
):
    """Bulk grade all submissions for an assignment"""
    
    assignment = db.query(Assignment).filter(
        Assignment.id == request.assignment_id,
        Assignment.faculty_id == current_user.id
    ).first()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    submissions = db.query(Submission).filter(
        Submission.assignment_id == request.assignment_id,
        Submission.status == "submitted"
    ).all()
    
    graded_count = 0
    for submission in submissions:
        if request.auto_grade:
            # Auto-grade each submission
            try:
                # Simplified auto-grading
                submission.grade = assignment.max_marks * 0.75  # Placeholder
                submission.feedback = "Auto-graded. Please review."
                submission.status = "graded"
                graded_count += 1
            except:
                continue
    
    db.commit()
    
    return {
        "success": True,
        "graded_count": graded_count,
        "total_submissions": len(submissions)
    }

@router.post("/grade/manual")
async def manual_grade_submission(
    request: ManualGradeRequest,
    current_user: User = Depends(require_faculty),
    db: Session = Depends(get_db)
):
    """Manually grade a submission"""
    
    submission = db.query(Submission).filter(Submission.id == request.submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Verify assignment belongs to faculty
    assignment = db.query(Assignment).filter(Assignment.id == submission.assignment_id).first()
    if assignment.faculty_id != current_user.id:
        raise HTTPException(status_code=403, detail="You don't have permission to grade this submission")
    
    # Validate grade
    if request.grade < 0 or request.grade > assignment.max_marks:
        raise HTTPException(
            status_code=400, 
            detail=f"Grade must be between 0 and {assignment.max_marks}"
        )
    
    # Update submission
    submission.grade = request.grade
    submission.feedback = request.feedback
    submission.status = "graded"
    db.commit()
    db.refresh(submission)
    
    return {
        "success": True,
        "submission_id": submission.id,
        "grade": submission.grade,
        "feedback": submission.feedback,
        "status": submission.status
    }

@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: User = Depends(require_faculty),
    db: Session = Depends(get_db)
):
    """Get faculty dashboard statistics"""
    
    # Get faculty's assignments
    assignments = db.query(Assignment).filter(Assignment.faculty_id == current_user.id).all()
    assignment_ids = [a.id for a in assignments]
    
    # Count pending submissions
    pending = db.query(Submission).filter(
        Submission.assignment_id.in_(assignment_ids),
        Submission.status == "submitted"
    ).count()
    
    # Calculate average performance
    graded = db.query(Submission).filter(
        Submission.assignment_id.in_(assignment_ids),
        Submission.grade.isnot(None)
    ).all()
    
    avg_performance = sum(s.grade for s in graded) / len(graded) if graded else 0
    
    return {
        "total_students": 45,  # Mock data
        "pending_submissions": pending,
        "avg_class_performance": round(avg_performance, 2),
        "at_risk_students": 3  # Mock data
    }

@router.get("/dashboard/at-risk-students")
async def get_at_risk_students(
    current_user: User = Depends(require_faculty),
    db: Session = Depends(get_db)
):
    """Get list of at-risk students"""
    
    # TODO: Implement AI-based risk detection
    
    return {
        "at_risk_students": [
            {
                "student_id": 101,
                "name": "Student A",
                "risk_score": 85,
                "reasons": ["Low assignment scores", "Missing submissions"],
                "recommended_action": "Schedule one-on-one meeting"
            }
        ]
    }

@router.post("/lessons/generate")
async def generate_lesson_materials(
    topic: str,
    subject: str,
    duration: str = "45 minutes",
    current_user: User = Depends(require_faculty)
):
    """Generate lesson materials using AI"""
    
    prompt = f"""Create a comprehensive lesson plan for teaching {topic} in {subject}.
    Duration: {duration}
    
    Include:
    1. Learning Objectives
    2. Introduction (5 min)
    3. Main Content with examples
    4. Activities/Exercises
    5. Summary
    6. Assessment questions
    """
    
    try:
        lesson_plan = run_ollama(prompt, model="gemma3:1b")
    except Exception as e:
        lesson_plan = f"Error generating lesson: {str(e)}"
    
    return {
        "success": True,
        "lesson_plan": lesson_plan,
        "topic": topic,
        "subject": subject
    }

class QuestionBankRequest(BaseModel):
    topic: str
    subject: str
    num_questions: int = 10
    difficulty: str = "mixed"
    context: Optional[str] = None

@router.post("/questions/generate")
async def generate_question_bank(
    request: QuestionBankRequest,
    current_user: User = Depends(require_faculty)
):
    """Generate question bank from topic or provided context"""
    
    if request.context:
        prompt = f"""Generate {request.num_questions} questions based on the following context.
        Subject: {request.subject}
        Topic: {request.topic}
        Difficulty: {request.difficulty}
        
        Context:
        {request.context[:4000]}
        """
    else:
        prompt = f"""Generate {request.num_questions} questions about {request.topic} in {request.subject}.
        Difficulty: {request.difficulty}
        """
        
    prompt += """
    
    IMPORTANT: Provide the output as a STRICT JSON array. Do not include any markdown formatting (like ```json), explanations, or extra text. Just the raw JSON array.
    
    Structure:
    [
      {
        "id": 1, 
        "type": "MCQ", 
        "question": "Question text here", 
        "options": ["Option A", "Option B", "Option C", "Option D"], 
        "answer": "Option A"
      },
      {
        "id": 2,
        "type": "True/False",
        "question": "Statement here",
        "answer": "True"
      }
    ]
    """
    
    try:
        # Initial attempt to get JSON
        response_text = run_ollama(prompt, model="gemma3:1b")
        
        # Robust Regex Parsing
        import re
        import json
        
        # Find JSON array pattern [ ... ]
        json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
        
        if json_match:
             questions_json = json_match.group(0)
             questions = json.loads(questions_json)
        else:
             # Fallback: try to cleanup common markdown issues if regex failed
             clean_text = response_text.replace('```json', '').replace('```', '').strip()
             try:
                questions = json.loads(clean_text)
             except:
                questions = [{"id": 0, "type": "Error", "question": "Could not parse AI response as JSON.", "answer": response_text[:200]}]

    except Exception as e:
        questions = [{"id": 0, "type": "Error", "question": f"Error generating questions: {str(e)}", "answer": ""}]
    
    return {
        "success": True,
        "questions": questions,
        "count": len(questions) if isinstance(questions, list) else 0
    }

@router.post("/plagiarism/scan")
async def scan_for_plagiarism(
    submission_id: int,
    current_user: User = Depends(require_faculty),
    db: Session = Depends(get_db)
):
    """Scan submission for plagiarism"""
    
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # TODO: Implement actual plagiarism detection
    # For now, return mock score
    import random
    plagiarism_score = random.uniform(5.0, 30.0)
    
    submission.plagiarism_score = plagiarism_score
    db.commit()
    
    return {
        "submission_id": submission_id,
        "plagiarism_score": round(plagiarism_score, 2),
        "status": "clean" if plagiarism_score < 20 else "suspicious",
        "flagged_sections": [] if plagiarism_score < 20 else ["Section 2", "Conclusion"]
    }
