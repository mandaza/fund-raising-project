from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import Field

from app.schemas.base import ORMModel


class NotificationCreate(ORMModel):
    guest_id: uuid.UUID | None = None
    booking_id: uuid.UUID | None = None
    admin_id: uuid.UUID | None = None

    channel: str = Field(default="system", max_length=30)
    title: str = Field(min_length=1, max_length=200)
    body: str = Field(min_length=1, max_length=2000)


class NotificationUpdate(ORMModel):
    is_read: bool | None = None
    read_at: datetime | None = None


class NotificationRead(ORMModel):
    id: uuid.UUID
    guest_id: uuid.UUID | None
    booking_id: uuid.UUID | None
    admin_id: uuid.UUID | None
    channel: str
    title: str
    body: str
    is_read: bool
    created_at: datetime
    read_at: datetime | None

