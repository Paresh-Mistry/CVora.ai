from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint, select
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Credit(Base):
    """
    One row per (user, feature).
    """
    __tablename__ = "credits"
    __table_args__ = (UniqueConstraint("user_id", "feature", name="uq_user_feature"),)

    id:         Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    user_id:    Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    feature:    Mapped[str] = mapped_column(String(50))   
    used:       Mapped[int] = mapped_column(Integer, default=0)
    total:      Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    @property
    def remaining(self) -> int:
        return max(0, self.total - self.used)

    @classmethod
    async def get(cls, db: AsyncSession, user_id: str, feature: str) -> Optional["Credit"]:
        result = await db.execute(
            select(cls).where(cls.user_id == user_id, cls.feature == feature)
        )
        return result.scalar_one_or_none()