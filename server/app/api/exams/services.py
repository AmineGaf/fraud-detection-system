from sqlalchemy.orm import Session
from typing import List, Optional
from .models import Exam
from .schemas import ExamCreate, ExamUpdate
from sqlalchemy.sql import func

class ExamService:
    
    @staticmethod
    def get_all_exams(db: Session, skip: int = 0, limit: int = 100) -> List[Exam]:
        return db.query(Exam).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_exam(db: Session, exam_id: int) -> Optional[Exam]:
        return db.query(Exam).filter(Exam.id == exam_id).first()

    @staticmethod
    def get_exams_by_class(db: Session, class_id: int, skip: int = 0, limit: int = 100) -> List[Exam]:
        return db.query(Exam).filter(Exam.class_id == class_id).offset(skip).limit(limit).all()

    @staticmethod
    def create_exam(db: Session, exam_data: ExamCreate) -> Exam:
        db_exam = Exam(**exam_data.model_dump())
        db.add(db_exam)
        db.commit()
        db.refresh(db_exam)
        return db_exam

    @staticmethod
    def update_exam(
        db: Session, 
        exam_id: int, 
        exam_data: ExamUpdate
    ) -> Optional[Exam]:
        db_exam = db.query(Exam).filter(Exam.id == exam_id).first()
        if db_exam:
            update_data = exam_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_exam, field, value)
            db.commit()
            db.refresh(db_exam)
        return db_exam

    @staticmethod
    def delete_exam(db: Session, exam_id: int) -> bool:
        db_exam = db.query(Exam).filter(Exam.id == exam_id).first()
        if db_exam:
            db.delete(db_exam)
            db.commit()
            return True
        return False

   