# Application Models for Scholarship and Admission

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.connection import Base
import enum

class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    VERIFIED = "verified"
    FLAGGED = "flagged"

class ApplicationType(str, enum.Enum):
    SCHOLARSHIP = "scholarship"
    ADMISSION = "admission"

class ScholarshipApplication(Base):
    __tablename__ = "scholarship_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    application_number = Column(String, unique=True, nullable=False)
    scholarship_type = Column(String, nullable=False)  # merit, need-based, sports, etc.
    amount_requested = Column(Float, nullable=False)
    academic_performance = Column(Float)  # GPA or percentage
    family_income = Column(Float)
    documents_submitted = Column(Text)  # JSON string of document IDs
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.PENDING)
    ai_score = Column(Float)  # AI-generated eligibility score
    verification_status = Column(String, default="pending")  # pending, verified, flagged
    verifier_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<ScholarshipApplication(id={self.id}, application_number={self.application_number}, status={self.status})>"

class AdmissionApplication(Base):
    __tablename__ = "admission_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    application_number = Column(String, unique=True, nullable=False)
    course_applied = Column(String, nullable=False)
    department = Column(String, nullable=False)
    previous_qualification = Column(String)
    previous_percentage = Column(Float)
    entrance_exam_score = Column(Float, nullable=True)
    documents_submitted = Column(Text)  # JSON string of document IDs
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.PENDING)
    ai_score = Column(Float)  # AI-generated eligibility score
    verification_status = Column(String, default="pending")  # pending, verified, flagged
    verifier_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<AdmissionApplication(id={self.id}, application_number={self.application_number}, status={self.status})>"

