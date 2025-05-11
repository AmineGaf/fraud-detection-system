from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=True)

    password_hash = Column(String(128), nullable=True)
    full_name = Column(String(100), nullable=False)
    institutional_id = Column(String(50), unique=True, nullable=True)