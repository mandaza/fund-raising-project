from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import Field

from app.models.enums import PaymentMethod
from app.schemas.base import ORMModel


class PaymentCreate(ORMModel):
    booking_id: uuid.UUID
    method: PaymentMethod
    amount: Decimal = Field(gt=0)
    currency: str = Field(default="USD", min_length=3, max_length=3)
    provider_reference: str | None = Field(default=None, max_length=100)
    paid_at: datetime | None = None
    notes: str | None = Field(default=None, max_length=500)


class PaymentUpdate(ORMModel):
    method: PaymentMethod | None = None
    amount: Decimal | None = Field(default=None, gt=0)
    currency: str | None = Field(default=None, min_length=3, max_length=3)
    provider_reference: str | None = Field(default=None, max_length=100)
    paid_at: datetime | None = None
    notes: str | None = Field(default=None, max_length=500)


class PaymentRead(ORMModel):
    id: uuid.UUID
    booking_id: uuid.UUID
    method: PaymentMethod
    amount: Decimal
    currency: str
    provider_reference: str | None
    paid_at: datetime | None
    notes: str | None
    created_at: datetime

