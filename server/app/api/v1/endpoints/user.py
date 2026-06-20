from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import CurrentUser, PremiumUser
from app.db.session import get_db
from app.model.resume import Resume
from app.schema.schemas import AllCreditsOut, CreditOut, JobSearchResponse
from app.services.credit_services import CreditService
from app.services.job_services import search_jobs

router = APIRouter(tags=["user"])
DB = Annotated[AsyncSession, Depends(get_db)]


# ── Credits ───────────────────────────────────────────────────────────────────

@router.get("/credits", response_model=AllCreditsOut)
async def get_credits(user: CurrentUser, db: DB):
    svc  = CreditService(db)
    data = await svc.get_all(user)

    def to_out(c) -> CreditOut:
        return CreditOut(
            feature=c.feature,
            used=c.used,
            total=c.total,
            remaining=c.remaining,
        )

    return AllCreditsOut(
        ai=to_out(data["ai"]),
        ats=to_out(data["ats"]),
        cover_letter=to_out(data["cover_letter"]),
    )


# ── Job search (Premium only) ─────────────────────────────────────────────────

@router.get("/jobs/{resume_id}", response_model=JobSearchResponse)
async def job_search(resume_id: str, user: PremiumUser, db: DB):
    """
    Premium only. Verifies the resume belongs to the user, then searches
    for matching jobs based on their skills and role.
    """
    resume = await Resume.get_by_id(db, resume_id)
    if not resume or resume.user_id != user.id:
        raise HTTPException(status_code=404, detail="Resume not found")

    jobs  = await search_jobs(resume.data)
    query = resume.data.get("domain") or "developer"

    return JobSearchResponse(jobs=jobs, query_used=query)