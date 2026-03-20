from __future__ import annotations

from decimal import Decimal

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.booking import Booking
from app.models.enums import PaymentMethod, ProofVerificationStatus
from app.models.payment import Payment
from app.models.payment_proof import PaymentProof
from app.schemas.booking import (
    BookingRead,
    CorporateBookingCreateRequest,
    IndividualBookingCreateRequest,
)
from app.schemas.payment_proof import PaymentProofRead
from app.schemas.public_summary import BookingImpactSummary
from app.services.bookings import create_corporate_booking, create_individual_booking, get_booking_by_reference
from app.services.notifications import send_booking_created_notifications_by_id
from app.services.payment_proofs import upload_payment_proof_for_booking


router = APIRouter()


@router.get("/summary", response_model=BookingImpactSummary)
def booking_impact_summary(db: Session = Depends(get_db)) -> BookingImpactSummary:
    bookings_count = db.execute(select(func.count(Booking.id))).scalar_one() or 0
    seats_booked = db.execute(select(func.coalesce(func.sum(Booking.seats), 0))).scalar_one() or 0

    # Count only payments with at least one VERIFIED proof as "raised".
    amount_raised = (
        db.execute(
            select(func.coalesce(func.sum(func.distinct(Payment.amount)), 0))
            .select_from(Payment)
            .join(PaymentProof, PaymentProof.payment_id == Payment.id)
            .where(PaymentProof.verification_status == ProofVerificationStatus.verified)
        ).scalar_one()
        or Decimal("0.00")
    )

    return BookingImpactSummary(
        bookings_count=int(bookings_count),
        seats_booked=int(seats_booked),
        amount_raised=Decimal(amount_raised),
        currency="USD",
    )


@router.post("/corporate", response_model=BookingRead)
def create_corporate_booking_route(
    payload: CorporateBookingCreateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> BookingRead:
    booking = create_corporate_booking(
        db=db,
        guest_in=payload.guest,
        tables=payload.tables,
        notes=payload.notes,
    )
    background_tasks.add_task(send_booking_created_notifications_by_id, booking_id=booking.id)
    return BookingRead.model_validate(booking)


@router.post("/individual", response_model=BookingRead)
def create_individual_booking_route(
    payload: IndividualBookingCreateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> BookingRead:
    booking = create_individual_booking(
        db=db,
        guest_in=payload.guest,
        notes=payload.notes,
    )
    background_tasks.add_task(send_booking_created_notifications_by_id, booking_id=booking.id)
    return BookingRead.model_validate(booking)


@router.get("/{reference}", response_model=BookingRead)
def get_booking_by_reference_route(reference: str, db: Session = Depends(get_db)) -> BookingRead:
    booking = get_booking_by_reference(db=db, reference=reference)
    return BookingRead.model_validate(booking)


@router.post("/{reference}/payment-proofs", response_model=PaymentProofRead)
def upload_payment_proof_route(
    reference: str,
    file: UploadFile = File(...),
    method: PaymentMethod = Form(...),
    amount: Decimal = Form(...),
    currency: str = Form("USD"),
    provider_reference: str | None = Form(None),
    db: Session = Depends(get_db),
) -> PaymentProofRead:
    proof = upload_payment_proof_for_booking(
        db=db,
        booking_reference=reference,
        file=file,
        method=method,
        amount=amount,
        currency=currency,
        provider_reference=provider_reference,
    )
    return PaymentProofRead.model_validate(proof)

