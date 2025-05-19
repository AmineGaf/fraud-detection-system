from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.users.models import User
from .password_reset import (
    create_password_reset_token,
    verify_password_reset_token,
    mark_token_as_used,
    cleanup_expired_tokens
)
from .schemas import Token, PasswordResetRequest, PasswordResetConfirm
from .services import (
    authenticate_user,
    create_access_token,
    get_password_hash,
)
from app.core.config import settings
from app.core.email import send_reset_password_email
from fastapi_limiter.depends import RateLimiter

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    
    access_token = create_access_token(
        data={"sub": user.email, "role_id": user.role_id},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_email": user.email,
        "user_roleId": user.role_id
    }

@router.post(
    "/forgot-password",
    status_code=status.HTTP_202_ACCEPTED,
)
async def forgot_password(
    request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    cleanup_expired_tokens(db)  
    
    user = db.query(User).filter(
        User.email == request.email,
    ).first()
    
    if user:
        token = create_password_reset_token(db, user.id)
        send_reset_password_email(user.email, token)
    
    return {"message": "If the email exists, you'll receive a reset link"}

@router.post("/reset-password")
async def reset_password(
    request: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    
    user = verify_password_reset_token(db, request.token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    user.password_hash = get_password_hash(request.new_password)
    mark_token_as_used(db, request.token)
    db.commit()
    
    return {"message": "Password updated successfully"}