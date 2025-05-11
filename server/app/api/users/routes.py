from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.users import schemas, services  
from app.core.database import get_db  

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=schemas.UserResponse)
def create_user(
    user: schemas.UserCreate, 
    db: Session = Depends(get_db)
):
    return services.create_user(db, user)