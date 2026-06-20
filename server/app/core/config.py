from pydantic_settings import BaseSettings
from typing import List


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
    OPENAI_API_KEY: str = "skjdskdjsjdsjkdjsdkasasg"
    OPENAI_MODEL: str = "gpt-4o-mini"          # cheap + fast for most tasks
    OPENAI_MODEL_PREMIUM: str = "gpt-4o"       # richer output for premium

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