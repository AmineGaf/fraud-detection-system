from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr | None = None
    password: str | None = None
    full_name: str
    institutional_id: str | None = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr | None
    full_name: str

    class Config:
        from_attributes = True