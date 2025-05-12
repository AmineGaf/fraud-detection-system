from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, TYPE_CHECKING
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

class UserResponse(UserBase):
    id: int
    role: RoleResponse
    model_config = ConfigDict(from_attributes=True)