from __future__ import annotations
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


# ─── Auth ─────────────────────────────────────────────────────────────────────


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserOut(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    plan: str
    is_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Resume data sub-schemas ──────────────────────────────────────────────────


class ExperienceItem(BaseModel):
    role: str = ""
    company: str = ""
    duration: str = ""
    description: str = ""


class ProjectItem(BaseModel):
    project_title: str = ""
    tech_stack: str = ""
    link: str = ""
    description: str = ""


class EducationItem(BaseModel):
    degree: str = ""
    institute: str = ""
    year: str = ""
    grade: str = ""


class AchievementItem(BaseModel):
    title: str = ""
    description: str = ""


class LanguageItem(BaseModel):
    language: str = ""
    proficiency: str = ""


class CertificationItem(BaseModel):
    title: str = ""
    issuer: str = ""
    date: str = ""
    url: str = ""


class ResumeData(BaseModel):
    name: str = ""
    email: str = ""
    domain: str = ""
    phone: str = ""
    github: str = ""
    linkedin: str = ""
    summary: str = ""
    skill: List[str] = []
    experience: List[ExperienceItem] = []
    projects: List[ProjectItem] = []
    education: List[EducationItem] = []
    achievements: List[AchievementItem] = []
    languages: List[LanguageItem] = []
    certifications: List[CertificationItem] = []
    insight: str = ""


# ─── Resume CRUD ──────────────────────────────────────────────────────────────


class ResumeCreateRequest(BaseModel):
    title: str = "My Resume"
    template_id: str = "classic"
    data: ResumeData


class ResumeUpdateRequest(BaseModel):
    title: Optional[str] = None
    template_id: Optional[str] = None
    data: Optional[ResumeData] = None


class ResumeOut(BaseModel):
    id: str
    user_id: str
    title: str
    template_id: str
    data: dict
    insight: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ─── AI ───────────────────────────────────────────────────────────────────────


class AIGenerateRequest(BaseModel):
    resume_id: str
    prompt: Optional[str] = None  # freeform, or None → auto-generate from resume


class AIGenerateResponse(BaseModel):
    insight: str
    credits_remaining: int


class ATSRequest(BaseModel):
    resume_id: str
    job_description: Optional[str] = None


class ATSResponse(BaseModel):
    score: int  # 0–100
    missing_keywords: List[str]
    suggestions: List[str]
    credits_remaining: int


# ─── Templates ────────────────────────────────────────────────────────────────


class TemplateOut(BaseModel):
    id: str
    name: str
    description: str
    layout: str  # "A" | "B" | "C" — frontend uses this to pick the layout component
    is_premium: bool
    preview_bg: str
    preview_url: Optional[str]
    tokens: dict
    sections: dict

    model_config = {"from_attributes": True}


# ─── Credits ──────────────────────────────────────────────────────────────────


class CreditOut(BaseModel):
    feature: str
    used: int
    total: int
    remaining: int

    model_config = {"from_attributes": True}


class AllCreditsOut(BaseModel):
    ai: CreditOut
    ats: CreditOut


# ─── Jobs ─────────────────────────────────────────────────────────────────────


class JobResult(BaseModel):
    title: str
    company: str
    location: str
    url: str
    posted_at: Optional[str]
    match_score: Optional[int]  # 0–100 relevance vs resume


class JobSearchResponse(BaseModel):
    jobs: List[JobResult]
    query_used: str
