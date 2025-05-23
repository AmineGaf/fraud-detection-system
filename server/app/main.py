from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine

# Initialize FastAPI app
app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
    expose_headers=["*"], 
)

# Initialize DB
Base.metadata.create_all(bind=engine)

# Include routers
from app.api.users import routes as user_routes
from app.api.roles import routes as role_routes
from app.api.auth import routes as auth_routes
from app.api.classes import routes as class_routes
from app.api.exams import routes as exams_routes
from app.api.endpoints import ai_detection

app.include_router(user_routes.router)
app.include_router(role_routes.router)
app.include_router(auth_routes.router)
app.include_router(class_routes.router)
app.include_router(exams_routes.router)
app.include_router(
    ai_detection.router,
    prefix="/api/ai",
    tags=["AI Detection"]
)

@app.get("/")
def health_check():
    return {"status": "OK"}