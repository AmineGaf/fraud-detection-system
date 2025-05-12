from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from . import schemas, services  
from app.core.database import get_db   

router = APIRouter(prefix="/roles", tags=["roles"])

@router.post("/", response_model=schemas.RoleResponse, status_code=status.HTTP_201_CREATED)
def create_role(role: schemas.RoleCreate, db: Session = Depends(get_db)):
    try:
        return services.create_role(db, role) 
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )

@router.get("/", response_model=List[schemas.RoleResponse])
def read_roles(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return services.get_roles(db, skip=skip, limit=limit)

@router.get("/{role_id}", response_model=schemas.RoleWithUsersResponse)
def read_role(
    role_id: int, 
    db: Session = Depends(get_db)
):
    db_role = services.get_role(db, role_id=role_id)
    if not db_role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    return db_role