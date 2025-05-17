from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from ..users.schemas import UserResponse

class ClassBase(BaseModel):
    name: str
    studying_program: str
    year: int
    capacity: Optional[int] = 30
    description: Optional[str] = None

class ClassCreate(ClassBase):
    pass

class ClassUpdate(BaseModel):
    name: Optional[str] = None
    studying_program: Optional[str] = None
    year: Optional[int] = None
    capacity: Optional[int] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class ClassResponse(ClassBase):
    id: int
    is_active: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ClassWithUsersResponse(ClassResponse):
    users: List[UserResponse]