import json
from openai import AsyncOpenAI

from app.core.config import settings
from app.schema.schemas import ResumeData

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


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
            lines.append(f"Experience: {exp.role} at {exp.company} ({exp.duration}) — {exp.description}")
    for edu in data.education:
        if edu.degree:
            lines.append(f"Education: {edu.degree}, {edu.institute} {edu.year}")
    for proj in data.projects:
        if proj.project_title:
            lines.append(f"Project: {proj.project_title} ({proj.tech_stack}) — {proj.description}")
    for ach in data.achievements:
        if ach.title:
            lines.append(f"Achievement: {ach.title} — {ach.description}")
    return "\n".join(lines)


# ── AI insight / resume improvement ──────────────────────────────────────────

async def generate_insight(data: dict, custom_prompt: str | None, is_premium: bool) -> str:
    resume_text = _resume_text(data)
    model = settings.OPENAI_MODEL_PREMIUM if is_premium else settings.OPENAI_MODEL

    system = (
        "You are an expert resume coach. Analyse the resume and provide concise, "
        "actionable feedback. Focus on impact, clarity, and ATS optimisation. "
        "Respond in 3–5 bullet points, plain text."
    )
    user_msg = custom_prompt or (
        f"Review this resume and give specific, actionable improvement suggestions:\n\n{resume_text}"
    )

    resp = await client.chat.completions.create(
        model=model,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user_msg}],
        max_tokens=600,
        temperature=0.5,
    )
    return resp.choices[0].message.content.strip()


# ── ATS scorer ────────────────────────────────────────────────────────────────

async def score_ats(data: dict, job_description: str | None) -> dict:
    resume_text = _resume_text(data)

    jd_block = f"\nJob Description:\n{job_description}" if job_description else ""

    prompt = (
        f"Analyse this resume for ATS (Applicant Tracking System) compatibility.{jd_block}\n\n"
        f"Resume:\n{resume_text}\n\n"
        "Return a JSON object with exactly these keys:\n"
        '{ "score": <int 0-100>, "missing_keywords": [<str>], "suggestions": [<str>] }\n'
        "No markdown, no explanation — only the JSON object."
    )

    resp = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600,
        temperature=0.2,
    )
    raw = resp.choices[0].message.content.strip()
    # Strip possible ```json fences
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)


# ── Cover letter ──────────────────────────────────────────────────────────────

async def generate_cover_letter(
    data: dict,
    job_title: str,
    company_name: str,
    job_description: str | None,
) -> str:
    resume_text = _resume_text(data)
    jd_block = f"\nJob Description:\n{job_description}" if job_description else ""

    prompt = (
        f"Write a professional cover letter for {data.get('name', 'the applicant')} "
        f"applying for {job_title} at {company_name}.{jd_block}\n\n"
        f"Resume summary:\n{resume_text}\n\n"
        "Keep it to 3 short paragraphs. Tone: confident, concise, professional."
    )

    resp = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=700,
        temperature=0.6,
    )
    return resp.choices[0].message.content.strip()