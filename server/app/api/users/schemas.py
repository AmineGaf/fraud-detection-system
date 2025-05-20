from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

from ..classes.models import UserClassAssociation
from ..roles.schemas import RoleResponse

class UserBase(BaseModel):
    email: str | None = None
    full_name: str
    institutional_id: str | None = None

class UserCreate(UserBase):
    password: str | None = None
    role_id: int | None = None

class UserUpdate(BaseModel):
    email: str | None = None
    password: str | None = None
    full_name: str | None = None
    institutional_id: str | None = None
    role_id: int | None = None


class GenericResponse(BaseModel):
    success: bool
    message: str | None = None
    model_config = ConfigDict(from_attributes=True)

class BulkAssignmentResponse(BaseModel):
    success: bool
    count: int
    message: str | None = None
    model_config = ConfigDict(from_attributes=True)

class ClassAssignment(BaseModel):
    class_id: int
    model_config = ConfigDict(from_attributes=True)

class BulkClassAssignment(BaseModel):
    user_ids: List[int] = Field(..., alias="user_ids")
    class_id: int = Field(..., alias="class_id")
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            set: list
        }


class UserClassInfo(BaseModel):
    id: int
    name: str
    studying_program: str
    year: int

class UserResponse(UserBase):
    id: int
    role: RoleResponse
    classes: List[UserClassInfo] = []
    
    @classmethod
    def from_orm(cls, user):
        return cls(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            institutional_id=user.institutional_id,
            role=user.role,
            classes=[
                UserClassInfo(
                    id=assoc.class_.id,
                    name=assoc.class_.name,
                    studying_program=assoc.class_.studying_program,
                    year=assoc.class_.year
                )
                for assoc in user.classes
                if hasattr(assoc, 'class_') and assoc.class_ is not None
            ]
        )
    
    model_config = ConfigDict(from_attributes=True)