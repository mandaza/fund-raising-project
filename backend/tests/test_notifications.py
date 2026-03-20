from __future__ import annotations

import unittest
import uuid
from unittest.mock import patch

from app.core.config import settings
from app.models.booking import Booking
from app.models.enums import BookingStatus, GuestType
from app.models.guest import Guest
from app.models.notification import Notification
from app.services.notifications import (
    _deliver_admin_booking_alert,
    _deliver_guest_booking_received,
    _whatsapp_address,
)


def _build_booking(*, email: str | None, phone: str | None) -> Booking:
    guest = Guest(
        id=uuid.uuid4(),
        full_name="Jane Guest",
        email=email,
        phone=phone,
        guest_type=GuestType.individual,
    )
    booking = Booking(
        id=uuid.uuid4(),
        guest_id=guest.id,
        reference="BOOK123",
        status=BookingStatus.pending,
        seats=2,
        notes=None,
    )
    booking.guest = guest
    return booking


class NotificationServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        self.original_admin_emails = settings.admin_notification_emails
        self.original_admin_phones = settings.admin_notification_phones
        self.original_admin_whatsapp_numbers = settings.admin_notification_whatsapp_numbers

    def tearDown(self) -> None:
        settings.admin_notification_emails = self.original_admin_emails
        settings.admin_notification_phones = self.original_admin_phones
        settings.admin_notification_whatsapp_numbers = self.original_admin_whatsapp_numbers

    @patch("app.services.notifications._send_whatsapp_notifications")
    @patch("app.services.notifications._send_sms_notifications")
    @patch("app.services.notifications._send_email_notifications")
    def test_guest_booking_received_uses_all_available_channels(
        self,
        mock_email,
        mock_sms,
        mock_whatsapp,
    ) -> None:
        booking = _build_booking(email="guest@example.com", phone="+263771234567")
        mock_email.return_value = [Notification(channel="email", title="email", body="body")]
        mock_sms.return_value = [Notification(channel="sms", title="sms", body="body")]
        mock_whatsapp.return_value = [Notification(channel="whatsapp", title="wa", body="body")]

        notifications = _deliver_guest_booking_received(booking=booking)

        self.assertEqual(len(notifications), 3)
        mock_email.assert_called_once()
        mock_sms.assert_called_once()
        mock_whatsapp.assert_called_once()

    @patch("app.services.notifications._send_whatsapp_notifications")
    @patch("app.services.notifications._send_sms_notifications")
    @patch("app.services.notifications._send_email_notifications")
    def test_admin_booking_alert_uses_configured_recipient_lists(
        self,
        mock_email,
        mock_sms,
        mock_whatsapp,
    ) -> None:
        settings.admin_notification_emails = "ops@example.com,finance@example.com"
        settings.admin_notification_phones = "+263771234567"
        settings.admin_notification_whatsapp_numbers = "+263778765432"

        booking = _build_booking(email="guest@example.com", phone="+263771234567")
        mock_email.return_value = [Notification(channel="email", title="email", body="body")]
        mock_sms.return_value = [Notification(channel="sms", title="sms", body="body")]
        mock_whatsapp.return_value = [Notification(channel="whatsapp", title="wa", body="body")]

        notifications = _deliver_admin_booking_alert(booking=booking)

        self.assertEqual(len(notifications), 3)
        self.assertEqual(
            mock_email.call_args.kwargs["recipients"],
            ["ops@example.com", "finance@example.com"],
        )
        self.assertEqual(mock_sms.call_args.kwargs["recipients"], ["+263771234567"])
        self.assertEqual(mock_whatsapp.call_args.kwargs["recipients"], ["+263778765432"])

    def test_whatsapp_address_prefixes_number_once(self) -> None:
        self.assertEqual(_whatsapp_address("+263771234567"), "whatsapp:+263771234567")
        self.assertEqual(_whatsapp_address("whatsapp:+263771234567"), "whatsapp:+263771234567")


if __name__ == "__main__":
    unittest.main()
