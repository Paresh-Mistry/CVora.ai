# CVora.Ai

> AI-powered resume builder with ATS scoring, cover letter generation, and tiered free/premium plans.

CVora.Ai lets users build resumes through a multi-step guided form, preview them live across multiple customizable templates, and improve them using AI — all wrapped in a credit-based free/premium system.

---

## ✨ Features

| Feature | Free Tier | Premium Tier |
|---|---|---|
| Resume templates | 2 templates | 8 templates (6 premium-locked) |
| AI content generation | 2 credits | 150 credits |
| ATS compatibility scoring | 1 credit | Unlimited |
| Cover letter generation | 1 credit | Unlimited |
| PDF export | ✅ Unlimited | ✅ Unlimited |
| Job match search | ❌ | ✅ |

- **Multi-step resume builder** — Personal info, Summary, Experience, Education, Skills, Projects, Achievements, Languages, Certifications
- **Live preview** — Instant rendering across themed templates with token-driven styling (fonts, colors, layout, dividers)
- **AI resume insights** — Context-aware suggestions powered by OpenAI
- **ATS scoring** — Keyword gap analysis against a pasted job description
- **AI cover letter generation** — Tailored to job title, company, and resume content
- **PDF export** — Client-side multi-page A4 export via `html-to-image` + `jsPDF`
- **JWT authentication** — Access/refresh token rotation with Redis-backed logout revocation
- **Credit system** — Idempotent, race-condition-safe credit ledger per feature, per user

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           CLIENT (React)                        │
│                                                                   │
│  ┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐ │
│  │  FormContext  │──▶│   Editing Page   │──▶│ ResumeRightPanel │ │
│  │  (form state) │   │  (step wizard)   │   │  (tabs: preview, │ │
│  └──────────────┘   └──────────────────┘   │  templates, AI,  │ │
│                                              │  score, export)  │ │
│                                              └──────────────────┘ │
│                                                                   │
│  TanStack Query hooks: useAuth · useResume · useAI · useCredits  │
└───────────────────────────┬───────────────────────────────────────┘
                            │ REST (JSON over HTTPS)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER (FastAPI)                         │
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │    auth    │  │   resume   │  │     ai     │  │  templates │ │
│  │  endpoint  │  │  endpoint  │  │  endpoint  │  │  endpoint  │ │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘ │
│        │               │               │               │        │
│  ┌─────▼───────────────▼───────────────▼───────────────▼──────┐ │
│  │                     Service Layer                           │ │
│  │   credit_service · ai_service · job_service · pdf_service   │ │
│  └─────┬─────────────────────────────────────────┬─────────────┘ │
│        │                                         │               │
└────────┼─────────────────────────────────────────┼───────────────┘
         ▼                                         ▼
┌──────────────────────┐                 ┌──────────────────────┐
│     PostgreSQL        │                 │        Redis         │
│  ─────────────────    │                 │  ─────────────────   │
│  • users               │                 │  • token blacklist   │
│  • resumes (JSONB)     │                 │  • template cache    │
│  • credits             │                 │  • rate limiting     │
│  • templates           │                 │                      │
└──────────────────────┘                 └──────────────────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │     OpenAI API        │
                 │  ─────────────────    │
                 │  • resume insights     │
                 │  • ATS scoring          │
                 │  • cover letters        │
                 └──────────────────────┘
```

### Why these choices

- **PostgreSQL JSONB for resume data** — resume content has no fixed schema (variable experience entries, skills, projects), so JSONB avoids constant migrations while still being queryable.
- **Redis for short-lived state only** — token blacklist (logout), rate limiting, and template caching. Not used for resume data, which needs durability.
- **Credit ledger via `ON CONFLICT DO UPDATE`** — prevents race conditions where two rapid requests could both pass a credit check before either decrements.
- **JWT with refresh rotation** — access tokens expire in 30 min; refresh tokens (30 days) rotate on use and can be revoked via Redis blacklist on logout.

---

## 🧰 Tech Stack

**Frontend**
React · TypeScript · TanStack Query · Tailwind CSS · Framer Motion · Axios

**Backend**
FastAPI · Python · SQLAlchemy (async) · Pydantic · PyJWT · Alembic

**Database & Infra**
PostgreSQL (JSONB) · Redis · Docker · OpenAI API

**Export**
WeasyPrint (server-side PDF) · html-to-image + jsPDF (client-side PDF)

---

## 📁 Project Structure

```
CVora.Ai/
├── server/                      # FastAPI backend
│   ├── app/
│   │   ├── main.py              # App entrypoint
│   │   ├── api/v1/endpoints/    # auth, resume, ai, export, templates, user
│   │   ├── core/                # config, security, dependencies
│   │   ├── db/                  # session, redis_client
│   │   ├── models/               # SQLAlchemy models
│   │   ├── schemas/              # Pydantic schemas
│   │   └── services/             # ai_service, credit_service, job_service, pdf_service
│   ├── alembic/                  # DB migrations
│   ├── requirements.txt
│   └── Dockerfile
│
└── client/                       # React frontend
    └── src/
        ├── api/                  # axios instance, API functions, query keys
        ├── hooks/                # useAuth, useResume, useAI
        ├── context/              # FormContext
        ├── components/           # FormFillStep, ResumeRightPanel, etc.
        └── templates/            # LayoutStack, LayoutSidebar, LayoutBanner, etc.
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.12
- Node.js 18+
- Docker & Docker Compose (recommended)
- OpenAI API key

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/CVora.Ai.git
cd CVora.Ai
```

### 2. Backend setup

```bash
cd server
cp .env.example .env
# fill in DATABASE_URL, REDIS_URL, SECRET_KEY, OPENAI_API_KEY
```

**Option A — with Poetry**
```bash
poetry install
poetry run alembic upgrade head
poetry run uvicorn app.main:app --reload
```

**Option B — with pip**
```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000` — API docs at `http://localhost:8000/docs`.

### 3. Frontend setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## 🐳 Running with Docker

The backend ships with a `docker-compose.yml` that spins up PostgreSQL, Redis, and the API together.

```bash
cd server
cp .env.example .env
docker compose up --build
```

This starts:

| Service | Port | Description |
|---|---|---|
| `app` | `8000` | FastAPI backend |
| `db` | `5432` | PostgreSQL 16 |
| `redis` | `6379` | Redis 7 |

Run migrations inside the container after first startup:

```bash
docker compose exec app alembic upgrade head
```

Stop everything:

```bash
docker compose down
```

Stop and wipe volumes (fresh DB):

```bash
docker compose down -v
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL async connection string |
| `REDIS_URL` | Redis connection string |
| `SECRET_KEY` | JWT signing secret |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime (default: 30) |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token lifetime (default: 30) |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `OPENAI_MODEL` | Model used for free-tier AI calls |
| `OPENAI_MODEL_PREMIUM` | Model used for premium-tier AI calls |
| `FREE_AI_CREDITS` | Free AI generation credits (default: 2) |
| `PREMIUM_AI_CREDITS` | Premium AI generation credits (default: 150) |
| `FREE_ATS_CREDITS` | Free ATS check credits (default: 1) |
| `FREE_COVER_LETTER_CREDITS` | Free cover letter credits (default: 1) |
| `JSEARCH_API_KEY` | RapidAPI JSearch key for job matching (premium) |
| `ALLOWED_ORIGINS` | CORS allowed origins (JSON array) |

See `.env.example` for a full template.

---

## 🧪 Testing the API

Once running, open `http://localhost:8000/docs` for interactive Swagger UI, or use curl:

```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# List templates (use access_token from login response)
curl http://localhost:8000/api/v1/templates/ \
  -H "Authorization: Bearer <access_token>"
```

---

## 📄 License

MIT — feel free to use this as a reference for your own projects.
