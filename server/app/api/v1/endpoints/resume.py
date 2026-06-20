from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import CurrentUser
from app.db.session import get_db
from app.model.resume import Resume
from app.model.tenplates import Template
from app.schema.schemas import ResumeCreateRequest, ResumeOut, ResumeUpdateRequest

router = APIRouter(prefix="/resumes", tags=["resumes"])
DB = Annotated[AsyncSession, Depends(get_db)]


# ── List ──────────────────────────────────────────────────────────────────────

@router.get("/", response_model=List[ResumeOut])
async def list_resumes(user: CurrentUser, db: DB):
    return await Resume.get_by_user(db, user.id)


# ── Create ────────────────────────────────────────────────────────────────────

@router.post("/", response_model=ResumeOut, status_code=201)
async def create_resume(body: ResumeCreateRequest, user: CurrentUser, db: DB):
    # Verify template access
    tmpl = await Template.get_by_id(db, body.template_id)
    if not tmpl:
        raise HTTPException(status_code=404, detail="Template not found")
    if tmpl.is_premium and user.plan != "premium":
        raise HTTPException(status_code=402, detail="Premium template requires a premium plan")

    resume = Resume(
        user_id=user.id,
        title=body.title,
        template_id=body.template_id,
        data=body.data.model_dump(),
    )
    db.add(resume)
    await db.commit()
    await db.refresh(resume)
    return resume


# ── Get one ───────────────────────────────────────────────────────────────────

@router.get("/{resume_id}", response_model=ResumeOut)
async def get_resume(resume_id: str, user: CurrentUser, db: DB):
    resume = await Resume.get_by_id(db, resume_id)
    if not resume or resume.user_id != user.id:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


# ── Update ────────────────────────────────────────────────────────────────────

@router.patch("/{resume_id}", response_model=ResumeOut)
async def update_resume(resume_id: str, body: ResumeUpdateRequest, user: CurrentUser, db: DB):
    resume = await Resume.get_by_id(db, resume_id)
    if not resume or resume.user_id != user.id:
        raise HTTPException(status_code=404, detail="Resume not found")

    if body.template_id:
        tmpl = await Template.get_by_id(db, body.template_id)
        if not tmpl:
            raise HTTPException(status_code=404, detail="Template not found")
        if tmpl.is_premium and user.plan != "premium":
            raise HTTPException(status_code=402, detail="Premium template requires a premium plan")
        resume.template_id = body.template_id

    if body.title is not None:
        resume.title = body.title

    if body.data is not None:
        resume.data = body.data.model_dump()

    db.add(resume)
    await db.commit()
    await db.refresh(resume)
    return resume


# ── Delete ────────────────────────────────────────────────────────────────────

@router.delete("/{resume_id}", status_code=204)
async def delete_resume(resume_id: str, user: CurrentUser, db: DB):
    resume = await Resume.get_by_id(db, resume_id)
    if not resume or resume.user_id != user.id:
        raise HTTPException(status_code=404, detail="Resume not found")
    await db.delete(resume)
    await db.commit()