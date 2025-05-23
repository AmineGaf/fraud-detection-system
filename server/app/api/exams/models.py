from datetime import datetime
from sqlalchemy import JSON, Column, Integer, String, ForeignKey, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Exam(Base):
    __tablename__ = "exams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    exam_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), default="upcoming")  
    sale = Column(String(20), nullable=True)
    fraud_status = Column(Text, nullable=True)
    fraud_evidence = Column(JSON, nullable=True)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    class_ = relationship("Class", back_populates="exams", lazy="joined")