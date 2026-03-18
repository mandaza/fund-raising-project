from __future__ import annotations

from enum import Enum


class GuestType(str, Enum):
    individual = "individual"
    corporate = "corporate"
    sponsor = "sponsor"
    vip = "vip"


class BookingStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"


class PaymentMethod(str, Enum):
    cash = "cash"
    bank_transfer = "bank_transfer"
    ecocash = "ecocash"
    visa = "visa"
    other = "other"


class ProofVerificationStatus(str, Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"

