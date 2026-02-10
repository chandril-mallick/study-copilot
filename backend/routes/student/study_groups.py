# Student Study Groups API

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database.connection import get_db
from models.user import User
from models.study_group import StudyGroup, GroupMembership, GroupMessage
from middleware.rbac import require_student
from routes.auth import get_current_user

router = APIRouter(prefix="/api/student/study-groups", tags=["Student - Study Groups"])

# Pydantic Models
class StudyGroupResponse(BaseModel):
    id: int
    name: str
    subject: str
    description: Optional[str]
    members_count: int
    max_members: int
    is_member: bool
    created_at: datetime

class CreateGroupRequest(BaseModel):
    name: str
    subject: str
    description: Optional[str] = None
    max_members: int = 10

class MessageResponse(BaseModel):
    id: int
    user_id: int
    user_name: str
    content: str
    created_at: datetime

class CreateMessageRequest(BaseModel):
    content: str

# Helper function
def get_group_or_404(db: Session, group_id: int) -> StudyGroup:
    group = db.query(StudyGroup).filter(StudyGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Study group not found")
    return group

@router.get("", response_model=List[StudyGroupResponse])
async def list_study_groups(
    subject: Optional[str] = None,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """List available study groups"""
    
    query = db.query(StudyGroup)
    
    if subject:
        query = query.filter(StudyGroup.subject == subject)
    
    groups = query.all()
    
    result = []
    for group in groups:
        members_count = db.query(GroupMembership).filter(
            GroupMembership.group_id == group.id
        ).count()
        
        is_member = db.query(GroupMembership).filter(
            GroupMembership.group_id == group.id,
            GroupMembership.user_id == current_user.id
        ).first() is not None
        
        result.append({
            "id": group.id,
            "name": group.name,
            "subject": group.subject,
            "description": group.description,
            "members_count": members_count,
            "max_members": group.max_members,
            "is_member": is_member,
            "created_at": group.created_at
        })
    
    return result

@router.post("", response_model=StudyGroupResponse)
async def create_study_group(
    request: CreateGroupRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Create a new study group"""
    
    # Create group
    new_group = StudyGroup(
        name=request.name,
        subject=request.subject,
        description=request.description,
        creator_id=current_user.id,
        max_members=request.max_members
    )
    
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    
    # Add creator as first member
    membership = GroupMembership(
        group_id=new_group.id,
        user_id=current_user.id,
        role="creator"
    )
    db.add(membership)
    db.commit()
    
    return {
        "id": new_group.id,
        "name": new_group.name,
        "subject": new_group.subject,
        "description": new_group.description,
        "members_count": 1,
        "max_members": new_group.max_members,
        "is_member": True,
        "created_at": new_group.created_at
    }

@router.get("/{group_id}")
async def get_study_group(
    group_id: int,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Get study group details"""
    
    group = get_group_or_404(db, group_id)
    
    members = db.query(GroupMembership).filter(
        GroupMembership.group_id == group_id
    ).all()
    
    is_member = any(m.user_id == current_user.id for m in members)
    
    return {
        "id": group.id,
        "name": group.name,
        "subject": group.subject,
        "description": group.description,
        "members_count": len(members),
        "max_members": group.max_members,
        "is_member": is_member,
        "created_at": group.created_at
    }

@router.post("/{group_id}/join")
async def join_study_group(
    group_id: int,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Join a study group"""
    
    group = get_group_or_404(db, group_id)
    
    # Check if already a member
    existing = db.query(GroupMembership).filter(
        GroupMembership.group_id == group_id,
        GroupMembership.user_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already a member of this group")
    
    # Check if group is full
    members_count = db.query(GroupMembership).filter(
        GroupMembership.group_id == group_id
    ).count()
    
    if members_count >= group.max_members:
        raise HTTPException(status_code=400, detail="Group is full")
    
    # Add membership
    membership = GroupMembership(
        group_id=group_id,
        user_id=current_user.id,
        role="member"
    )
    db.add(membership)
    db.commit()
    
    return {
        "success": True,
        "message": f"Successfully joined {group.name}"
    }

@router.post("/{group_id}/leave")
async def leave_study_group(
    group_id: int,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Leave a study group"""
    
    group = get_group_or_404(db, group_id)
    
    membership = db.query(GroupMembership).filter(
        GroupMembership.group_id == group_id,
        GroupMembership.user_id == current_user.id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=400, detail="Not a member of this group")
    
    if membership.role == "creator":
        raise HTTPException(status_code=400, detail="Creator cannot leave the group. Delete it instead.")
    
    db.delete(membership)
    db.commit()
    
    return {
        "success": True,
        "message": f"Successfully left {group.name}"
    }

@router.get("/{group_id}/messages", response_model=List[MessageResponse])
async def get_group_messages(
    group_id: int,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Get messages from a study group"""
    
    group = get_group_or_404(db, group_id)
    
    # Check if user is a member
    is_member = db.query(GroupMembership).filter(
        GroupMembership.group_id == group_id,
        GroupMembership.user_id == current_user.id
    ).first() is not None
    
    if not is_member:
        raise HTTPException(status_code=403, detail="Must be a member to view messages")
    
    messages = db.query(GroupMessage).filter(
        GroupMessage.group_id == group_id
    ).order_by(GroupMessage.created_at.desc()).limit(50).all()
    
    result = []
    for msg in messages:
        user = db.query(User).filter(User.id == msg.user_id).first()
        result.append({
            "id": msg.id,
            "user_id": msg.user_id,
            "user_name": user.name if user else "Unknown",
            "content": msg.content,
            "created_at": msg.created_at
        })
    
    return result

@router.post("/{group_id}/messages")
async def post_group_message(
    group_id: int,
    request: CreateMessageRequest,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Post a message to a study group"""
    
    group = get_group_or_404(db, group_id)
    
    # Check if user is a member
    is_member = db.query(GroupMembership).filter(
        GroupMembership.group_id == group_id,
        GroupMembership.user_id == current_user.id
    ).first() is not None
    
    if not is_member:
        raise HTTPException(status_code=403, detail="Must be a member to post messages")
    
    message = GroupMessage(
        group_id=group_id,
        user_id=current_user.id,
        content=request.content
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return {
        "success": True,
        "message_id": message.id,
        "created_at": message.created_at
    }

@router.get("/suggestions")
async def get_group_suggestions(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db)
):
    """Get AI-matched study group suggestions for the current user"""
    
    # Get all groups the user is not a member of
    user_groups = db.query(GroupMembership.group_id).filter(
        GroupMembership.user_id == current_user.id
    ).subquery()
    
    available_groups = db.query(StudyGroup).filter(
        ~StudyGroup.id.in_(user_groups)
    ).all()
    
    # Simple suggestion logic: prioritize groups with similar subjects
    # In a real implementation, this would use AI to match based on:
    # - User's weak topics
    # - Learning pace
    # - Study preferences
    # - Group activity levels
    
    suggestions = []
    for group in available_groups:
        members_count = db.query(GroupMembership).filter(
            GroupMembership.group_id == group.id
        ).count()
        
        # Only suggest groups that aren't full
        if members_count < group.max_members:
            suggestions.append({
                "id": group.id,
                "name": group.name,
                "subject": group.subject,
                "description": group.description,
                "members_count": members_count,
                "max_members": group.max_members,
                "created_at": group.created_at
            })
    
    # Limit to top 5 suggestions
    suggestions = suggestions[:5]
    
    return {
        "suggestions": suggestions
    }
