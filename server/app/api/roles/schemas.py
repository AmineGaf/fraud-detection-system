from pydantic import BaseModel, ConfigDict, Field
from typing import List, TYPE_CHECKING

class RoleBase(BaseModel):
    name: str

class RoleCreate(RoleBase):
    pass

class RoleResponse(RoleBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

if TYPE_CHECKING:
    from app.api.users.schemas import UserResponse

class RoleWithUsersResponse(RoleResponse):
    users: List["UserResponse"] = Field(default_factory=list)