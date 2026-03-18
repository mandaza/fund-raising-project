from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import URL, make_url
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


def _normalize_database_url(raw: str) -> str | URL:
    """
    Supabase often provides `postgresql://...` URLs.
    SQLAlchemy treats that as the `psycopg2` dialect by default, but this project
    uses `psycopg` v3. Normalize to `postgresql+psycopg://...`.
    """
    url = make_url(raw)
    if url.get_backend_name() == "postgresql" and (url.get_driver_name() in (None, "", "psycopg2")):
        url = url.set(drivername="postgresql+psycopg")

    # Supabase requires SSL; if not provided, default to sslmode=require.
    host = (url.host or "").lower()
    query = dict(url.query)
    if "supabase.co" in host and "sslmode" not in query:
        query["sslmode"] = "require"
        url = url.set(query=query)

    return url


engine = create_engine(
    _normalize_database_url(settings.database_url),
    pool_pre_ping=True,
    connect_args={"connect_timeout": 10},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

