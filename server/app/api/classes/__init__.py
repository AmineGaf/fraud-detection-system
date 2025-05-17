from fastapi import APIRouter
from .routes import router as classes_router

router = APIRouter()
router.include_router(classes_router)

__all__ = ["router"]