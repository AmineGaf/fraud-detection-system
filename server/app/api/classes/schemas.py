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

class UserInClass(BaseModel):
    id: int
    full_name: str
    email: str
    is_professor: bool
    joined_at: datetime  
    
    model_config = ConfigDict(from_attributes=True)

class ClassResponse(ClassBase):
    id: int
    is_active: bool
    created_at: datetime
    users: List[UserInClass] = []
    
    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_orm_with_users(cls, db_class):
        class_dict = db_class.__dict__
        class_dict["users"] = [
            UserInClass(
                id=assoc.user.id,
                full_name=assoc.user.full_name,
                email=assoc.user.email,
                is_professor=assoc.user.role_id == 2,
                joined_at=assoc.joined_at
            )
            for assoc in db_class.users
        ]
        return cls(**class_dict)

class ClassWithUsersResponse(ClassResponse):
    pass  

class UserClassAssociationResponse(BaseModel):
    user: UserResponse
    is_professor: bool
    joined_at: datetime

    model_config = ConfigDict(from_attributes=True)