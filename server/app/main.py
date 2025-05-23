from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
import os
from contextlib import asynccontextmanager

# AI Model Setup (Load during startup)
from app.ai.model_loader import load_model
from app.ai.inference import FraudDetector

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load AI model when starting
    MODEL_PATH = os.path.join(os.path.dirname(__file__), "ai", "best.pt")
    app.state.ai_model = load_model(MODEL_PATH)
    app.state.detector = FraudDetector(app.state.ai_model)
    yield
    # Cleanup on shutdown
    del app.state.ai_model
    del app.state.detector

# Initialize FastAPI app with lifespan
app = FastAPI(lifespan=lifespan)

# Configure CORS middleware (keep your existing config)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  
        "http://127.0.0.1:5173",  
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Initialize DB
Base.metadata.create_all(bind=engine)

# Include routers (keep your existing routes)
from app.api.users import routes as user_routes
from app.api.roles import routes as role_routes
from app.api.auth import routes as auth_routes
from app.api.classes import routes as class_routes
from app.api.exams import routes as exams_routes

app.include_router(user_routes.router)
app.include_router(role_routes.router)
app.include_router(auth_routes.router)
app.include_router(class_routes.router)
app.include_router(exams_routes.router)

# Add new AI endpoints
from app.api.fraud_detection import routes as fraud_routes
app.include_router(fraud_routes.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
def health_check():
    return {"status": "OK", "ai_ready": hasattr(app.state, "detector")}