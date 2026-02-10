# Student Profile Model

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.connection import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    enrollment_no = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    gpa = Column(Float, default=0.0)
    
    # Relationship
    # user = relationship("User", back_populates="student_profile")
    
    def __repr__(self):
        return f"<StudentProfile(enrollment_no={self.enrollment_no}, department={self.department})>"
