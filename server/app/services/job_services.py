import httpx
from app.core.config import settings
from ..schema.schemas import JobResult


JSEARCH_URL = "https://jsearch.p.rapidapi.com/search"


async def search_jobs(resume_data: dict) -> list[JobResult]:
    """
    Build a search query from the resume and fetch matching jobs via JSearch.
    Returns up to 10 results with a basic keyword match score.
    """
    # Build query from name + top skills
    role  = resume_data.get("domain") or resume_data.get("role") or "developer"
    skills = [s for s in (resume_data.get("skill") or []) if s][:3]
    query  = f"{role} {' '.join(skills)}".strip()

    headers = {
        "X-RapidAPI-Key": settings.JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    }
    params = {"query": query, "page": "1", "num_pages": "1"}

    async with httpx.AsyncClient(timeout=10) as http:
        resp = await http.get(JSEARCH_URL, headers=headers, params=params)
        resp.raise_for_status()
        raw = resp.json().get("data", [])

    resume_keywords = set(
        w.lower()
        for s in skills
        for w in s.split()
    )

    jobs: list[JobResult] = []
    for item in raw[:10]:
        title       = item.get("job_title", "")
        description = (item.get("job_description") or "").lower()

        # Simple keyword overlap score
        matched = sum(1 for kw in resume_keywords if kw in description)
        score   = min(100, int((matched / max(len(resume_keywords), 1)) * 100))

        jobs.append(JobResult(
            title       = title,
            company     = item.get("employer_name", ""),
            location    = item.get("job_city") or item.get("job_country") or "Remote",
            url         = item.get("job_apply_link") or item.get("job_google_link") or "",
            posted_at   = item.get("job_posted_at_datetime_utc"),
            match_score = score,
        ))

    # Sort by match score descending
    jobs.sort(key=lambda j: j.match_score or 0, reverse=True)
    return jobs