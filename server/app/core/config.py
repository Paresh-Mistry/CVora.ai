from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    APP_NAME: str = "CV-GEN: AI Resume Builder"
    DEBUG: bool = False

    DATABASE_URL: str = os.getenv("DATABASE_URL")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_PUBLISHABLE_KEY: str = os.getenv("SUPABASE_PUBLISHABLE_KEY")
    SUPABASE_SECRET_KEY: str = os.getenv("SUPABASE_SECRET_KEY")
    SUPABASE_JWKS_URL: str = os.getenv("SUPABASE_JWKS_URL")

    REDIS_URL: str = os.getenv("REDIS_URL")

    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL")
    GEMINI_MODEL_PREMIUM: str = os.getenv("GEMINI_MODEL_PREMIUM")

    FREE_AI_CREDITS: int = 5
    PREMIUM_AI_CREDITS: int = 150
    FREE_ATS_CREDITS: int = 2
    FREE_COVER_LETTER_CREDITS: int = 1

    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET")

    JSEARCH_API_KEY: str = ""

    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
