from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import CurrentUser
from app.db.session import get_db
from app.model.resume import Resume
from app.schema.schemas import (
    AIGenerateRequest, AIGenerateResponse,
    ATSRequest, ATSResponse,
    CoverLetterRequest, CoverLetterResponse,
)
from app.services import ai_services
from app.services.credit_services import CreditService

router = APIRouter(prefix="/ai", tags=["ai"])
DB = Annotated[AsyncSession, Depends(get_db)]


async def _get_resume(db: AsyncSession, resume_id: str, user_id: str) -> Resume:
    resume = await Resume.get_by_id(db, resume_id)
    if not resume or resume.user_id != user_id:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


# ── AI insight / improvements  (2 free, 150 premium) ─────────────────────────

@router.post("/generate", response_model=AIGenerateResponse)
async def ai_generate(body: AIGenerateRequest, user: CurrentUser, db: DB):
    svc = CreditService(db)

    if not await svc.has_credit(user, "ai"):
        raise HTTPException(status_code=402, detail="No AI credits remaining. Upgrade to premium for 150 credits.")

    resume = await _get_resume(db, body.resume_id, user.id)

    insight = await ai_services.generate_insight(
        data=resume.data,
        custom_prompt=body.prompt,
        is_premium=(user.plan == "premium"),
    )

    # Store insight on resume
    resume.insight = insight
    db.add(resume)

    remaining = await svc.consume(user, "ai")
    await db.commit()

    return AIGenerateResponse(insight=insight, credits_remaining=remaining)


# ── ATS score  (1 free credit) ────────────────────────────────────────────────

@router.post("/ats", response_model=ATSResponse)
async def ats_score(body: ATSRequest, user: CurrentUser, db: DB):
    svc = CreditService(db)

    if not await svc.has_credit(user, "ats"):
        raise HTTPException(status_code=402, detail="No ATS credits remaining. Upgrade to premium for unlimited.")

    resume = await _get_resume(db, body.resume_id, user.id)

    result = await ai_services.score_ats(
        data=resume.data,
        job_description=body.job_description,
    )
    remaining = await svc.consume(user, "ats")

    return ATSResponse(
        score=result.get("score", 0),
        missing_keywords=result.get("missing_keywords", []),
        suggestions=result.get("suggestions", []),
        credits_remaining=remaining,
    )


# ── Cover letter  (1 free credit) ─────────────────────────────────────────────

@router.post("/cover-letter", response_model=CoverLetterResponse)
async def cover_letter(body: CoverLetterRequest, user: CurrentUser, db: DB):
    svc = CreditService(db)

    if not await svc.has_credit(user, "cover_letter"):
        raise HTTPException(status_code=402, detail="No cover letter credits remaining. Upgrade to premium for unlimited.")

    resume = await _get_resume(db, body.resume_id, user.id)

    letter = await ai_services.generate_cover_letter(
        data=resume.data,
        job_title=body.job_title,
        company_name=body.company_name,
        job_description=body.job_description,
    )
    remaining = await svc.consume(user, "cover_letter")

    return CoverLetterResponse(cover_letter=letter, credits_remaining=remaining)