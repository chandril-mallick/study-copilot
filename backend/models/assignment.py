# Assignment and Submission Models

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float
from sqlalchemy.sql import func
from database.connection import Base

class Assignment(Base):
    __tablename__ = "assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    subject = Column(String, nullable=False)
    due_date = Column(DateTime(timezone=True))
    max_marks = Column(Float, default=100.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Assignment(id={self.id}, title={self.title})>"

class Submission(Base):
    __tablename__ = "submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_path = Column(String)
    content = Column(Text)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    grade = Column(Float)
    feedback = Column(Text)
    plagiarism_score = Column(Float)
    status = Column(String, default="submitted")  # submitted, graded, returned
    
    def __repr__(self):
        return f"<Submission(id={self.id}, assignment_id={self.assignment_id}, status={self.status})>"
