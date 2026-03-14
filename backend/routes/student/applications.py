from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from database.connection import get_db
from models.user import User
from models.application import ScholarshipApplication, AdmissionApplication
from routes.auth import get_current_user

router = APIRouter(prefix="/api/student/applications", tags=["Student - Applications"])

# ===== Models =====

class ScholarshipApplyRequest(BaseModel):
    scholarship_type: str
    amount_requested: float
    academic_performance: Optional[float] = None
    family_income: Optional[float] = None
    documents_submitted: Optional[List[int]] = None

class AdmissionApplyRequest(BaseModel):
    course_applied: str
    department: str
    previous_qualification: Optional[str] = None
    previous_percentage: Optional[float] = None
    entrance_exam_score: Optional[float] = None
    documents_submitted: Optional[List[int]] = None

# ===== SCHOLARSHIP ROUTES =====

@router.get("/scholarships")
async def get_my_scholarship_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all scholarship applications created by the current student"""
    applications = db.query(ScholarshipApplication).filter(
        ScholarshipApplication.user_id == current_user.id
    ).order_by(ScholarshipApplication.created_at.desc()).all()
    
    return {
        "success": True,
        "applications": [
            {
                "id": app.id,
                "application_number": app.application_number,
                "scholarship_type": app.scholarship_type,
                "amount_requested": app.amount_requested,
                "status": app.status.value,
                "verification_status": app.verification_status,
                "created_at": app.created_at
            }
            for app in applications
        ]
    }

@router.get("/scholarships/{application_id}")
async def get_scholarship_application_details(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get details of a specific scholarship application"""
    application = db.query(ScholarshipApplication).filter(
        ScholarshipApplication.id == application_id,
        ScholarshipApplication.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    return {
        "success": True,
        "application": {
            "id": application.id,
            "application_number": application.application_number,
            "scholarship_type": application.scholarship_type,
            "amount_requested": application.amount_requested,
            "academic_performance": application.academic_performance,
            "family_income": application.family_income,
            "status": application.status.value,
            "verification_status": application.verification_status,
            "notes": application.notes,
            "created_at": application.created_at,
            "updated_at": application.updated_at
        }
    }

@router.post("/scholarships")
async def apply_for_scholarship(
    request: ScholarshipApplyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a new scholarship application as a student"""
    # Simply forward the request to the existing logic, but securely injecting the caller's true ID.
    try:
        from routes.admin.automation_apis import create_scholarship_application, ScholarshipApplicationRequest
        
        admin_req = ScholarshipApplicationRequest(
            user_id=current_user.id,
            scholarship_type=request.scholarship_type,
            amount_requested=request.amount_requested,
            academic_performance=request.academic_performance,
            family_income=request.family_income,
            documents_submitted=request.documents_submitted
        )
        
        # Call the existing service logic directly
        response = await create_scholarship_application(request=admin_req, current_user=current_user, db=db)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit application: {str(e)}")


# ===== ADMISSION ROUTES =====

@router.get("/admissions")
async def get_my_admission_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all admission applications created by the current student"""
    applications = db.query(AdmissionApplication).filter(
        AdmissionApplication.user_id == current_user.id
    ).order_by(AdmissionApplication.created_at.desc()).all()
    
    return {
        "success": True,
        "applications": [
            {
                "id": app.id,
                "application_number": app.application_number,
                "course_applied": app.course_applied,
                "department": app.department,
                "status": app.status.value,
                "verification_status": app.verification_status,
                "created_at": app.created_at
            }
            for app in applications
        ]
    }

@router.get("/admissions/{application_id}")
async def get_admission_application_details(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get details of a specific admission application"""
    application = db.query(AdmissionApplication).filter(
        AdmissionApplication.id == application_id,
        AdmissionApplication.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
        
    return {
        "success": True,
        "application": {
            "id": application.id,
            "application_number": application.application_number,
            "course_applied": application.course_applied,
            "department": application.department,
            "previous_qualification": application.previous_qualification,
            "previous_percentage": application.previous_percentage,
            "entrance_exam_score": application.entrance_exam_score,
            "status": application.status.value,
            "verification_status": application.verification_status,
            "notes": application.notes,
            "created_at": application.created_at,
            "updated_at": application.updated_at
        }
    }

@router.post("/admissions")
async def apply_for_admission(
    request: AdmissionApplyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a new admission application as a student"""
    try:
        from routes.admin.automation_apis import create_admission_application, AdmissionApplicationRequest
        
        admin_req = AdmissionApplicationRequest(
            user_id=current_user.id,
            course_applied=request.course_applied,
            department=request.department,
            previous_qualification=request.previous_qualification,
            previous_percentage=request.previous_percentage,
            entrance_exam_score=request.entrance_exam_score,
            documents_submitted=request.documents_submitted
        )
        
        # Call the existing service logic directly
        response = await create_admission_application(request=admin_req, current_user=current_user, db=db)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit application: {str(e)}")
