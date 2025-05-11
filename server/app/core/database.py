from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from typing import Generator

# Load environment variables
load_dotenv()

# 1. First declare Base (MUST come before any model imports)
Base = declarative_base()

# 2. Database configuration
DATABASE_URL = "postgresql://amine:amine@localhost:5432/db"

print(DATABASE_URL)

# Connection pool settings
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

# 3. Import models AFTER Base is defined
# This must be at the bottom to avoid circular imports
from app.api.users import models  # noqa: E402

# Create all tables
def initialize_database():
    Base.metadata.create_all(bind=engine)

# Optional: Call this in main.py
initialize_database()