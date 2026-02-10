# User Model

from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from database.connection import Base
import enum

class UserRole(str, enum.Enum):
    STUDENT = "student"
    FACULTY = "faculty"
    VERIFIER = "verifier"
    ADMIN = "admin"
    MANAGEMENT = "management"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    name = Column(String, nullable=False)
    is_active = Column(Integer, default=1)  # SQLite doesn't have Boolean
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
