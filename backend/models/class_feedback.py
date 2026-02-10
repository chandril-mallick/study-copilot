# Class Feedback Models - Daily feedback system for students and teachers

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.connection import Base

class ClassSession(Base):
    """Represents a daily class session"""
    __tablename__ = "class_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    topic = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    feedbacks = relationship("DailyFeedback", back_populates="class_session", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<ClassSession(id={self.id}, subject={self.subject}, date={self.date})>"

class DailyFeedback(Base):
    """Student feedback for a class session"""
    __tablename__ = "daily_feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    class_session_id = Column(Integer, ForeignKey("class_sessions.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    query = Column(Text)  # Student's question/comment
    status = Column(String, default="pending")  # pending, responded
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    class_session = relationship("ClassSession", back_populates="feedbacks")
    response = relationship("FeedbackResponse", back_populates="feedback", uselist=False, cascade="all, delete-orphan")
    
    # Ensure one feedback per student per class session
    __table_args__ = (
        UniqueConstraint('class_session_id', 'student_id', name='unique_student_class_feedback'),
    )
    
    def __repr__(self):
        return f"<DailyFeedback(id={self.id}, student_id={self.student_id}, rating={self.rating}, status={self.status})>"

class FeedbackResponse(Base):
    """Teacher's response to student feedback"""
    __tablename__ = "feedback_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    feedback_id = Column(Integer, ForeignKey("daily_feedback.id"), unique=True, nullable=False)
    faculty_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    response = Column(Text, nullable=False)
    responded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    feedback = relationship("DailyFeedback", back_populates="response")
    
    def __repr__(self):
        return f"<FeedbackResponse(id={self.id}, feedback_id={self.feedback_id})>"
