from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr | None = None
    full_name: str
    institutional_id: str | None = None

class UserCreate(UserBase):
    password: str | None = None

class UserUpdate(BaseModel):
    email: EmailStr | None = None
    password: str | None = None
    full_name: str | None = None
    institutional_id: str | None = None

class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True