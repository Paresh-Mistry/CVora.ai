from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import CurrentUser
from app.db.session import get_db
from app.schema.schemas import AllCreditsOut, CreditOut
from app.services.credit_services import CreditService

router = APIRouter(tags=["user"])
DB = Annotated[AsyncSession, Depends(get_db)]


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
    )
