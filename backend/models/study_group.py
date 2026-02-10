# Study Group Models

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.connection import Base

class StudyGroup(Base):
    __tablename__ = "study_groups"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    subject = Column(String(100), nullable=False)
    description = Column(Text)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    max_members = Column(Integer, default=10)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    memberships = relationship("GroupMembership", back_populates="group", cascade="all, delete-orphan")
    messages = relationship("GroupMessage", back_populates="group", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<StudyGroup(id={self.id}, name={self.name})>"

class GroupMembership(Base):
    __tablename__ = "group_memberships"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("study_groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(20), default="member")  # creator, member
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    group = relationship("StudyGroup", back_populates="memberships")
    
    def __repr__(self):
        return f"<GroupMembership(group_id={self.group_id}, user_id={self.user_id})>"

class GroupMessage(Base):
    __tablename__ = "group_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("study_groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    group = relationship("StudyGroup", back_populates="messages")
    
    def __repr__(self):
        return f"<GroupMessage(id={self.id}, group_id={self.group_id})>"
