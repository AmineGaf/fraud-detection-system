from pydantic_settings import BaseSettings
from pydantic import EmailStr, AnyHttpUrl

class Settings(BaseSettings):
    # Security settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database settings
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str
    DB_PORT: str = "5432"
    DB_HOST: str = "localhost"
    
    # Email settings
    SMTP_HOST: str
    SMTP_PORT: int = 587
    SMTP_USER: str
    SMTP_PASSWORD: str
    EMAILS_FROM_EMAIL: EmailStr
    EMAILS_FROM_NAME: str = "Your App Name"
    
    # Frontend URLs
    FRONTEND_URL: AnyHttpUrl = "http://localhost:3000"
    
    # Security
    PASSWORD_RESET_RATE_LIMIT: int = 3  # Max requests per 15 minutes
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = False

settings = Settings()