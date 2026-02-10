# Faculty Profile Model

from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from database.connection import Base

class FacultyProfile(Base):
    __tablename__ = "faculty_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    employee_id = Column(String, unique=True, nullable=False)
    department = Column(String, nullable=False)
    subjects = Column(Text)  # JSON string of subjects
    designation = Column(String, default="Assistant Professor")
    
    # Relationship
    # user = relationship("User", back_populates="faculty_profile")
    
    def __repr__(self):
        return f"<FacultyProfile(employee_id={self.employee_id}, department={self.department})>"
