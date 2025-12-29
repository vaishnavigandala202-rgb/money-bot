from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MoneyBot API"
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_JWT_SECRET: str
    CORS_ORIGINS: str = "*" # Default to allow all for development, override in production
    
    class Config:
        env_file = ".env"

settings = Settings()
