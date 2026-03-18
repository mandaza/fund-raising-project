from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.guest import Guest


def list_guests(*, db: Session) -> list[Guest]:
    stmt = select(Guest).order_by(Guest.created_at.desc())
    return list(db.execute(stmt).scalars().all())

