from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, String, select
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Resume(Base):
    __tablename__ = "resumes"

    id:         Mapped[str]  = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    user_id:    Mapped[str]  = mapped_column(UUID(as_uuid=False), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title:      Mapped[str]  = mapped_column(String(255), default="My Resume")
    template_id:Mapped[str]  = mapped_column(String(50), default="classic")

    # Core resume data stored as JSONB — flexible, queryable, no migrations for field changes
    data:       Mapped[dict] = mapped_column(JSONB, default=dict)

    # AI-generated insight stored separately for quick access
    insight:    Mapped[Optional[str]] = mapped_column(String(4000))

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # ── Queries ───────────────────────────────────────────────────────────────

    @classmethod
    async def get_by_id(cls, db: AsyncSession, resume_id: str) -> Optional["Resume"]:
        result = await db.execute(select(cls).where(cls.id == resume_id))
        return result.scalar_one_or_none()

    @classmethod
    async def get_by_user(cls, db: AsyncSession, user_id: str) -> list["Resume"]:
        result = await db.execute(
            select(cls).where(cls.user_id == user_id).order_by(cls.updated_at.desc())
        )
        return list(result.scalars().all())