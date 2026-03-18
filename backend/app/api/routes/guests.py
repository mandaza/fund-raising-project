from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.guest import GuestRead
from app.services.guests import list_guests


router = APIRouter()


@router.get("/", response_model=list[GuestRead])
def get_guests(db: Session = Depends(get_db)) -> list[GuestRead]:
    guests = list_guests(db=db)
    return [GuestRead.model_validate(g) for g in guests]

