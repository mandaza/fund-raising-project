from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import Field

from app.models.enums import BookingStatus, GuestType, PaymentMethod, ProofVerificationStatus
from app.schemas.base import ORMModel


class AdminGuestSummary(ORMModel):
    id: uuid.UUID
    full_name: str
    email: str | None
    phone: str | None
    guest_type: GuestType


class AdminPaymentProofSummary(ORMModel):
    id: uuid.UUID
    file_path: str
    original_filename: str | None
    content_type: str | None
    verification_status: ProofVerificationStatus
    verified_by_admin_id: uuid.UUID | None
    verified_at: datetime | None
    rejection_reason: str | None
    created_at: datetime


class AdminPaymentSummary(ORMModel):
    id: uuid.UUID
    method: PaymentMethod
    amount: Decimal
    currency: str
    provider_reference: str | None
    paid_at: datetime | None
    created_at: datetime
    proofs: list[AdminPaymentProofSummary] = Field(default_factory=list)


class AdminBookingListItem(ORMModel):
    id: uuid.UUID
    reference: str
    status: BookingStatus
    seats: int
    notes: str | None
    created_at: datetime
    updated_at: datetime
    guest: AdminGuestSummary


class AdminBookingDetail(AdminBookingListItem):
    payments: list[AdminPaymentSummary] = Field(default_factory=list)


class AdminRejectPaymentRequest(ORMModel):
    rejection_reason: str = Field(min_length=1, max_length=500)
    admin_id: uuid.UUID | None = None


class AdminApprovePaymentRequest(ORMModel):
    admin_id: uuid.UUID | None = None

