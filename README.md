## Dinner Fundraising Platform (MVP)

Two-app architecture:

- **`frontend/`**: Next.js 14+ (App Router), TypeScript, Tailwind, shadcn/ui
- **`backend/`**: FastAPI (Python), PostgreSQL, local file storage (dev)

This repo is intentionally structured like production: clear module boundaries, env-driven config, and a service layer so we can grow from MVP to payment webhooks + cloud storage without rewrites.

### Folder structure (high level)

```text
fund-raising/
  backend/
  frontend/
```

### Quick start (backend)

1. Create a virtualenv and install deps:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Run the API:

```bash
uvicorn app.main:app --reload --port 8000
```

4. Open docs:
- Swagger: `http://localhost:8000/docs`
- Health: `http://localhost:8000/health`

