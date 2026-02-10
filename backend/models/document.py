# Document Model

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from database.connection import Base

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # pdf, txt, docx
    file_size = Column(Integer)  # in bytes
    status = Column(String, default="uploaded")  # uploaded, processing, verified, rejected
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    doc_metadata = Column(Text)  # JSON string for additional metadata
    
    def __repr__(self):
        return f"<Document(id={self.id}, filename={self.filename}, status={self.status})>"
