from fastapi import FastAPI
from app.api.users.routes import router as user_routes 
from app.core.database import Base, engine

app = FastAPI()

# Initialize DB
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(user_routes)

@app.get("/")
def health_check():
    return {"status": "OK"}