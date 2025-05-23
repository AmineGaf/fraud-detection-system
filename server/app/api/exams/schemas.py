from typing import List, Dict, Any
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from enum import Enum
from .models import Exam


class ExamStatus(str, Enum):
    UPCOMING = "upcoming"
    ONGOING = "ongoing"
    COMPLETED = "completed"

class ExamBase(BaseModel):
    name: str
    exam_date: datetime
    class_id: int
    status: ExamStatus = ExamStatus.UPCOMING

class ExamCreate(ExamBase):
    pass

class ExamUpdate(BaseModel):
    name: Optional[str] = None
    exam_date: Optional[datetime] = None
    status: Optional[ExamStatus] = None
    fraud_status: Optional[str] = None
    fraud_evidence: Optional[List[Dict[str, Any]]] = None
    

class ClassInfo(BaseModel):
    name: str
    studying_program: str

class ExamResponse(ExamBase):
    id: int
    fraud_status: Optional[str] = None
    fraud_evidence: Optional[List[Dict[str, Any]]] = None 
    created_at: datetime
    class_info: ClassInfo
    
    @classmethod
    def from_orm(cls, db_exam: Exam):
        exam_data = db_exam.__dict__
        exam_data["class_info"] = {
            "name": db_exam.class_.name,
            "studying_program": db_exam.class_.studying_program
        }
        return cls(**exam_data)
    
    model_config = ConfigDict(from_attributes=True)
