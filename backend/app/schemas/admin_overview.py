from __future__ import annotations

from decimal import Decimal

from pydantic import Field

from app.schemas.admin_bookings import AdminBookingListItem
from app.schemas.base import ORMModel


class AdminDashboardOverview(ORMModel):
    pending_count: int
    confirmed_count: int
    seats_booked: int
    amount_raised: Decimal
    currency: str = "USD"
    latest_bookings: list[AdminBookingListItem] = Field(default_factory=list)

