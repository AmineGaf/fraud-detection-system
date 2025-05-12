from fastapi import FastAPI
from app.core.database import Base, engine

app = FastAPI()

# Initialize DB
Base.metadata.create_all(bind=engine)

# Include routers
from app.api.users import routes as user_routes
from app.api.roles import routes as role_routes

app.include_router(user_routes.router)
app.include_router(role_routes.router)

@app.get("/")
def health_check():
    return {"status": "OK"}