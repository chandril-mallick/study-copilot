# Scholarship and Admission Automation APIs

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import random
import json

from database.connection import get_db
from models.user import User
from models.application import ScholarshipApplication, AdmissionApplication, ApplicationStatus
from middleware.rbac import require_admin, require_management, require_admin_or_management, require_verifier
from routes.auth import get_current_user
from ollama_utils import run_ollama

router = APIRouter(prefix="/api/admin/automation", tags=["Admin - Automation"])

# ===== SCHOLARSHIP AUTOMATION =====

class ScholarshipApplicationRequest(BaseModel):
    user_id: int
    scholarship_type: str
    amount_requested: float
    academic_performance: Optional[float] = None
    family_income: Optional[float] = None
    documents_submitted: Optional[List[int]] = None

class ScholarshipApplicationResponse(BaseModel):
    id: int
    application_number: str
    scholarship_type: str
    amount_requested: float
    status: str
    ai_score: Optional[float]
    verification_status: str
    created_at: datetime

@router.get("/scholarship/applications", response_model=List[ScholarshipApplicationResponse])
async def list_scholarship_applications(
    status: Optional[str] = None,
    current_user: User = Depends(require_admin_or_management),
    db: Session = Depends(get_db)
):
    """List all scholarship applications"""
    
    query = db.query(ScholarshipApplication)
    
    if status:
        query = query.filter(ScholarshipApplication.status == status)
    
    applications = query.order_by(ScholarshipApplication.created_at.desc()).limit(100).all()
    
    return [
        {
            "id": app.id,
            "application_number": app.application_number,
            "scholarship_type": app.scholarship_type,
            "amount_requested": app.amount_requested,
            "status": app.status.value,
            "ai_score": app.ai_score,
            "verification_status": app.verification_status,
            "created_at": app.created_at
        }
        for app in applications
    ]

@router.post("/scholarship/apply")
async def create_scholarship_application(
    request: ScholarshipApplicationRequest,
    current_user: User = Depends(require_admin_or_management),
    db: Session = Depends(get_db)
):
    """Create a new scholarship application with AI scoring"""
    
    # Generate application number
    app_number = f"SCH-{datetime.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
    
    # AI Eligibility Scoring
    prompt = f"""Evaluate scholarship eligibility:
    Type: {request.scholarship_type}
    Amount Requested: ₹{request.amount_requested}
    Academic Performance: {request.academic_performance or 'Not provided'}
    Family Income: ₹{request.family_income or 'Not provided'}
    
    Return JSON:
    {{
        "eligibility_score": float (0-100),
        "recommendation": "approve" | "review" | "reject",
        "reasoning": "string"
    }}
    """
    
    try:
        response_text = run_ollama(prompt, model="gemma3:1b")
        start = response_text.find('{')
        end = response_text.rfind('}')
        if start != -1:
            data = json.loads(response_text[start:end+1])
            ai_score = float(data.get("eligibility_score", 50))
            recommendation = data.get("recommendation", "review")
        else:
            # Fallback scoring
            ai_score = 75.0 if request.academic_performance and request.academic_performance >= 80 else 50.0
            recommendation = "review"
    except:
        ai_score = 50.0
        recommendation = "review"
    
    # Determine status based on AI recommendation
    if recommendation == "approve" and ai_score >= 80:
        status = ApplicationStatus.UNDER_REVIEW
    elif recommendation == "reject" or ai_score < 40:
        status = ApplicationStatus.REJECTED
    else:
        status = ApplicationStatus.PENDING
    
    # Create application
    application = ScholarshipApplication(
        user_id=request.user_id,
        application_number=app_number,
        scholarship_type=request.scholarship_type,
        amount_requested=request.amount_requested,
        academic_performance=request.academic_performance,
        family_income=request.family_income,
        documents_submitted=json.dumps(request.documents_submitted or []),
        ai_score=ai_score,
        status=status
    )
    
    db.add(application)
    db.commit()
    db.refresh(application)
    
    return {
        "success": True,
        "application_id": application.id,
        "application_number": application.application_number,
        "ai_score": ai_score,
        "status": status.value,
        "message": "Application created and AI-scored successfully"
    }

@router.post("/scholarship/{application_id}/approve")
async def approve_scholarship(
    application_id: int,
    approved_amount: Optional[float] = None,
    current_user: User = Depends(require_admin_or_management),
    db: Session = Depends(get_db)
):
    """Approve a scholarship application"""
    
    application = db.query(ScholarshipApplication).filter(
        ScholarshipApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = ApplicationStatus.APPROVED
    if approved_amount:
        application.amount_requested = approved_amount
    application.notes = f"Approved by {current_user.name} on {datetime.now()}"
    
    db.commit()
    
    return {
        "success": True,
        "application_id": application_id,
        "status": "approved",
        "approved_amount": approved_amount or application.amount_requested
    }

@router.post("/scholarship/{application_id}/reject")
async def reject_scholarship(
    application_id: int,
    reason: str,
    current_user: User = Depends(require_admin_or_management),
    db: Session = Depends(get_db)
):
    """Reject a scholarship application"""
    
    application = db.query(ScholarshipApplication).filter(
        ScholarshipApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = ApplicationStatus.REJECTED
    application.notes = f"Rejected by {current_user.name}: {reason}"
    
    db.commit()
    
    return {
        "success": True,
        "application_id": application_id,
        "status": "rejected"
    }

@router.post("/scholarship/{application_id}/verify")
async def verify_scholarship_documents(
    application_id: int,
    verification_result: str,  # verified, flagged
    notes: Optional[str] = None,
    current_user: User = Depends(require_verifier),
    db: Session = Depends(get_db)
):
    """Verify scholarship application documents"""
    
    application = db.query(ScholarshipApplication).filter(
        ScholarshipApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.verification_status = verification_result
    application.verifier_id = current_user.id
    if notes:
        application.notes = notes
    
    db.commit()
    
    return {
        "success": True,
        "application_id": application_id,
        "verification_status": verification_result
    }

# ===== ADMISSION AUTOMATION =====

class AdmissionApplicationRequest(BaseModel):
    user_id: int
    course_applied: str
    department: str
    previous_qualification: Optional[str] = None
    previous_percentage: Optional[float] = None
    entrance_exam_score: Optional[float] = None
    documents_submitted: Optional[List[int]] = None

class AdmissionApplicationResponse(BaseModel):
    id: int
    application_number: str
    course_applied: str
    department: str
    status: str
    ai_score: Optional[float]
    verification_status: str
    created_at: datetime

@router.get("/admission/applications", response_model=List[AdmissionApplicationResponse])
async def list_admission_applications(
    status: Optional[str] = None,
    department: Optional[str] = None,
    current_user: User = Depends(require_admin_or_management),
    db: Session = Depends(get_db)
):
    """List all admission applications"""
    
    query = db.query(AdmissionApplication)
    
    if status:
        query = query.filter(AdmissionApplication.status == status)
    if department:
        query = query.filter(AdmissionApplication.department == department)
    
    applications = query.order_by(AdmissionApplication.created_at.desc()).limit(100).all()
    
    return [
        {
            "id": app.id,
            "application_number": app.application_number,
            "course_applied": app.course_applied,
            "department": app.department,
            "status": app.status.value,
            "ai_score": app.ai_score,
            "verification_status": app.verification_status,
            "created_at": app.created_at
        }
        for app in applications
    ]

@router.post("/admission/apply")
async def create_admission_application(
    request: AdmissionApplicationRequest,
    current_user: User = Depends(require_admin_or_management),
    db: Session = Depends(get_db)
):
    """Create a new admission application with AI scoring"""
    
    # Generate application number
    app_number = f"ADM-{datetime.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
    
    # AI Eligibility Scoring
    prompt = f"""Evaluate admission eligibility:
    Course: {request.course_applied}
    Department: {request.department}
    Previous Qualification: {request.previous_qualification or 'Not provided'}
    Previous Percentage: {request.previous_percentage or 'Not provided'}%
    Entrance Exam Score: {request.entrance_exam_score or 'Not provided'}
    
    Return JSON:
    {{
        "eligibility_score": float (0-100),
        "recommendation": "approve" | "review" | "reject",
        "reasoning": "string"
    }}
    """
    
    try:
        response_text = run_ollama(prompt, model="gemma3:1b")
        start = response_text.find('{')
        end = response_text.rfind('}')
        if start != -1:
            data = json.loads(response_text[start:end+1])
            ai_score = float(data.get("eligibility_score", 50))
            recommendation = data.get("recommendation", "review")
        else:
            # Fallback scoring
            score = 0
            if request.previous_percentage:
                score += min(request.previous_percentage, 100) * 0.6
            if request.entrance_exam_score:
                score += min(request.entrance_exam_score, 100) * 0.4
            ai_score = score
            recommendation = "approve" if ai_score >= 70 else "review"
    except:
        ai_score = 50.0
        recommendation = "review"
    
    # Determine status based on AI recommendation
    if recommendation == "approve" and ai_score >= 75:
        status = ApplicationStatus.UNDER_REVIEW
    elif recommendation == "reject" or ai_score < 40:
        status = ApplicationStatus.REJECTED
    else:
        status = ApplicationStatus.PENDING
    
    # Create application
    application = AdmissionApplication(
        user_id=request.user_id,
        application_number=app_number,
        course_applied=request.course_applied,
        department=request.department,
        previous_qualification=request.previous_qualification,
        previous_percentage=request.previous_percentage,
        entrance_exam_score=request.entrance_exam_score,
        documents_submitted=json.dumps(request.documents_submitted or []),
        ai_score=ai_score,
        status=status
    )
    
    db.add(application)
    db.commit()
    db.refresh(application)
    
    return {
        "success": True,
        "application_id": application.id,
        "application_number": application.application_number,
        "ai_score": ai_score,
        "status": status.value,
        "message": "Application created and AI-scored successfully"
    }

@router.post("/admission/{application_id}/approve")
async def approve_admission(
    application_id: int,
    current_user: User = Depends(require_admin_or_management),
    db: Session = Depends(get_db)
):
    """Approve an admission application"""
    
    application = db.query(AdmissionApplication).filter(
        AdmissionApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = ApplicationStatus.APPROVED
    application.notes = f"Approved by {current_user.name} on {datetime.now()}"
    
    db.commit()
    
    return {
        "success": True,
        "application_id": application_id,
        "status": "approved"
    }

@router.post("/admission/{application_id}/reject")
async def reject_admission(
    application_id: int,
    reason: str,
    current_user: User = Depends(require_admin_or_management),
    db: Session = Depends(get_db)
):
    """Reject an admission application"""
    
    application = db.query(AdmissionApplication).filter(
        AdmissionApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = ApplicationStatus.REJECTED
    application.notes = f"Rejected by {current_user.name}: {reason}"
    
    db.commit()
    
    return {
        "success": True,
        "application_id": application_id,
        "status": "rejected"
    }

@router.post("/admission/{application_id}/verify")
async def verify_admission_documents(
    application_id: int,
    verification_result: str,  # verified, flagged
    notes: Optional[str] = None,
    current_user: User = Depends(require_verifier),
    db: Session = Depends(get_db)
):
    """Verify admission application documents"""
    
    application = db.query(AdmissionApplication).filter(
        AdmissionApplication.id == application_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.verification_status = verification_result
    application.verifier_id = current_user.id
    if notes:
        application.notes = notes
    
    db.commit()
    
    return {
        "success": True,
        "application_id": application_id,
        "verification_status": verification_result
    }

@router.get("/scholarship/stats")
async def get_scholarship_stats(
    current_user: User = Depends(require_admin_or_management),
    db: Session = Depends(get_db)
):
    """Get scholarship application statistics"""
    
    total = db.query(ScholarshipApplication).count()
    pending = db.query(ScholarshipApplication).filter(
        ScholarshipApplication.status == ApplicationStatus.PENDING
    ).count()
    approved = db.query(ScholarshipApplication).filter(
        ScholarshipApplication.status == ApplicationStatus.APPROVED
    ).count()
    rejected = db.query(ScholarshipApplication).filter(
        ScholarshipApplication.status == ApplicationStatus.REJECTED
    ).count()
    
    return {
        "total": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
        "approval_rate": round((approved / total * 100) if total > 0 else 0, 2)
    }

@router.get("/admission/stats")
async def get_admission_stats(
    current_user: User = Depends(require_admin_or_management),
    db: Session = Depends(get_db)
):
    """Get admission application statistics"""
    
    total = db.query(AdmissionApplication).count()
    pending = db.query(AdmissionApplication).filter(
        AdmissionApplication.status == ApplicationStatus.PENDING
    ).count()
    approved = db.query(AdmissionApplication).filter(
        AdmissionApplication.status == ApplicationStatus.APPROVED
    ).count()
    rejected = db.query(AdmissionApplication).filter(
        AdmissionApplication.status == ApplicationStatus.REJECTED
    ).count()
    
    return {
        "total": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected,
        "approval_rate": round((approved / total * 100) if total > 0 else 0, 2)
    }

