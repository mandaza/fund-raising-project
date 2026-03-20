from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session, joinedload, selectinload

from app.models.booking import Booking
from app.models.enums import BookingStatus, GuestType, ProofVerificationStatus
from app.models.payment import Payment
from app.models.payment_proof import PaymentProof
from app.services.notifications import send_booking_confirmed_notifications


def list_bookings(
    *,
    db: Session,
    status_filter: BookingStatus | None = None,
    guest_type_filter: GuestType | None = None,
    limit: int = 50,
    offset: int = 0,
) -> list[Booking]:
    limit = max(1, min(200, limit))
    offset = max(0, offset)

    stmt = select(Booking).options(joinedload(Booking.guest)).order_by(desc(Booking.created_at))
    if status_filter is not None:
        stmt = stmt.where(Booking.status == status_filter)
    if guest_type_filter is not None:
        stmt = stmt.where(Booking.guest.has(guest_type=guest_type_filter))

    stmt = stmt.limit(limit).offset(offset)
    return list(db.execute(stmt).scalars().all())


def get_booking_details(*, db: Session, reference: str) -> Booking:
    stmt = (
        select(Booking)
        .where(Booking.reference == reference)
        .options(
            joinedload(Booking.guest),
            selectinload(Booking.payments).selectinload(Payment.proofs),
        )
    )
    booking = db.execute(stmt).scalar_one_or_none()
    if booking is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")
    return booking


def _get_payment_or_404(*, db: Session, payment_id) -> Payment:
    payment = db.execute(select(Payment).where(Payment.id == payment_id)).scalar_one_or_none()
    if payment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found.")
    return payment


def _get_latest_pending_proof(*, db: Session, payment_id) -> PaymentProof:
    stmt = (
        select(PaymentProof)
        .where(PaymentProof.payment_id == payment_id, PaymentProof.verification_status == ProofVerificationStatus.pending)
        .order_by(desc(PaymentProof.created_at))
        .limit(1)
    )
    proof = db.execute(stmt).scalar_one_or_none()
    if proof is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No pending payment proof found for this payment.",
        )
    return proof


def approve_payment(*, db: Session, payment_id, admin_id=None) -> PaymentProof:
    payment = _get_payment_or_404(db=db, payment_id=payment_id)
    proof = _get_latest_pending_proof(db=db, payment_id=payment.id)

    proof.verification_status = ProofVerificationStatus.verified
    proof.verified_at = datetime.now(timezone.utc)
    proof.rejection_reason = None
    if admin_id is not None:
        proof.verified_by_admin_id = admin_id

    booking = payment.booking
    if booking is None:
        booking = db.execute(select(Booking).where(Booking.id == payment.booking_id)).scalar_one()
    booking.status = BookingStatus.confirmed

    db.commit()
    db.refresh(proof)
    send_booking_confirmed_notifications(db=db, booking=booking)
    return proof


def reject_payment(*, db: Session, payment_id, rejection_reason: str, admin_id=None) -> PaymentProof:
    payment = _get_payment_or_404(db=db, payment_id=payment_id)
    proof = _get_latest_pending_proof(db=db, payment_id=payment.id)

    proof.verification_status = ProofVerificationStatus.rejected
    proof.verified_at = datetime.now(timezone.utc)
    proof.rejection_reason = rejection_reason
    if admin_id is not None:
        proof.verified_by_admin_id = admin_id

    booking = payment.booking
    if booking is None:
        booking = db.execute(select(Booking).where(Booking.id == payment.booking_id)).scalar_one()
    booking.status = BookingStatus.pending

    db.commit()
    db.refresh(proof)
    return proof

