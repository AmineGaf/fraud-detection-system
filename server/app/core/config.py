from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Security settings (existing)
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database settings
    DB_NAME: str             
    DB_USER: str          
    DB_PASSWORD: str       
    DB_PORT: str = "5432"              
    DB_HOST: str = "localhost"        
    
    # Computed database URL
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'
        case_sensitive = False

settings = Settings()