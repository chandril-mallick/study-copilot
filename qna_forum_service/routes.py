from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_, or_
from typing import List, Optional
from pydantic import BaseModel
import json

from database import get_db
from models import (
    Question, Answer, Tag, QuestionTag, QuestionVote, AnswerVote, User
)
from auth import get_guest_user

# Pydantic models
class QuestionCreate(BaseModel):
    title: str
    content: str
    subject: Optional[str] = None
    author_name: Optional[str] = "Guest User"
    author_type: str = "student"
    tags: List[str] = []

class QuestionResponse(BaseModel):
    id: int
    title: str
    content: str
    subject: Optional[str]
    author_name: str
    author_type: str
    votes: int
    views: int
    is_resolved: bool
    created_at: str
    updated_at: Optional[str]
    answers: List[dict]
    tags: List[str]

class AnswerCreate(BaseModel):
    content: str
    author_name: Optional[str] = "Guest User"
    author_type: str = "student"

class AnswerResponse(BaseModel):
    id: int
    content: str
    author_name: str
    author_type: str
    votes: int
    is_accepted: bool
    created_at: str

class VoteRequest(BaseModel):
    vote_type: str  # "up" or "down"

class TagResponse(BaseModel):
    id: int
    name: str

class QuestionFilter(BaseModel):
    subject: Optional[str] = None
    tag: Optional[str] = None
    sort_by: str = "newest"  # newest, oldest, most_voted, most_answered
    search: Optional[str] = None

# Router
router = APIRouter()

# Helper functions
def get_or_create_tag(db: Session, tag_name: str) -> Tag:
    """Get existing tag or create new one"""
    tag = db.query(Tag).filter(Tag.name == tag_name.lower()).first()
    if not tag:
        tag = Tag(name=tag_name.lower())
        db.add(tag)
        db.commit()
        db.refresh(tag)
    return tag

def format_question_response(question: Question) -> dict:
    """Format question for API response"""
    return {
        "id": question.id,
        "title": question.title,
        "content": question.content,
        "subject": question.subject,
        "author_name": question.author_name,
        "author_type": question.author_type,
        "votes": question.votes,
        "views": question.views,
        "is_resolved": question.is_resolved,
        "created_at": question.created_at.isoformat() if question.created_at else None,
        "updated_at": question.updated_at.isoformat() if question.updated_at else None,
        "answers": [
            {
                "id": answer.id,
                "content": answer.content,
                "author_name": answer.author_name,
                "author_type": answer.author_type,
                "votes": answer.votes,
                "is_accepted": answer.is_accepted,
                "created_at": answer.created_at.isoformat() if answer.created_at else None
            }
            for answer in question.answers
        ],
        "tags": [tag.name for tag in question.tags]
    }

def increment_views(db: Session, question_id: int):
    """Increment question views"""
    question = db.query(Question).filter(Question.id == question_id).first()
    if question:
        question.views += 1
        db.commit()

# API Endpoints

@router.get("/questions", response_model=List[QuestionResponse])
def get_questions(
    subject: Optional[str] = None,
    tag: Optional[str] = None,
    sort_by: str = "newest",
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get questions with filtering and sorting"""

    # Start with base query
    query = db.query(Question)

    # Apply filters
    if subject and subject != "all":
        query = query.filter(Question.subject == subject)

    if tag:
        query = query.join(Question.tags).filter(Tag.name == tag.lower())

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Question.title.ilike(search_filter),
                Question.content.ilike(search_filter)
            )
        )

    # Apply sorting
    if sort_by == "newest":
        query = query.order_by(desc(Question.created_at))
    elif sort_by == "oldest":
        query = query.order_by(Question.created_at)
    elif sort_by == "most_voted":
        query = query.order_by(desc(Question.votes))
    elif sort_by == "most_answered":
        query = query.order_by(desc(func.count(Answer.id)))

    # Apply pagination
    questions = query.offset(skip).limit(limit).all()

    # Format response
    return [format_question_response(q) for q in questions]

@router.post("/questions", response_model=dict)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    """Create a new question"""

    # Create question
    db_question = Question(
        title=question.title,
        content=question.content,
        subject=question.subject,
        author_name=question.author_name,
        author_type=question.author_type
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)

    # Add tags
    for tag_name in question.tags:
        if tag_name.strip():
            tag = get_or_create_tag(db, tag_name.strip())
            # Check if relationship already exists
            existing = db.query(QuestionTag).filter(
                and_(QuestionTag.question_id == db_question.id, QuestionTag.tag_id == tag.id)
            ).first()
            if not existing:
                db_question.tags.append(tag)

    db.commit()
    db.refresh(db_question)

    return format_question_response(db_question)

@router.get("/questions/{question_id}", response_model=dict)
def get_question(question_id: int, db: Session = Depends(get_db)):
    """Get a specific question"""

    # Increment views
    increment_views(db, question_id)

    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    return format_question_response(question)

@router.post("/questions/{question_id}/answers", response_model=dict)
def create_answer(question_id: int, answer: AnswerCreate, db: Session = Depends(get_db)):
    """Create an answer for a question"""

    # Check if question exists
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Create answer
    db_answer = Answer(
        content=answer.content,
        question_id=question_id,
        author_name=answer.author_name,
        author_type=answer.author_type
    )
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)

    return format_question_response(question)

@router.post("/questions/{question_id}/vote")
def vote_question(question_id: int, vote: VoteRequest, db: Session = Depends(get_db)):
    """Vote on a question"""

    # Check if question exists
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Check if user already voted
    guest_user = get_guest_user()
    existing_vote = db.query(QuestionVote).filter(
        and_(QuestionVote.question_id == question_id, QuestionVote.user_id == guest_user["id"])
    ).first()

    if existing_vote:
        if existing_vote.vote_type == vote.vote_type:
            # Same vote, remove it
            db.delete(existing_vote)
            question.votes -= 1 if vote.vote_type == "up" else -1
        else:
            # Different vote, update it
            old_vote = 1 if existing_vote.vote_type == "up" else -1
            new_vote = 1 if vote.vote_type == "up" else -1
            question.votes = question.votes - old_vote + new_vote
            existing_vote.vote_type = vote.vote_type
    else:
        # New vote
        db_vote = QuestionVote(
            question_id=question_id,
            user_id=guest_user["id"],
            vote_type=vote.vote_type
        )
        db.add(db_vote)
        question.votes += 1 if vote.vote_type == "up" else -1

    db.commit()
    db.refresh(question)

    return {"votes": question.votes}

@router.post("/answers/{answer_id}/vote")
def vote_answer(answer_id: int, vote: VoteRequest, db: Session = Depends(get_db)):
    """Vote on an answer"""

    # Check if answer exists
    answer = db.query(Answer).filter(Answer.id == answer_id).first()
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")

    # Check if user already voted
    guest_user = get_guest_user()
    existing_vote = db.query(AnswerVote).filter(
        and_(AnswerVote.answer_id == answer_id, AnswerVote.user_id == guest_user["id"])
    ).first()

    if existing_vote:
        if existing_vote.vote_type == vote.vote_type:
            # Same vote, remove it
            db.delete(existing_vote)
            answer.votes -= 1 if vote.vote_type == "up" else -1
        else:
            # Different vote, update it
            old_vote = 1 if existing_vote.vote_type == "up" else -1
            new_vote = 1 if vote.vote_type == "up" else -1
            answer.votes = answer.votes - old_vote + new_vote
            existing_vote.vote_type = vote.vote_type
    else:
        # New vote
        db_vote = AnswerVote(
            answer_id=answer_id,
            user_id=guest_user["id"],
            vote_type=vote.vote_type
        )
        db.add(db_vote)
        answer.votes += 1 if vote.vote_type == "up" else -1

    db.commit()
    db.refresh(answer)

    return {"votes": answer.votes}

@router.get("/tags", response_model=List[TagResponse])
def get_tags(db: Session = Depends(get_db)):
    """Get all tags"""
    tags = db.query(Tag).all()
    return [{"id": tag.id, "name": tag.name} for tag in tags]

@router.get("/subjects")
def get_subjects(db: Session = Depends(get_db)):
    """Get all subjects with question counts"""
    from sqlalchemy import func
    
    # Get distinct subjects with counts
    subject_counts = db.query(
        Question.subject,
        func.count(Question.id).label('count')
    ).filter(
        Question.subject.isnot(None)
    ).group_by(Question.subject).all()
    
    # Format as list of strings (for backward compatibility)
    # Frontend will handle formatting with counts
    return [subject[0] for subject in subject_counts if subject[0]]

@router.post("/answers/{answer_id}/accept")
def accept_answer(answer_id: int, db: Session = Depends(get_db)):
    """Accept an answer"""

    # Check if answer exists
    answer = db.query(Answer).filter(Answer.id == answer_id).first()
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")

    # Check if question exists
    question = db.query(Question).filter(Question.id == answer.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Remove previous accepted answer
    db.query(Answer).filter(Answer.question_id == question.id).update({"is_accepted": False})

    # Accept this answer
    answer.is_accepted = True
    question.is_resolved = True

    db.commit()

    return {"message": "Answer accepted successfully"}

@router.delete("/questions/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    """Delete a question"""

    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    db.delete(question)
    db.commit()

    return {"message": "Question deleted successfully"}

@router.delete("/answers/{answer_id}")
def delete_answer(answer_id: int, db: Session = Depends(get_db)):
    """Delete an answer"""

    answer = db.query(Answer).filter(Answer.id == answer_id).first()
    if not answer:
        raise HTTPException(status_code=404, detail="Answer not found")

    db.delete(answer)
    db.commit()

    return {"message": "Answer deleted successfully"}
