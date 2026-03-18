from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.booking import Booking
from app.models.enums import BookingStatus, PaymentMethod, ProofVerificationStatus
from app.models.payment import Payment
from app.models.payment_proof import PaymentProof
from app.storage.local import save_upload_file_local, validate_upload


def upload_payment_proof_for_booking(
    *,
    db: Session,
    booking_reference: str,
    file: UploadFile,
    method: PaymentMethod,
    amount: Decimal,
    currency: str = "USD",
    provider_reference: str | None = None,
) -> PaymentProof:
    if amount <= 0:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Amount must be greater than 0.")

    currency = currency.upper().strip()
    if len(currency) != 3:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Currency must be a 3-letter code.")

    booking = db.execute(select(Booking).where(Booking.reference == booking_reference)).scalar_one_or_none()
    if booking is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    if booking.status == BookingStatus.cancelled:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Cannot upload proof for a cancelled booking.")

    ext = validate_upload(file=file)
    max_bytes = int(1024 * 1024 * max(1, settings.max_upload_mb))

    rel_path = save_upload_file_local(
        file=file,
        subdir=f"payment_proofs/{booking.reference}",
        ext=ext,
        max_bytes=max_bytes,
    )

    payment = Payment(
        booking_id=booking.id,
        method=method,
        amount=amount,
        currency=currency,
        provider_reference=provider_reference,
        paid_at=datetime.now(timezone.utc),
    )
    db.add(payment)
    db.flush()

    proof = PaymentProof(
        payment_id=payment.id,
        file_path=rel_path,
        original_filename=file.filename,
        content_type=file.content_type,
        verification_status=ProofVerificationStatus.pending,
    )
    db.add(proof)
    # Booking stays pending until an admin verifies the proof.
    booking.status = BookingStatus.pending

    db.commit()
    db.refresh(proof)
    return proof

