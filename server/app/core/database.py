from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from typing import Generator

load_dotenv()

Base = declarative_base()


DATABASE_URL = "postgresql://amine:amine@localhost:5432/db"

print(DATABASE_URL)


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
    """FastAPI dependency for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from app.api.users import models  


def initialize_database():
    Base.metadata.create_all(bind=engine)

initialize_database()