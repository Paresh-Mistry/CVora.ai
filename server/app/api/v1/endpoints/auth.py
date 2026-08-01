from typing import Annotated

from pydantic import EmailStr
from app.core.loggers import logger
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
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
from app.services.cloudinary_services import CloudinaryService


router = APIRouter(prefix="/auth", tags=["auth"])
DB = Annotated[AsyncSession, Depends(get_db)]


@router.get("/check")
def check():
    return {"status": "ok"}


# Register
@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(
    db: DB,
    email: EmailStr = Form(...),
    password: str = Form(..., min_length=8),
    full_name: str | None = Form(None),
    image: UploadFile | None = File(None),
):
    try:
        logger.info(
            f"Received: email={email!r}, password_len={len(password)}, full_name={full_name!r}, has_image={image is not None}"
        )
        existing = await User.get_by_email(db, email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        email = email.strip().lower()
        hashed_password = hash_password(password)

        logger.info(
            f"Cloudinary config: {settings.CLOUDINARY_CLOUD_NAME}, {settings.CLOUDINARY_API_KEY}, {settings.CLOUDINARY_API_SECRET}"
        )

        image_url = None
        if image:
            if image and image.filename:
                if image.content_type not in ("image/jpeg", "image/png", "image/webp"):
                    raise HTTPException(status_code=400, detail="Invalid image type")
                result = await CloudinaryService.upload_image(image)
                logger.info(f"Cloudinary upload result: {result}")
                image_url = result["url"]

        user = User(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            image=image_url,
            plan="free",
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

        await CreditService(db).ensure_credits(user)

        return TokenResponse(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error registering user: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


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
async def logout(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer())],
):
    payload = decode_token(credentials.credentials)
    if payload:
        jti = payload.get("jti") or credentials.credentials  # use token itself as key
        ttl = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        await blacklist_token(jti, ttl)
    return {"detail": "Logged out"}


# Current User (me)
@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser):
    logger.info(f"Current User in Session: {user.full_name}")
    return user
