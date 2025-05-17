from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from typing import Generator
from .config import settings

load_dotenv()

Base = declarative_base()

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=5,
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args={
        "connect_timeout": 5
    }
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def initialize_database():
    # Import all models here to ensure they're registered with SQLAlchemy
    from app.api.users.models import User, PasswordResetToken
    from app.api.roles.models import Role
    from app.api.classes.models import Class, UserClassAssociation
    from app.api.exams.models import Exam
    
    Base.metadata.create_all(bind=engine)
    
    # Create default roles if they don't exist
    db = SessionLocal()
    try:
        from app.api.roles.services import create_default_roles
        create_default_roles(db)
    finally:
        db.close()

initialize_database()