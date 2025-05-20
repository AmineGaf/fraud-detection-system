from sqlalchemy import Column, Index, Integer, String, ForeignKey, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Class(Base):
    __tablename__ = "classes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    studying_program = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    capacity = Column(Integer, default=30)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    users = relationship(
        "UserClassAssociation",
        back_populates="class_",
        cascade="all, delete-orphan"
    )
    exams = relationship("Exam", back_populates="class_", cascade="all, delete-orphan")

class UserClassAssociation(Base):
    __tablename__ = "user_class_associations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    is_professor = Column(Boolean, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Bidirectional relationships
    user = relationship("User", back_populates="classes")
    class_ = relationship("Class", back_populates="users")
    
    __table_args__ = (
        Index('ix_user_class_unique', 'user_id', 'class_id', unique=True),
    )