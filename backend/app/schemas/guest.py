from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import EmailStr, Field

from app.models.enums import GuestType
from app.schemas.base import ORMModel


class GuestCreate(ORMModel):
    full_name: str = Field(min_length=1, max_length=200)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=50)
    guest_type: GuestType = GuestType.individual


class GuestUpdate(ORMModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=200)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=50)
    guest_type: GuestType | None = None


class GuestRead(ORMModel):
    id: uuid.UUID
    full_name: str
    email: EmailStr | None
    phone: str | None
    guest_type: GuestType
    created_at: datetime
    updated_at: datetime

