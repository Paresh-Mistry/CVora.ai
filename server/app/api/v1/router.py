from fastapi import APIRouter

from app.api.v1.endpoints import auth, resume, ai, templates, user

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(resume.router)
api_router.include_router(ai.router)
api_router.include_router(templates.router)
api_router.include_router(user.router)