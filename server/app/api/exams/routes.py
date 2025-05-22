from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .schemas import ExamResponse, ExamCreate, ExamUpdate
from .services import ExamService
from app.core.database import get_db
from app.api.auth.services import get_current_admin, get_current_supervisor, get_current_user
from app.api.users.models import User

router = APIRouter(prefix="/exams", tags=["exams"])

@router.get("/", response_model=List[ExamResponse])
def get_all_exams(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_supervisor) 
):
    return ExamService.get_all_exams(db, user=current_user, skip=skip, limit=limit)

@router.post("/", response_model=ExamResponse, status_code=status.HTTP_201_CREATED)
def create_exam(
    exam_data: ExamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin) 
):
    return ExamService.create_exam(db, exam_data)

@router.get("/class/{class_id}", response_model=List[ExamResponse])
def get_exams_by_class(
    class_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_supervisor)  
):
    return ExamService.get_exams_by_class(
        db, 
        class_id=class_id, 
        user=current_user,
        skip=skip, 
        limit=limit
    )

@router.get("/{exam_id}", response_model=ExamResponse)
def get_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_supervisor) 
):
    db_exam = ExamService.get_exam(db, exam_id=exam_id, user=current_user)
    if not db_exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found or access denied"
        )
    return db_exam

@router.put("/{exam_id}", response_model=ExamResponse)
def update_exam(
    exam_id: int,
    exam_data: ExamUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin) 
):
    db_exam = ExamService.update_exam(db, exam_id=exam_id, exam_data=exam_data)
    if not db_exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )
    return db_exam

@router.delete("/{exam_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin) 
):
    success = ExamService.delete_exam(db, exam_id=exam_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exam not found"
        )