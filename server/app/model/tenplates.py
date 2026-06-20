from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4
 
from sqlalchemy import Boolean, DateTime, String, select
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column
from pydantic import BaseModel
 
from app.db.session import Base
 
 
class Template(Base):
    __tablename__ = "templates"
 
    id:           Mapped[str]  = mapped_column(String(50), primary_key=True)
    name:         Mapped[str]  = mapped_column(String(100))
    description:  Mapped[str]  = mapped_column(String(500), default="")
    layout:       Mapped[str]  = mapped_column(String(10), default="A")       # "A" | "B" | "C"
    is_premium:   Mapped[bool] = mapped_column(Boolean, default=False)
    preview_bg:   Mapped[str]  = mapped_column(String(20), default="#ffffff")  # thumbnail bg color
    preview_url:  Mapped[Optional[str]] = mapped_column(String(500))
    tokens:       Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at:   Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
 
    # ── Queries ───────────────────────────────────────────────────────────────
 
    @classmethod
    async def get_by_id(cls, db: AsyncSession, template_id: str) -> Optional["Template"]:
        result = await db.execute(select(cls).where(cls.id == template_id))
        return result.scalar_one_or_none()
 
    @classmethod
    async def get_all(cls, db: AsyncSession) -> list["Template"]:
        # Free first, then premium — matches frontend display order
        result = await db.execute(select(cls).order_by(cls.is_premium, cls.id))
        return list(result.scalars().all())
 
 
# ── Seed data ─────────────────────────────────────────────────────────────────
# layout is purely a frontend routing key:
#   "A" → single column  (LayoutA component)
#   "B" → two column     (LayoutB component)
#   "C" → sidebar panel  (LayoutC component)
# The backend stores it and returns it — the frontend decides which
# <Layout*> component to render based on it.
 
TEMPLATE_SEEDS = [
 
    # ── FREE ──────────────────────────────────────────────────────────────────
    {
        "id": "t1",
        "name": "Classic",
        "description": "Traditional centered serif",
        "layout": "A",
        "is_premium": False,
        "preview_bg": "#fafaf8",    
        "preview_url": "/previews/t1.png",
        "tokens": {
            "font": "'Georgia', serif",
            "displayFont": "'Georgia', serif",
            "accent": "#1a1a1a",
            "nameSize": "30px",
            "skillStyle": "tag",
            "headerStyle": "centered",
            "divider": "underline",
            "padding": "44px 52px",
        },
    },
    {
        "id": "t2",
        "name": "Minimal",
        "description": "Clean left-aligned sans-serif",
        "layout": "A",
        "is_premium": False,
        "preview_bg": "#ffffff",
        "preview_url": "/previews/t2.png",
        "tokens": {
            "font": "'Inter', sans-serif",
            "displayFont": "'Inter', sans-serif",
            "accent": "#111827",
            "nameSize": "28px",
            "skillStyle": "dot",
            "headerStyle": "left",
            "divider": "line",
            "padding": "40px 48px",
        },
    },
 
    # ── PREMIUM ───────────────────────────────────────────────────────────────
    {
        "id": "t3",
        "name": "Executive",
        "description": "Dark sidebar with structured sections",
        "layout": "C",
        "is_premium": True,
        "preview_bg": "#f8fafc",
        "preview_url": "/previews/t3.png",
        "tokens": {
            "font": "'Inter', sans-serif",
            "displayFont": "'Playfair Display', serif",
            "accent": "#1e3a5f",
            "bannerBg": "#1e3a5f",
            "nameSize": "32px",
            "skillStyle": "pill",
            "headerStyle": "sidebar",
            "divider": "thick",
            "padding": "0px",
            "sidebarBg": "#1e3a5f",
            "sidebarWidth": "200px",
        },
    },
    {
        "id": "t4",
        "name": "Banner",
        "description": "Bold full-width color header",
        "layout": "B",
        "is_premium": True,
        "preview_bg": "#ffffff",
        "preview_url": "/previews/t4.png",
        "tokens": {
            "font": "'Inter', sans-serif",
            "displayFont": "'Inter', sans-serif",
            "accent": "#2563eb",
            "bannerBg": "#2563eb",
            "nameSize": "30px",
            "skillStyle": "bar",
            "headerStyle": "banner",
            "divider": "none",
            "padding": "0px",
        },
    },
    {
        "id": "t5",
        "name": "Creative",
        "description": "Violet accent with split header",
        "layout": "B",
        "is_premium": True,
        "preview_bg": "#fdf4ff",
        "preview_url": "/previews/t5.png",
        "tokens": {
            "font": "'Inter', sans-serif",
            "displayFont": "'Syne', sans-serif",
            "accent": "#7c3aed",
            "bannerBg": "#7c3aed",
            "nameSize": "34px",
            "skillStyle": "grid",
            "headerStyle": "split",
            "divider": "dashed",
            "padding": "36px 44px",
            "accentLight": "#f3e8ff",
        },
    },
    {
        "id": "t6",
        "name": "Modern",
        "description": "Emerald tones with dot motifs",
        "layout": "B",
        "is_premium": True,
        "preview_bg": "#f0fdf4",
        "preview_url": "/previews/t6.png",
        "tokens": {
            "font": "'Inter', sans-serif",
            "displayFont": "'Inter', sans-serif",
            "accent": "#059669",
            "bannerBg": "#059669",
            "nameSize": "28px",
            "skillStyle": "pill",
            "headerStyle": "left",
            "divider": "line",
            "padding": "40px 48px",
            "accentLight": "#d1fae5",
        },
    },
    {
        "id": "t7",
        "name": "Sharp",
        "description": "High contrast black with geometric lines",
        "layout": "A",
        "is_premium": True,
        "preview_bg": "#ffffff",
        "preview_url": "/previews/t7.png",
        "tokens": {
            "font": "'DM Sans', sans-serif",
            "displayFont": "'DM Sans', sans-serif",
            "accent": "#000000",
            "nameSize": "36px",
            "skillStyle": "tag",
            "headerStyle": "left",
            "divider": "thick",
            "padding": "48px 56px",
            "accentLight": "#f1f5f9",
        },
    },
    {
        "id": "t8",
        "name": "Warm",
        "description": "Terracotta tones, editorial feel",
        "layout": "C",
        "is_premium": True,
        "preview_bg": "#fffaf7",
        "preview_url": "/previews/t8.png",
        "tokens": {
            "font": "'Lora', serif",
            "displayFont": "'Lora', serif",
            "accent": "#c2410c",
            "nameSize": "30px",
            "skillStyle": "dot",
            "headerStyle": "centered",
            "divider": "underline",
            "padding": "44px 52px",
            "accentLight": "#fff7ed",
        },
    },
]
 
 
async def seed_templates(db: AsyncSession):
    from sqlalchemy.dialects.postgresql import insert as pg_insert
    for t in TEMPLATE_SEEDS:
        stmt = (
            pg_insert(Template)
            .values(**t)
            .on_conflict_do_update(
                index_elements=["id"],
                # Update everything except id and created_at on re-seed
                set_={k: v for k, v in t.items() if k not in ("id",)},
            )
        )
        await db.execute(stmt)
    await db.commit()