from __future__ import annotations

from decimal import Decimal

from app.schemas.base import ORMModel


class BookingImpactSummary(ORMModel):
    bookings_count: int
    seats_booked: int
    amount_raised: Decimal
    currency: str

