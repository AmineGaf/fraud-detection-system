from datetime import datetime, timedelta
import secrets
import string
from sqlalchemy.orm import Session
from sqlalchemy import Index
from app.api.users.models import User, PasswordResetToken
from app.core.config import settings
from app.core.email import send_reset_password_email
from urllib.parse import urlparse

def validate_frontend_url(url: str) -> str:
    """Validate the frontend URL is safe"""
    parsed = urlparse(url)
    if not parsed.scheme in ('http', 'https'):
        raise ValueError("Invalid URL scheme")
    return url

def generate_reset_token(length=32) -> str:
    """Generate a cryptographically secure random token"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def create_password_reset_token(db: Session, user_id: int) -> str:
    """Create and store a password reset token"""
    # Delete any existing tokens for this user
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user_id
    ).delete()
    
    token = generate_reset_token()
    expires_at = datetime.utcnow() + timedelta(
        minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
    )
    
    db_token = PasswordResetToken(
        token=token,
        user_id=user_id,
        expires_at=expires_at
    )
    db.add(db_token)
    db.commit()
    return token

def verify_password_reset_token(db: Session, token: str) -> User | None:
    """Verify if a password reset token is valid and return user"""
    db_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == token,
        PasswordResetToken.expires_at >= datetime.utcnow(),
        PasswordResetToken.is_used == False  # Ensure token hasn't been used
    ).first()
    
    return db_token.user if db_token else None

def mark_token_as_used(db: Session, token: str) -> None:
    """Mark a token as used to prevent reuse"""
    db.query(PasswordResetToken).filter(
        PasswordResetToken.token == token
    ).update({"is_used": True})
    db.commit()

def cleanup_expired_tokens(db: Session) -> int:
    """Clean up expired tokens and return count deleted"""
    result = db.query(PasswordResetToken).filter(
        PasswordResetToken.expires_at < datetime.utcnow()
    ).delete()
    db.commit()
    return result