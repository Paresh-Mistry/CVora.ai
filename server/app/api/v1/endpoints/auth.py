from typing import Annotated
from app.core.loggers import logger
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.core.dependencies import CurrentUser
from app.db.session import get_db
from app.model.user import User
from app.schema.schemas import (
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserOut,
)
from app.services.credit_services import CreditService
from app.db.redis_client import blacklist_token 
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings


router = APIRouter(prefix="/auth", tags=["auth"])
DB = Annotated[AsyncSession, Depends(get_db)]


# Register 
@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(body: RegisterRequest, db: DB):

    try:
        existing = await User.get_by_email(db, body.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        logger.info(body.password)
        logger.info(type(body.password))
        logger.info(len(body.password))

        hashed_password = hash_password(body.password)

        logger.info(f"Hashed Password: {hash_password(body.password)}")

        user = User(
            email=body.email,
            hashed_password=hashed_password,
            full_name=body.full_name,
            plan="free",
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        # Seed credits for all features
        await CreditService(db).ensure_credits(user)

        return TokenResponse(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )

    except Exception as e:
        logger.exception(f"Error : [{str(e)}]")
        HTTPException(status_code=404, detail="Error : {}".format(str(e)))



# Login 
@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: DB):
    user = await User.get_by_email(db, body.email)
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


# Refresh token
@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshRequest, db: DB):
    payload = decode_token(body.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = await User.get_by_id(db, payload["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


# logout 
@router.post("/logout")
async def logout(credentials: Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer())]):
    payload = decode_token(credentials.credentials)
    if payload:
        jti = payload.get("jti") or credentials.credentials   # use token itself as key
        ttl = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        await blacklist_token(jti, ttl)
    return {"detail": "Logged out"}


# Current User (me)
@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser):
    logger.info(f"Current User in Session: {user.full_name}")
    return user