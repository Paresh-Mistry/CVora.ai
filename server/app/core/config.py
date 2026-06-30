from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    APP_NAME: str = "CV-GEN: AI Resume Builder"
    DEBUG: bool = False

    # ── Database ──────────────────────────────────────────────────────────────
    # PostgreSQL — primary relational + JSONB store
    DATABASE_URL: str = "postgresql+psycopg://postgres:psql2004@localhost:5432/cv_gen"

    # Redis — token blacklist, rate limiting, credit cache
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── Auth ──────────────────────────────────────────────────────────────────
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # ── AI ────────────────────────────────────────────────────────────────────
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL")        # cheap + fast for most tasks
    GEMINI_MODEL_PREMIUM: str = os.getenv("GEMINI_MODEL_PREMIUM")        # cheap + fast for most tasks
      # richer output for premium

    # ── Credits ───────────────────────────────────────────────────────────────
    FREE_AI_CREDITS: int = 2
    PREMIUM_AI_CREDITS: int = 150
    FREE_ATS_CREDITS: int = 1
    FREE_COVER_LETTER_CREDITS: int = 1

    # ── Job search ────────────────────────────────────────────────────────────
    JSEARCH_API_KEY: str = ""                  # RapidAPI JSearch (premium feature)

    # ── CORS ──────────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()