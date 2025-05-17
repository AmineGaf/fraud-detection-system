from sqlalchemy.orm import Session
from typing import List, Optional
from .models import Class, UserClassAssociation
from .schemas import ClassCreate, ClassUpdate

class ClassService:
    @staticmethod
    def get_class(db: Session, class_id: int) -> Optional[Class]:
        return db.query(Class).filter(Class.id == class_id).first()

    @staticmethod
    def get_classes(db: Session, skip: int = 0, limit: int = 100) -> List[Class]:
        return db.query(Class).offset(skip).limit(limit).all()

    @staticmethod
    def create_class(db: Session, class_data: ClassCreate) -> Class:
        db_class = Class(**class_data.model_dump())
        db.add(db_class)
        db.commit()
        db.refresh(db_class)
        return db_class

    @staticmethod
    def update_class(
        db: Session, 
        class_id: int, 
        class_data: ClassUpdate
    ) -> Optional[Class]:
        db_class = db.query(Class).filter(Class.id == class_id).first()
        if db_class:
            update_data = class_data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_class, field, value)
            db.commit()
            db.refresh(db_class)
        return db_class

    @staticmethod
    def delete_class(db: Session, class_id: int) -> bool:
        db_class = db.query(Class).filter(Class.id == class_id).first()
        if db_class:
            db.delete(db_class)
            db.commit()
            return True
        return False

    @staticmethod
    def add_user_to_class(
        db: Session,
        class_id: int,
        user_id: int,
        is_professor: bool = False
    ) -> UserClassAssociation:
        association = UserClassAssociation(
            class_id=class_id,
            user_id=user_id,
            is_professor=is_professor
        )
        db.add(association)
        db.commit()
        db.refresh(association)
        return association

    @staticmethod
    def remove_user_from_class(db: Session, class_id: int, user_id: int) -> bool:
        association = db.query(UserClassAssociation).filter(
            UserClassAssociation.class_id == class_id,
            UserClassAssociation.user_id == user_id
        ).first()
        if association:
            db.delete(association)
            db.commit()
            return True
        return False