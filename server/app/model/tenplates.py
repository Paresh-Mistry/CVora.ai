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

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(500), default="")
    layout: Mapped[str] = mapped_column(String(10), default="A")  # "A" | "B" | "C"
    is_premium: Mapped[bool] = mapped_column(Boolean, default=False)
    preview_bg: Mapped[str] = mapped_column(
        String(20), default="#ffffff"
    )  # thumbnail bg color
    preview_url: Mapped[Optional[str]] = mapped_column(String(500))
    tokens: Mapped[dict] = mapped_column(JSONB, default=dict)
    sections: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # ── Queries ───────────────────────────────────────────────────────────────

    @classmethod
    async def get_by_id(
        cls, db: AsyncSession, template_id: str
    ) -> Optional["Template"]:
        result = await db.execute(select(cls).where(cls.id == template_id))
        return result.scalar_one_or_none()

    @classmethod
    async def get_all(cls, db: AsyncSession) -> list["Template"]:
        # Free first, then premium — matches frontend display order
        result = await db.execute(select(cls).order_by(cls.is_premium, cls.id))
        return list(result.scalars().all())


TEMPLATE_SEEDS = [
    {
        "id": "t1",
        "name": "Classic",
        "description": "Traditional ATS-friendly resume with serif typography.",
        "layout": "A",
        "is_premium": False,
        "preview_bg": "#fafaf8",
        "preview_url": "/previews/t1.png",
        "tokens": {
            "font": "'Georgia', serif",
            "displayFont": "'Georgia', serif",
            "accent": "#1a1a1a",
            "accentLight": "#f5f5f5",
            "nameSize": "30px",
            "padding": "44px 52px",
            "divider": "underline",
            "headerStyle": "centered",
            "skillStyle": "tag",
            "avatar": False,
            "avatarShape": "circle",
            "sidebar": False,
            "sidebarWidth": "0px",
            "timeline": False,
            "sectionSpacing": "18px",
            "paragraphSpacing": "8px",
            "showIcons": False,
            "showProgress": False,
            "showBadges": True,
            "borderRadius": "4px",
        },
        "sections": {
            "summary": True,
            "experience": True,
            "education": True,
            "skills": True,
            "projects": True,
            "achievements": True,
            "certificates": True,
            "languages": True,
            "interests": True,
            "references": False,
        },
    },
    {
        "id": "t3",
        "name": "Executive",
        "description": "Executive resume with dark sidebar.",
        "layout": "B",
        "is_premium": True,
        "preview_bg": "#f8fafc",
        "preview_url": "/previews/t3.png",
        "tokens": {
            "font": "'Inter', sans-serif",
            "displayFont": "'Playfair Display', serif",
            "accent": "#1e3a5f",
            "accentLight": "#dbeafe",
            "bannerBg": "#1e3a5f",
            "sidebar": True,
            "sidebarWidth": "210px",
            "sidebarBg": "#1e3a5f",
            "sidebarText": "#ffffff",
            "sidebarAccent": "#93c5fd",
            "avatar": True,
            "avatarShape": "circle",
            "padding": "0px",
            "divider": "line",
            "headerStyle": "sidebar",
            "skillStyle": "bar",
            "timeline": True,
            "showIcons": True,
            "showBadges": False,
            "showProgress": True,
            "sectionSpacing": "18px",
            "paragraphSpacing": "8px",
            "borderRadius": "8px",
        },
        "sections": {
            "summary": True,
            "experience": True,
            "education": True,
            "skills": True,
            "projects": True,
            "certificates": True,
            "achievements": True,
            "languages": True,
            "interests": False,
            "references": False,
        },
    },
    {
        "id": "t4",
        "name": "Corporate Blue",
        "description": "Professional corporate resume with clean typography and subtle blue accents.",
        "layout": "A",
        "is_premium": True,
        "preview_bg": "#ffffff",
        "preview_url": "/previews/t11.png",
        "tokens": {
            "font": "'Inter', sans-serif",
            "displayFont": "'Inter', sans-serif",
            "accent": "#2563eb",
            "accentLight": "#dbeafe",
            "bannerBg": "#2563eb",
            "sidebar": False,
            "padding": "46px 54px",
            "divider": "line",
            "headerStyle": "left",
            "skillStyle": "pill",
            "timeline": False,
            "showIcons": True,
            "showBadges": True,
            "showProgress": False,
            "sectionSpacing": "18px",
            "paragraphSpacing": "8px",
            "borderRadius": "6px",
        },
        "sections": {
            "summary": True,
            "experience": True,
            "education": True,
            "skills": True,
            "projects": True,
            "certificates": True,
            "achievements": True,
            "languages": True,
            "interests": False,
            "references": False,
        },
    },
    {
        "id": "t5",
        "name": "Elegant Sidebar",
        "description": "Modern sidebar layout with elegant serif headings and rich profile section.",
        "layout": "B",
        "is_premium": True,
        "preview_bg": "#f8fafc",
        "preview_url": "/previews/t12.png",
        "tokens": {
            "font": "'Source Sans Pro', sans-serif",
            "displayFont": "'Playfair Display', serif",
            "accent": "#7c2d12",
            "accentLight": "#ffedd5",
            "bannerBg": "#7c2d12",
            "sidebar": True,
            "sidebarWidth": "220px",
            "sidebarBg": "#7c2d12",
            "sidebarText": "#ffffff",
            "sidebarAccent": "#fdba74",
            "avatar": True,
            "avatarShape": "square",
            "padding": "0px",
            "divider": "underline",
            "headerStyle": "sidebar",
            "skillStyle": "bar",
            "timeline": False,
            "showIcons": True,
            "showBadges": False,
            "showProgress": True,
            "sectionSpacing": "18px",
            "paragraphSpacing": "8px",
            "borderRadius": "10px",
        },
        "sections": {
            "summary": True,
            "experience": True,
            "education": True,
            "skills": True,
            "projects": True,
            "certificates": True,
            "achievements": True,
            "languages": True,
            "interests": True,
            "references": False,
        },
    },
    {
        "id": "t6",
        "name": "Gradient Banner",
        "description": "Contemporary banner layout featuring a bold colored header and minimal content styling.",
        "layout": "C",
        "is_premium": True,
        "preview_bg": "#ffffff",
        "preview_url": "/previews/t13.png",
        "tokens": {
            "font": "'Poppins', sans-serif",
            "displayFont": "'Poppins', sans-serif",
            "accent": "#9333ea",
            "accentLight": "#f3e8ff",
            "bannerBg": "#9333ea",
            "sidebar": False,
            "padding": "0px",
            "divider": "none",
            "headerStyle": "banner",
            "skillStyle": "pill",
            "timeline": True,
            "showIcons": True,
            "showBadges": True,
            "showProgress": False,
            "sectionSpacing": "20px",
            "paragraphSpacing": "8px",
            "borderRadius": "12px",
        },
        "sections": {
            "summary": True,
            "experience": True,
            "education": True,
            "skills": True,
            "projects": True,
            "certificates": True,
            "achievements": True,
            "languages": True,
            "interests": True,
            "references": False,
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
