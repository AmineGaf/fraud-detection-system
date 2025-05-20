from sqlalchemy.orm import Session, joinedload
from . import models, schemas
from ..classes.models import UserClassAssociation 
from ..roles import models as role_models, services as role_services
from ...core.security import get_password_hash
from fastapi import HTTPException, status

def get_user(db: Session, user_id: int):
    return db.query(models.User).options(
        joinedload(models.User.role),
        joinedload(models.User.classes).joinedload(UserClassAssociation.class_)
    ).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).options(
        joinedload(models.User.role),
        joinedload(models.User.classes).joinedload(UserClassAssociation.class_)
    ).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).options(
        joinedload(models.User.role),
        joinedload(models.User.classes).joinedload(UserClassAssociation.class_)
    ).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    if user.email:
        existing_email = get_user_by_email(db, user.email)
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

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
    
    is_student = (role_id == 1) 
    hashed_password = None
    
    if not is_student:
        if not user.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is required for non-student roles"
            )
        hashed_password = get_password_hash(user.password)
    elif user.password: 
        hashed_password = get_password_hash(user.password)

    try:
        db_user = models.User(
            email=user.email,
            password_hash=hashed_password,
            full_name=user.full_name,
            institutional_id=user.institutional_id,
            role_id=role_id,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        # Reload with relationships to return complete data
        return get_user(db, db_user.id)
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
        
    # Replace .dict() with .model_dump()
    update_data = user_update.model_dump(exclude_unset=True)
    
    if "password" in update_data:
        if update_data["password"]:
            update_data["password_hash"] = get_password_hash(update_data.pop("password"))
        else:
            update_data.pop("password")
    
    if "role_id" in update_data:
        if not role_services.get_role(db, update_data["role_id"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role ID"
            )
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    try:
        db.commit()
        db.refresh(db_user)
        # Reload with relationships to return complete data
        return get_user(db, user_id)
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