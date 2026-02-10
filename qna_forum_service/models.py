from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    user_type = Column(String(20), default="student")  # student, teacher, ta, admin
    avatar_url = Column(String(255))
    reputation = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    questions = relationship("Question", back_populates="author")
    answers = relationship("Answer", back_populates="author")
    question_votes = relationship("QuestionVote", back_populates="user")
    answer_votes = relationship("AnswerVote", back_populates="user")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    subject = Column(String(100))
    author_id = Column(Integer, ForeignKey("users.id"), default=1, nullable=False)
    author_name = Column(String(100), default="Guest User")  # Store name for display
    author_type = Column(String(20), default="student")  # For backward compatibility
    votes = Column(Integer, default=0)
    views = Column(Integer, default=0)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    author = relationship("User", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")
    tags = relationship("Tag", secondary="question_tags", back_populates="questions")
    votes_relationship = relationship("QuestionVote", back_populates="question", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), default=1, nullable=False)
    author_name = Column(String(100), default="Guest User")  # Store name for display
    author_type = Column(String(20), default="student")  # For backward compatibility
    votes = Column(Integer, default=0)
    is_accepted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    question = relationship("Question", back_populates="answers")
    author = relationship("User", back_populates="answers")
    votes_relationship = relationship("AnswerVote", back_populates="answer", cascade="all, delete-orphan")

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    questions = relationship("Question", secondary="question_tags", back_populates="tags")

class QuestionTag(Base):
    __tablename__ = "question_tags"

    question_id = Column(Integer, ForeignKey("questions.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id"), primary_key=True)

class QuestionVote(Base):
    __tablename__ = "question_votes"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), default=1, nullable=False)
    vote_type = Column(String(10), nullable=False)  # up, down
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    question = relationship("Question", back_populates="votes_relationship")
    user = relationship("User", back_populates="question_votes")

class AnswerVote(Base):
    __tablename__ = "answer_votes"

    id = Column(Integer, primary_key=True, index=True)
    answer_id = Column(Integer, ForeignKey("answers.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), default=1, nullable=False)
    vote_type = Column(String(10), nullable=False)  # up, down
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    answer = relationship("Answer", back_populates="votes_relationship")
    user = relationship("User", back_populates="answer_votes")
