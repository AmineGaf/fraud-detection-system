from datetime import datetime
from app.core.database import Base
from sqlalchemy import Column, Index, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_used = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="password_reset_tokens")
    
    __table_args__ = (
        Index('ix_password_reset_token_expires', 'expires_at'),
        Index('ix_password_reset_token_user', 'user_id'),
    )

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=True)
    full_name = Column(String(100), nullable=False)
    institutional_id = Column(String(50), unique=True, nullable=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    
    role = relationship("Role", back_populates="users")
    password_reset_tokens = relationship(
        "PasswordResetToken", 
        back_populates="user",
        cascade="all, delete-orphan",
        lazy="dynamic"  # Keep dynamic for tokens if needed
    )
    
    classes = relationship(
        "UserClassAssociation",
        back_populates="user",
        cascade="all, delete-orphan",
        # Remove lazy="dynamic" to allow eager loading
    )
    
    # Add this property to get class information based on role
    @property
    def class_info(self):
        if self.role_id == 1:  # Student - single class
            association = self.classes.first()
            if association:
                return [association.class_]
            return []
        elif self.role_id == 2:  # Supervisor - multiple classes
            return [assoc.class_ for assoc in self.classes.all()]
        return []
    