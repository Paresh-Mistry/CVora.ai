from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.security import decode_token
from app.db.session import get_db
from app.model.user import User
from app.services.credit_services import CreditService
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.redis_client import is_blacklisted

bearer = HTTPBearer()


# Auth dependency
async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    payload = decode_token(credentials.credentials)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    if await is_blacklisted(credentials.credentials):
        raise HTTPException(401, "Token has been revoked")

    user = await User.get_by_id(db, payload["sub"])
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


# Plan guards 
def require_premium(user: CurrentUser):
    if user.plan != "premium":
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="This feature requires a premium plan",
        )
    return user


PremiumUser = Annotated[User, Depends(require_premium)]


# Credit guard factory 
def require_credit(feature: str):
    """
    Usage:
        @router.post("/ai-generate")
        async def endpoint(user: CurrentUser, _=Depends(require_credit("ai"))):
    """
    async def _check(
        user: CurrentUser,
        db: Annotated[AsyncSession, Depends(get_db)],
    ):
        svc = CreditService(db)
        ok = await svc.has_credit(user, feature)
        if not ok:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"No {feature} credits remaining",
            )
        return user

    return Depends(_check)