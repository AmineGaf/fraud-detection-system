from sqlalchemy.orm import Session
from . import models, schemas
from ...core.security import get_password_hash
from fastapi import  HTTPException

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    if user.email:
        existing_email = db.query(models.User).filter(
            models.User.email == user.email
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

    if user.institutional_id:
        existing_id = db.query(models.User).filter(
            models.User.institutional_id == user.institutional_id
        ).first()
        if existing_id:
            raise HTTPException(
                status_code=400,
                detail="Institutional ID already exists"
            )

    try:
        hashed_password = get_password_hash(user.password) if user.password else None
        db_user = models.User(
            email=user.email,
            password_hash=hashed_password,
            full_name=user.full_name,
            institutional_id=user.institutional_id
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(e)}"
        )

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
        
    update_data = user_update.dict(exclude_unset=True)
    
    if "password" in update_data:
        if update_data["password"]:
            update_data["password_hash"] = get_password_hash(update_data.pop("password"))
        else:
            update_data.pop("password")
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True