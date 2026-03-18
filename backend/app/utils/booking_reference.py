from __future__ import annotations

import secrets
import string


_ALPHABET = string.ascii_uppercase + string.digits


def generate_booking_reference(*, prefix: str = "FR", length: int = 10) -> str:
    """
    Generate a human-friendly booking reference.
    Example: FR-1A2B3C4D5E
    """
    if length < 6:
        raise ValueError("length must be >= 6")
    token = "".join(secrets.choice(_ALPHABET) for _ in range(length))
    return f"{prefix}-{token}"

