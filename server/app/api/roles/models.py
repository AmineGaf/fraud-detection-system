from app.core.database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    
    users = relationship("User", back_populates="role")
    
    @staticmethod
    def get_default_role_id(db):
        role = db.query(Role).filter(Role.name == "student").first()
        if not role:
            raise ValueError("Default role 'student' not found")
        return role.id