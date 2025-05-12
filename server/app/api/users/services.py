from sqlalchemy.orm import Session
from . import models, schemas
from ..roles import models as role_models, services as role_services
from ...core.security import get_password_hash
from fastapi import HTTPException, status

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    # Check if email exists
    if user.email:
        existing_email = get_user_by_email(db, user.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

    # Check if institutional_id exists
    if user.institutional_id:
        existing_id = db.query(models.User).filter(
            models.User.institutional_id == user.institutional_id
        ).first()
        if existing_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Institutional ID already exists"
            )

    role_id = user.role_id if user.role_id is not None else role_models.Role.get_default_role_id(db)
    
    if not role_services.get_role(db, role_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role ID"
        )

    try:
        hashed_password = get_password_hash(user.password) if user.password else None
        db_user = models.User(
            email=user.email,
            password_hash=hashed_password,
            full_name=user.full_name,
            institutional_id=user.institutional_id,
            role_id=role_id
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = get_user(db, user_id)
    if not db_user:
        return None
        
    update_data = user_update.dict(exclude_unset=True)
    
    # Handle password update
    if "password" in update_data:
        if update_data["password"]:
            update_data["password_hash"] = get_password_hash(update_data.pop("password"))
        else:
            update_data.pop("password")
    
    # Handle role update
    if "role_id" in update_data:
        if not role_services.get_role(db, update_data["role_id"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role ID"
            )
    
    # Update fields
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    try:
        db.delete(db_user)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )