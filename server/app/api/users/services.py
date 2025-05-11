from sqlalchemy.orm import Session
from . import models, schemas
from ...core.security import get_password_hash

def create_user(db: Session, user: schemas.UserCreate):
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