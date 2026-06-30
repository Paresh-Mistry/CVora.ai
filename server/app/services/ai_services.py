import json
from google import genai

from app.core.config import settings
from app.schema.schemas import ResumeData

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def _resume_text(data: ResumeData | dict) -> str:
    """Convert resume dict to a compact plain-text block for the AI prompt."""
    if isinstance(data, dict):
        data = ResumeData(**data)

    lines = [
        f"Name: {data.name}",
        f"Title: {data.domain}",
        f"Summary: {data.summary}",
        "Skills: " + ", ".join(s for s in data.skill if s),
    ]

    for exp in data.experience:
        if exp.role:
            lines.append(
                f"Experience: {exp.role} at {exp.company} ({exp.duration}) — {exp.description}"
            )

    for edu in data.education:
        if edu.degree:
            lines.append(
                f"Education: {edu.degree}, {edu.institute} {edu.year}"
            )

    for proj in data.projects:
        if proj.project_title:
            lines.append(
                f"Project: {proj.project_title} ({proj.tech_stack}) — {proj.description}"
            )

    for ach in data.achievements:
        if ach.title:
            lines.append(
                f"Achievement: {ach.title} — {ach.description}"
            )

    return "\n".join(lines)


async def generate_insight(
    data: dict,
    custom_prompt: str | None,
    is_premium: bool,
) -> str:
    resume_text = _resume_text(data)

    model = (
        settings.GEMINI_MODEL_PREMIUM
        if is_premium
        else settings.GEMINI_MODEL
    )

    system_prompt = (
        "You are an expert resume coach. Analyze the resume and provide concise, "
        "actionable feedback. Focus on impact, clarity, ATS optimization, grammar, "
        "professional wording, measurable achievements, and missing information. "
        "Respond with 3-5 bullet points in plain text."
    )

    user_prompt = custom_prompt or (
        f"Review this resume and give specific, actionable improvement suggestions:\n\n"
        f"{resume_text}"
    )

    response = client.models.generate_content(
        model=model,
        contents=f"{system_prompt}\n\n{user_prompt}",
    )

    return response.text.strip()


async def score_ats(
    data: dict,
    job_description: str | None,
) -> dict:
    resume_text = _resume_text(data)

    jd_block = (
        f"\nJob Description:\n{job_description}"
        if job_description
        else ""
    )

    prompt = (
        f"Analyse this resume for ATS (Applicant Tracking System) compatibility.{jd_block}\n\n"
        f"Resume:\n{resume_text}\n\n"
        "Return a JSON object with exactly these keys:\n"
        '{'
        '"score": <int 0-100>,'
        '"missing_keywords": [<str>],'
        '"suggestions": [<str>]'
        '}\n'
        "Return ONLY valid JSON. No markdown. No explanation."
    )

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
    )

    raw = response.text.strip()

    raw = raw.replace("```json", "").replace("```", "").strip()

    return json.loads(raw)    