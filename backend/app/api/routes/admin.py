from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.db.session import get_db
from app.models.booking import Booking
from app.models.enums import BookingStatus, GuestType, ProofVerificationStatus
from app.models.payment import Payment
from app.models.payment_proof import PaymentProof
from app.schemas.admin_auth import AdminLoginRequest, AdminLoginResponse
from app.schemas.admin_bookings import (
    AdminApprovePaymentRequest,
    AdminBookingDetail,
    AdminBookingListItem,
    AdminRejectPaymentRequest,
    AdminPaymentProofSummary,
)
from app.schemas.admin_overview import AdminDashboardOverview
from app.services.admin_bookings import (
    approve_payment,
    get_booking_details,
    list_bookings,
    reject_payment,
)


router = APIRouter()

# Simple in-process cache for the dashboard overview.
_overview_cache: dict[str, object] = {"value": None, "expires_at": None}
_OVERVIEW_TTL_SECONDS = 60

# Note: environment variables from `.env` are read on process start.
# If you change `.env`, restart the server (reload doesn't watch `.env`).

@router.post("/login", response_model=AdminLoginResponse)
def admin_login(payload: AdminLoginRequest) -> AdminLoginResponse:
    if not settings.admin_password_hash:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin login is not configured. Set ADMIN_PASSWORD_HASH in the backend environment.",
        )

    if payload.username != settings.admin_username or not verify_password(payload.password, settings.admin_password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")

    token = create_access_token(subject=settings.admin_username)
    return AdminLoginResponse(access_token=token)


@router.get("/overview", response_model=AdminDashboardOverview)
def admin_overview(
    limit: int = Query(default=20, ge=1, le=200),
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminDashboardOverview:
    now = datetime.now(timezone.utc)
    cached_value = _overview_cache.get("value")
    cached_expires_at = _overview_cache.get("expires_at")
    if cached_value is not None and isinstance(cached_expires_at, datetime) and cached_expires_at > now:
        return cached_value  # type: ignore[return-value]

    # Minimize round-trips: compute counts + seats in one query.
    agg = db.execute(
        select(
            func.count(Booking.id).filter(Booking.status == BookingStatus.pending).label("pending_count"),
            func.count(Booking.id).filter(Booking.status == BookingStatus.confirmed).label("confirmed_count"),
            func.coalesce(func.sum(Booking.seats), 0).label("seats_booked"),
        )
    ).one()
    pending_count = agg.pending_count or 0
    confirmed_count = agg.confirmed_count or 0
    seats_booked = agg.seats_booked or 0

    # Raised so far: sum amounts for payments that have at least one VERIFIED proof.
    verified_payment_amounts = (
        select(Payment.id.label("payment_id"), Payment.amount.label("amount"), Payment.currency.label("currency"))
        .join(PaymentProof, PaymentProof.payment_id == Payment.id)
        .where(PaymentProof.verification_status == ProofVerificationStatus.verified)
        .distinct(Payment.id)
        .subquery()
    )
    amount_raised = db.execute(select(func.coalesce(func.sum(verified_payment_amounts.c.amount), 0))).scalar_one()
    if amount_raised is None:
        amount_raised = Decimal("0.00")

    latest = list_bookings(db=db, limit=limit, offset=0)
    latest_items = [AdminBookingListItem.model_validate(b) for b in latest]

    res = AdminDashboardOverview(
        pending_count=int(pending_count),
        confirmed_count=int(confirmed_count),
        seats_booked=int(seats_booked),
        amount_raised=Decimal(amount_raised),
        currency="USD",
        latest_bookings=latest_items,
    )

    _overview_cache["value"] = res
    _overview_cache["expires_at"] = now + timedelta(seconds=_OVERVIEW_TTL_SECONDS)
    return res


@router.get("/bookings", response_model=list[AdminBookingListItem])
def admin_list_bookings(
    status: BookingStatus | None = Query(default=None),
    guest_type: GuestType | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> list[AdminBookingListItem]:
    bookings = list_bookings(
        db=db,
        status_filter=status,
        guest_type_filter=guest_type,
        limit=limit,
        offset=offset,
    )
    return [AdminBookingListItem.model_validate(b) for b in bookings]


@router.get("/bookings/{reference}", response_model=AdminBookingDetail)
def admin_get_booking_details(reference: str, _: str = Depends(require_admin), db: Session = Depends(get_db)) -> AdminBookingDetail:
    booking = get_booking_details(db=db, reference=reference)
    return AdminBookingDetail.model_validate(booking)


@router.post("/payments/{payment_id}/approve", response_model=AdminPaymentProofSummary)
def admin_approve_payment(
    payment_id: uuid.UUID,
    payload: AdminApprovePaymentRequest,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminPaymentProofSummary:
    proof = approve_payment(db=db, payment_id=payment_id, admin_id=payload.admin_id)
    return AdminPaymentProofSummary.model_validate(proof)


@router.post("/payments/{payment_id}/reject", response_model=AdminPaymentProofSummary)
def admin_reject_payment(
    payment_id: uuid.UUID,
    payload: AdminRejectPaymentRequest,
    _: str = Depends(require_admin),
    db: Session = Depends(get_db),
) -> AdminPaymentProofSummary:
    proof = reject_payment(
        db=db,
        payment_id=payment_id,
        rejection_reason=payload.rejection_reason,
        admin_id=payload.admin_id,
    )
    return AdminPaymentProofSummary.model_validate(proof)

