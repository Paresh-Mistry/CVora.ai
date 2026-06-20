from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, String, select
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id:            Mapped[str]  = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    email:         Mapped[str]  = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name:     Mapped[Optional[str]] = mapped_column(String(255))
    plan:          Mapped[str]  = mapped_column(String(20), default="free")   # "free" | "premium"
    is_active:     Mapped[bool] = mapped_column(Boolean, default=True)
    is_verified:   Mapped[bool] = mapped_column(Boolean, default=False)
    created_at:    Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at:    Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # ── Queries ───────────────────────────────────────────────────────────────

    @classmethod
    async def get_by_id(cls, db: AsyncSession, user_id: str) -> Optional["User"]:
        result = await db.execute(select(cls).where(cls.id == user_id))
        return result.scalar_one_or_none()

    @classmethod
    async def get_by_email(cls, db: AsyncSession, email: str) -> Optional["User"]:
        result = await db.execute(select(cls).where(cls.email == email))
        return result.scalar_one_or_none()