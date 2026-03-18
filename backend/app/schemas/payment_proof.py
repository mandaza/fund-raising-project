from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import Field

from app.models.enums import ProofVerificationStatus
from app.schemas.base import ORMModel


class PaymentProofCreate(ORMModel):
    payment_id: uuid.UUID
    file_path: str = Field(min_length=1, max_length=500)
    original_filename: str | None = Field(default=None, max_length=255)
    content_type: str | None = Field(default=None, max_length=100)


class PaymentProofVerify(ORMModel):
    verification_status: ProofVerificationStatus
    verified_by_admin_id: uuid.UUID | None = None
    verified_at: datetime | None = None
    rejection_reason: str | None = Field(default=None, max_length=500)


class PaymentProofRead(ORMModel):
    id: uuid.UUID
    payment_id: uuid.UUID
    file_path: str
    original_filename: str | None
    content_type: str | None
    verification_status: ProofVerificationStatus
    verified_by_admin_id: uuid.UUID | None
    verified_at: datetime | None
    rejection_reason: str | None
    created_at: datetime

