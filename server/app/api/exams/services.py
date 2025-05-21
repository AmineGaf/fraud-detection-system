from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from .models import Exam
from .schemas import ExamCreate, ExamResponse, ExamUpdate
from sqlalchemy.sql import func

class ExamService:
    
    @staticmethod
    def get_all_exams(db: Session, skip: int = 0, limit: int = 100) -> List[ExamResponse]:
        exams = db.query(Exam).options(joinedload(Exam.class_)).offset(skip).limit(limit).all()
        return [ExamResponse.from_orm(exam) for exam in exams]
    
    @staticmethod
    def get_exam(db: Session, exam_id: int) -> Optional[ExamResponse]:
        exam = db.query(Exam).options(joinedload(Exam.class_)).filter(Exam.id == exam_id).first()
        return ExamResponse.from_orm(exam) if exam else None

    @staticmethod
    def get_exams_by_class(db: Session, class_id: int, skip: int = 0, limit: int = 100) -> List[ExamResponse]:
        exams = db.query(Exam).options(joinedload(Exam.class_)).filter(Exam.class_id == class_id).offset(skip).limit(limit).all()
        return [ExamResponse.from_orm(exam) for exam in exams]

    @staticmethod
    def create_exam(db: Session, exam_data: ExamCreate) -> ExamResponse:
        db_exam = Exam(**exam_data.model_dump())
        db.add(db_exam)
        db.commit()
        db.refresh(db_exam)
        # Need to reload with class_ relationship
        db_exam = db.query(Exam).options(joinedload(Exam.class_)).filter(Exam.id == db_exam.id).first()
        return ExamResponse.from_orm(db_exam)

    @staticmethod
    def update_exam(db: Session, exam_id: int, exam_data: ExamUpdate) -> Optional[ExamResponse]:
        db_exam = db.query(Exam).filter(Exam.id == exam_id).first()
        if db_exam:
            update_data = exam_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_exam, field, value)
            db.commit()
            db.refresh(db_exam)
            db_exam = db.query(Exam).options(joinedload(Exam.class_)).filter(Exam.id == exam_id).first()
            return ExamResponse.from_orm(db_exam)
        return None

    @staticmethod
    def delete_exam(db: Session, exam_id: int) -> bool:
        db_exam = db.query(Exam).filter(Exam.id == exam_id).first()
        if db_exam:
            db.delete(db_exam)
            db.commit()
            return True
        
        return False
   