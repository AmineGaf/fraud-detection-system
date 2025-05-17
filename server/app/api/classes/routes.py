from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .schemas import (
    ClassResponse,
    ClassCreate,
    ClassUpdate,
    ClassWithUsersResponse
)
from .services import ClassService
from app.core.database import get_db

router = APIRouter(prefix="/classes", tags=["classes"])

@router.post("/", response_model=ClassResponse, status_code=status.HTTP_201_CREATED)
def create_class(class_data: ClassCreate, db: Session = Depends(get_db)):
    return ClassService.create_class(db, class_data)

@router.get("/", response_model=List[ClassResponse])
def read_classes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return ClassService.get_classes(db, skip=skip, limit=limit)

@router.get("/{class_id}", response_model=ClassResponse)
def read_class(class_id: int, db: Session = Depends(get_db)):
    db_class = ClassService.get_class(db, class_id=class_id)
    if not db_class:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    return db_class

@router.put("/{class_id}", response_model=ClassResponse)
def update_class(
    class_id: int,
    class_data: ClassUpdate,
    db: Session = Depends(get_db)
):
    db_class = ClassService.update_class(db, class_id=class_id, class_data=class_data)
    if not db_class:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    return db_class

@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_class(class_id: int, db: Session = Depends(get_db)):
    success = ClassService.delete_class(db, class_id=class_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )

@router.get("/{class_id}/users", response_model=ClassWithUsersResponse)
def get_class_with_users(class_id: int, db: Session = Depends(get_db)):
    db_class = ClassService.get_class(db, class_id=class_id)
    if not db_class:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Class not found"
        )
    return db_class

@router.post("/{class_id}/users/{user_id}", status_code=status.HTTP_201_CREATED)
def add_user_to_class(
    class_id: int,
    user_id: int,
    is_professor: bool = False,
    db: Session = Depends(get_db)
):
    return ClassService.add_user_to_class(
        db,
        class_id=class_id,
        user_id=user_id,
        is_professor=is_professor
    )

@router.delete("/{class_id}/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_user_from_class(
    class_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    success = ClassService.remove_user_from_class(
        db,
        class_id=class_id,
        user_id=user_id
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in class"
        )