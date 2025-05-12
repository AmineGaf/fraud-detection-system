from sqlalchemy.orm import Session
from . import models, schemas
from fastapi import HTTPException, status

def get_role(db: Session, role_id: int):
    return db.query(models.Role).filter(models.Role.id == role_id).first()

def get_role_by_name(db: Session, name: str):
    return db.query(models.Role).filter(models.Role.name == name).first()

def get_roles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Role).offset(skip).limit(limit).all()

def create_role(db: Session, role: schemas.RoleCreate):
    existing_role = get_role_by_name(db, role.name)
    if existing_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role with this name already exists"
        )
    
    db_role = models.Role(name=role.name)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def create_default_roles(db: Session):
    default_roles = ["student", "supervisor", "admin"]
    for role_name in default_roles:
        if not get_role_by_name(db, role_name):
            db_role = models.Role(name=role_name)
            db.add(db_role)
    db.commit()