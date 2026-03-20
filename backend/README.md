## Backend (FastAPI)

### Tech
- FastAPI + Pydantic Settings (env config)
- SQLAlchemy (PostgreSQL)
- Local file storage for uploaded payment proofs (dev)

### Run locally

```bash
cp .env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Database (dev)

This backend uses **PostgreSQL** via SQLAlchemy. Supabase is also Postgres, so you can point `DATABASE_URL` at your Supabase project.

Your `.env.example` includes Supabase connection string templates. The key requirement is **SSL** (use `?sslmode=require`).

If you want to run locally without Supabase, your `.env` can be set to a local Postgres URL like:

- `DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/fundraising"`

If you don’t have local Postgres available, you can start it with Docker:

```bash
docker compose up -d
```

Otherwise (Supabase), set `DATABASE_URL` in `backend/.env` to the value from Supabase → Project Settings → Database (connection string), and ensure it includes `sslmode=require`.

### Migrations (Alembic)

This backend uses Alembic for schema migrations.

```bash
source .venv/bin/activate
pip install -r requirements.txt

# Apply migrations to your DATABASE_URL (Supabase / Postgres)
alembic upgrade head
```

If you cannot connect to Supabase from your current network (timeouts), you can run the initial schema SQL directly in Supabase:

- Open Supabase → SQL Editor
- Paste and run `supabase_init.sql`

### Notes
- For MVP we’ll use a simple **admin login** that issues a JWT access token.
- Payment gateways (Visa/EcoCash) will be integrated later via **webhooks** (TODOs are marked in code).

### Notifications (MVP)

Booking notifications are triggered from the backend service layer:
- when a guest submits a booking
- when admin approves payment and the booking becomes confirmed

Environment variables for Google SMTP email and optional Twilio SMS/WhatsApp are documented in `.env.example`.
Set `NOTIFICATIONS_ENABLED="true"` plus the channel-specific flags you want to use:
- `EMAIL_ENABLED`
- `SMS_ENABLED`
- `WHATSAPP_ENABLED`

For Gmail, use an App Password rather than your normal account password:
- `SMTP_HOST="smtp.gmail.com"`
- `SMTP_PORT="587"`
- `SMTP_USERNAME="your-gmail@gmail.com"`
- `SMTP_PASSWORD="<google-app-password>"`
- `SMTP_USE_TLS="true"`

