from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import Field

from app.schemas.base import ORMModel


class AdminCreate(ORMModel):
    username: str = Field(min_length=1, max_length=150)
    password_hash: str = Field(min_length=1, max_length=255)
    is_active: bool = True


class AdminUpdate(ORMModel):
    username: str | None = Field(default=None, min_length=1, max_length=150)
    password_hash: str | None = Field(default=None, min_length=1, max_length=255)
    is_active: bool | None = None


class AdminRead(ORMModel):
    id: uuid.UUID
    username: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

