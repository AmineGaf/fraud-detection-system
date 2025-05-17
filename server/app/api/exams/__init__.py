from fastapi import APIRouter
from .routes import router as exams_router

router = APIRouter()
router.include_router(exams_router)

__all__ = ["router"]