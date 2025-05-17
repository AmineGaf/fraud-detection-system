from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from enum import Enum

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

class ExamResponse(ExamBase):
    id: int
    fraud_status: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)