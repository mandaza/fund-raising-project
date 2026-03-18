from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)

    # Who/what this notification is about. Keep it flexible for MVP.
    guest_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("guests.id", ondelete="CASCADE"), nullable=True)
    booking_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("bookings.id", ondelete="CASCADE"), nullable=True)
    admin_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("admins.id", ondelete="CASCADE"), nullable=True)

    channel: Mapped[str] = mapped_column(String(30), default="system")  # system | email | sms | whatsapp
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(String(2000))

    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    guest = relationship("Guest", back_populates="notifications")
    booking = relationship("Booking", back_populates="notifications")
    admin = relationship("Admin", back_populates="notifications")

