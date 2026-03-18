from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import Field

from app.models.enums import BookingStatus
from app.schemas.base import ORMModel
from app.schemas.guest import GuestCreate


class BookingCreate(ORMModel):
    guest_id: uuid.UUID
    reference: str | None = Field(default=None, max_length=32)
    seats: int = Field(default=1, ge=1, le=100)
    notes: str | None = Field(default=None, max_length=500)
    status: BookingStatus | None = None


class BookingUpdate(ORMModel):
    reference: str | None = Field(default=None, max_length=32)
    seats: int | None = Field(default=None, ge=1, le=100)
    notes: str | None = Field(default=None, max_length=500)
    status: BookingStatus | None = None


class BookingRead(ORMModel):
    id: uuid.UUID
    guest_id: uuid.UUID
    reference: str
    status: BookingStatus
    seats: int
    notes: str | None
    created_at: datetime
    updated_at: datetime


class CorporateBookingCreateRequest(ORMModel):
    guest: GuestCreate
    tables: int = Field(ge=1, le=500)
    notes: str | None = Field(default=None, max_length=500)


class IndividualBookingCreateRequest(ORMModel):
    guest: GuestCreate
    notes: str | None = Field(default=None, max_length=500)

