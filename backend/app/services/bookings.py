from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.enums import BookingStatus, GuestType
from app.models.guest import Guest
from app.schemas.guest import GuestCreate
from app.utils.booking_reference import generate_booking_reference


TABLE_SEATS = 10


def _get_or_create_guest(*, db: Session, guest_in: GuestCreate, guest_type: GuestType) -> Guest:
    guest: Guest | None = None
    if guest_in.email:
        guest = db.execute(select(Guest).where(Guest.email == str(guest_in.email))).scalar_one_or_none()

    if guest is None:
        guest = Guest(
            full_name=guest_in.full_name,
            email=str(guest_in.email) if guest_in.email else None,
            phone=guest_in.phone,
            guest_type=guest_type,
        )
        db.add(guest)
        db.flush()
        return guest

    # If a guest already exists, keep it up to date and ensure type matches the flow.
    guest.full_name = guest_in.full_name
    guest.phone = guest_in.phone
    guest.guest_type = guest_type
    return guest


def _generate_unique_reference(*, db: Session) -> str:
    for _ in range(20):
        ref = generate_booking_reference()
        exists = db.execute(select(Booking.id).where(Booking.reference == ref)).first()
        if not exists:
            return ref
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Could not generate a unique booking reference. Please try again.",
    )


def create_corporate_booking(*, db: Session, guest_in: GuestCreate, tables: int, notes: str | None = None) -> Booking:
    if tables < 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Corporate booking must have at least 1 table.",
        )

    guest = _get_or_create_guest(db=db, guest_in=guest_in, guest_type=GuestType.corporate)
    seats = tables * TABLE_SEATS
    reference = _generate_unique_reference(db=db)

    booking = Booking(
        guest_id=guest.id,
        reference=reference,
        status=BookingStatus.pending,
        seats=seats,
        notes=notes,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def create_individual_booking(*, db: Session, guest_in: GuestCreate, notes: str | None = None) -> Booking:
    guest = _get_or_create_guest(db=db, guest_in=guest_in, guest_type=GuestType.individual)
    reference = _generate_unique_reference(db=db)

    booking = Booking(
        guest_id=guest.id,
        reference=reference,
        status=BookingStatus.pending,
        seats=1,
        notes=notes,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def get_booking_by_reference(*, db: Session, reference: str) -> Booking:
    # Normalize: trim whitespace and convert to uppercase for case-insensitive lookup
    normalized_ref = reference.strip().upper()
    booking = db.execute(select(Booking).where(Booking.reference == normalized_ref)).scalar_one_or_none()
    if booking is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")
    return booking

