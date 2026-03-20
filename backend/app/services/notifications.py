from __future__ import annotations

import html
import logging
import smtplib
import ssl
from email.message import EmailMessage

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.booking import Booking
from app.models.notification import Notification

logger = logging.getLogger(__name__)


def send_booking_created_notifications_by_id(*, booking_id) -> None:
    with SessionLocal() as db:
        booking = db.execute(
            select(Booking).where(Booking.id == booking_id).options(joinedload(Booking.guest))
        ).unique().scalar_one_or_none()
        if booking is None:
            logger.warning("Skipping booking-created notifications: booking %s was not found", booking_id)
            return
        send_booking_created_notifications(db=db, booking=booking)


def send_booking_confirmed_notifications_by_id(*, booking_id) -> None:
    with SessionLocal() as db:
        booking = db.execute(
            select(Booking).where(Booking.id == booking_id).options(joinedload(Booking.guest))
        ).unique().scalar_one_or_none()
        if booking is None:
            logger.warning("Skipping booking-confirmed notifications: booking %s was not found", booking_id)
            return
        send_booking_confirmed_notifications(db=db, booking=booking)


def send_booking_created_notifications(*, db: Session, booking: Booking) -> None:
    if not settings.notifications_enabled:
        return

    booking = _load_booking_with_guest(db=db, booking=booking)
    notifications: list[Notification] = []

    notifications.extend(_deliver_guest_booking_received(booking=booking))
    notifications.extend(_deliver_admin_booking_alert(booking=booking))
    _persist_notifications(db=db, notifications=notifications)


def send_booking_confirmed_notifications(*, db: Session, booking: Booking) -> None:
    if not settings.notifications_enabled:
        return

    booking = _load_booking_with_guest(db=db, booking=booking)
    notifications = _deliver_guest_booking_confirmed(booking=booking)
    _persist_notifications(db=db, notifications=notifications)


def _load_booking_with_guest(*, db: Session, booking: Booking) -> Booking:
    stmt = select(Booking).where(Booking.id == booking.id).options(joinedload(Booking.guest))
    loaded = db.execute(stmt).unique().scalar_one_or_none()
    return loaded or booking


def _deliver_guest_booking_received(*, booking: Booking) -> list[Notification]:
    guest = booking.guest
    if guest is None:
        return []

    notifications: list[Notification] = []
    title = f"Thank you for your support - {booking.reference}"
    email_body, email_html_body = _guest_booking_received_email_content(booking=booking)
    text_body = (
        f"Booking received for {guest.full_name}. Ref: {booking.reference}. "
        "We will confirm once payment is approved."
    )

    if guest.email:
        notifications.extend(
            _send_email_notifications(
                booking=booking,
                title=title,
                body=email_body,
                html_body=email_html_body,
                recipients=[guest.email],
            )
        )
    if guest.phone:
        notifications.extend(
            _send_sms_notifications(
                booking=booking,
                title=title,
                body=text_body,
                recipients=[guest.phone],
            )
        )
        notifications.extend(
            _send_whatsapp_notifications(
                booking=booking,
                title=title,
                body=text_body,
                recipients=[guest.phone],
            )
        )

    return notifications


def _deliver_guest_booking_confirmed(*, booking: Booking) -> list[Notification]:
    guest = booking.guest
    if guest is None:
        return []

    notifications: list[Notification] = []
    title = f"Booking confirmed: {booking.reference}"
    email_body = (
        f"Hello {guest.full_name},\n\n"
        f"Your booking has now been confirmed for {booking.seats} seat(s).\n"
        f"Booking reference: {booking.reference}.\n\n"
        "Please keep this reference safe and present it on the event day.\n"
        "We look forward to seeing you at the fundraising dinner.\n"
    )
    text_body = (
        f"Your booking is confirmed. Ref: {booking.reference}. "
        "Please keep this reference safe for event day."
    )

    if guest.email:
        notifications.extend(
            _send_email_notifications(
                booking=booking,
                title=title,
                body=email_body,
                recipients=[guest.email],
            )
        )
    if guest.phone:
        notifications.extend(
            _send_sms_notifications(
                booking=booking,
                title=title,
                body=text_body,
                recipients=[guest.phone],
            )
        )
        notifications.extend(
            _send_whatsapp_notifications(
                booking=booking,
                title=title,
                body=text_body,
                recipients=[guest.phone],
            )
        )

    return notifications


def _deliver_admin_booking_alert(*, booking: Booking) -> list[Notification]:
    guest = booking.guest
    if guest is None:
        return []

    title = f"New booking submitted: {booking.reference}"
    body, html_body = _admin_booking_alert_email_content(booking=booking)

    notifications: list[Notification] = []
    notifications.extend(
        _send_email_notifications(
            booking=booking,
            title=title,
            body=body,
            html_body=html_body,
            recipients=settings.admin_notification_emails_list,
        )
    )
    notifications.extend(
        _send_sms_notifications(
            booking=booking,
            title=title,
            body=body,
            recipients=settings.admin_notification_phones_list,
        )
    )
    notifications.extend(
        _send_whatsapp_notifications(
            booking=booking,
            title=title,
            body=body,
            recipients=settings.admin_notification_whatsapp_numbers_list,
        )
    )
    return notifications


def _send_email_notifications(
    *,
    booking: Booking,
    title: str,
    body: str,
    recipients: list[str],
    html_body: str | None = None,
) -> list[Notification]:
    if not settings.email_enabled or not recipients:
        return []

    notifications: list[Notification] = []
    for recipient in recipients:
        try:
            _send_email(recipient=recipient, subject=title, body=body, html_body=html_body)
        except RuntimeError as exc:
            logger.warning("Skipping email notification to %s: %s", recipient, exc)
            continue
        except Exception:
            logger.exception("Failed to send email notification to %s", recipient)
            continue
        notifications.append(_build_notification(booking=booking, channel="email", title=title, body=body))
    return notifications


def _send_sms_notifications(*, booking: Booking, title: str, body: str, recipients: list[str]) -> list[Notification]:
    if not settings.sms_enabled or not recipients:
        return []

    notifications: list[Notification] = []
    for recipient in recipients:
        try:
            _send_sms(recipient=recipient, body=body)
        except RuntimeError as exc:
            logger.warning("Skipping SMS notification to %s: %s", recipient, exc)
            continue
        except Exception:
            logger.exception("Failed to send SMS notification to %s", recipient)
            continue
        notifications.append(_build_notification(booking=booking, channel="sms", title=title, body=body))
    return notifications


def _send_whatsapp_notifications(
    *, booking: Booking, title: str, body: str, recipients: list[str]
) -> list[Notification]:
    if not settings.whatsapp_enabled or not recipients:
        return []

    notifications: list[Notification] = []
    for recipient in recipients:
        try:
            _send_whatsapp(recipient=recipient, body=body)
        except RuntimeError as exc:
            logger.warning("Skipping WhatsApp notification to %s: %s", recipient, exc)
            continue
        except Exception:
            logger.exception("Failed to send WhatsApp notification to %s", recipient)
            continue
        notifications.append(_build_notification(booking=booking, channel="whatsapp", title=title, body=body))
    return notifications


def _build_notification(*, booking: Booking, channel: str, title: str, body: str) -> Notification:
    return Notification(
        guest_id=booking.guest_id,
        booking_id=booking.id,
        channel=channel,
        title=title,
        body=body,
    )


def _persist_notifications(*, db: Session, notifications: list[Notification]) -> None:
    if not notifications:
        return

    try:
        db.add_all(notifications)
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Failed to persist notification audit records")


def _send_email(*, recipient: str, subject: str, body: str, html_body: str | None = None) -> None:
    if not settings.smtp_host or not settings.email_from_address:
        raise RuntimeError("SMTP email settings are incomplete")
    if not settings.smtp_username or not settings.smtp_password:
        raise RuntimeError("SMTP credentials are incomplete")
    if settings.smtp_use_tls and settings.smtp_use_ssl:
        raise RuntimeError("Configure either SMTP TLS or SMTP SSL, not both")

    message = EmailMessage()
    sender = settings.email_from_address
    if settings.email_from_name:
        message["From"] = f"{settings.email_from_name} <{sender}>"
    else:
        message["From"] = sender
    message["To"] = recipient
    message["Subject"] = subject
    message.set_content(body)
    if html_body:
        message.add_alternative(html_body, subtype="html")

    if settings.smtp_use_ssl:
        with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, context=ssl.create_default_context()) as server:
            server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(message)
        return

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        if settings.smtp_use_tls:
            server.starttls(context=ssl.create_default_context())
        server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(message)


def _send_sms(*, recipient: str, body: str) -> None:
    client = _twilio_client()
    if not settings.twilio_sms_from:
        raise RuntimeError("Twilio SMS sender is not configured")
    client.messages.create(to=recipient, from_=settings.twilio_sms_from, body=body)


def _send_whatsapp(*, recipient: str, body: str) -> None:
    client = _twilio_client()
    if not settings.twilio_whatsapp_from:
        raise RuntimeError("Twilio WhatsApp sender is not configured")
    client.messages.create(
        to=_whatsapp_address(recipient),
        from_=_whatsapp_address(settings.twilio_whatsapp_from),
        body=body,
    )


def _twilio_client():
    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        raise RuntimeError("Twilio credentials are incomplete")

    from twilio.rest import Client

    return Client(settings.twilio_account_sid, settings.twilio_auth_token)


def _whatsapp_address(value: str) -> str:
    if value.startswith("whatsapp:"):
        return value
    return f"whatsapp:{value}"


def _guest_booking_received_email_content(*, booking: Booking) -> tuple[str, str]:
    guest = booking.guest
    guest_name = guest.full_name if guest is not None else "friend"
    booking_reference = booking.reference
    booking_link = f"{settings.public_web_url.rstrip('/')}/booking/{booking_reference}/payment"

    text_body = (
        f"Hello {guest_name},\n\n"
        "Thank you for your support.\n\n"
        "We have successfully received your booking request for the MOSH Fundraising Dinner.\n\n"
        "Booking Details\n"
        f"- Number of Seats: {booking.seats}\n"
        f"- Booking Reference: {booking_reference}\n"
        f"- View your booking and upload payment proof: {booking_link}\n\n"
        "Payment Instructions\n"
        "Bank Transfer\n"
        "- Bank Name: ZB Bank\n"
        "- Account Name: Mothers of Special Heroes Zimbabwe\n"
        "- Account Number: 430700036233405\n"
        f"- Reference: {booking_reference}\n\n"
        "EcoCash\n"
        "- Number: +263 783 019 160\n"
        "- Account Name: Talent Mazombe\n"
        f"- Reference: {booking_reference}\n\n"
        "Next Step\n"
        "Once you have made your payment, upload your payment proof using the booking link above.\n\n"
        "What Happens Next?\n"
        "- Our team will review your payment\n"
        "- You will receive a final confirmation email once approved\n\n"
        "Your Impact\n"
        "Every seat you book helps support children with neurological disabilities and empowers their families through MOSH programs.\n\n"
        "Questions?\n"
        "- Email: info@mothersofspecialheroes.org\n"
        "- Phone: +263 783 019 160\n\n"
        "Thank you for being part of this mission.\n\n"
        "Mothers of Special Heroes (MOSH)\n"
        "Empowering Children. Supporting Families. Building Inclusion.\n"
    )

    safe_name = html.escape(guest_name)
    safe_reference = html.escape(booking_reference)
    safe_link = html.escape(booking_link)
    html_body = f"""
<html>
  <body style="margin:0;padding:0;background:#f7f8fb;font-family:Arial,sans-serif;color:#1f2937;">
    <div style="max-width:680px;margin:0 auto;padding:24px 16px;">
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;">
        <p style="margin:0 0 16px;font-size:16px;">Hello {safe_name},</p>
        <p style="margin:0 0 16px;font-size:16px;">Thank you for your support 💚</p>
        <p style="margin:0 0 24px;font-size:16px;">
          We have successfully received your booking request for the <strong>MOSH Fundraising Dinner</strong>.
        </p>

        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Booking Details</h2>
        <ul style="margin:0 0 24px;padding-left:20px;line-height:1.7;">
          <li><strong>Number of Seats:</strong> {booking.seats}</li>
          <li><strong>Booking Reference:</strong> {safe_reference}</li>
        </ul>

        <p style="margin:0 0 24px;">
          <a href="{safe_link}" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;">
            View Booking And Upload Payment Proof
          </a>
        </p>
        <p style="margin:0 0 24px;font-size:14px;color:#4b5563;">
          Or use this link: <a href="{safe_link}" style="color:#16a34a;">{safe_link}</a>
        </p>

        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Payment Instructions</h2>
        <h3 style="margin:16px 0 8px;font-size:16px;color:#111827;">Bank Transfer</h3>
        <ul style="margin:0 0 16px;padding-left:20px;line-height:1.7;">
          <li><strong>Bank Name:</strong> ZB Bank</li>
          <li><strong>Account Name:</strong> Mothers of Special Heroes Zimbabwe</li>
          <li><strong>Account Number:</strong> 430700036233405</li>
          <li><strong>Reference:</strong> {safe_reference}</li>
        </ul>

        <h3 style="margin:16px 0 8px;font-size:16px;color:#111827;">EcoCash</h3>
        <ul style="margin:0 0 24px;padding-left:20px;line-height:1.7;">
          <li><strong>Number:</strong> +263 783 019 160</li>
          <li><strong>Account Name:</strong> Talent Mazombe</li>
          <li><strong>Reference:</strong> {safe_reference}</li>
        </ul>

        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Next Step</h2>
        <p style="margin:0 0 24px;line-height:1.7;">
          Once you have made your payment, upload your <strong>payment proof</strong> using the link above to complete your booking.
        </p>

        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">What Happens Next?</h2>
        <ul style="margin:0 0 24px;padding-left:20px;line-height:1.7;">
          <li>Our team will review your payment</li>
          <li>You will receive a <strong>final confirmation email</strong> once approved</li>
        </ul>

        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Your Impact</h2>
        <p style="margin:0 0 24px;line-height:1.7;">
          Every seat you book helps support children with neurological disabilities and empowers their families through MOSH programs.
        </p>

        <p style="margin:0 0 8px;line-height:1.7;">If you have any questions, feel free to contact us:</p>
        <ul style="margin:0 0 24px;padding-left:20px;line-height:1.7;">
          <li><a href="mailto:info@mothersofspecialheroes.org" style="color:#16a34a;">info@mothersofspecialheroes.org</a></li>
          <li>+263 783 019 160</li>
        </ul>

        <p style="margin:0 0 8px;line-height:1.7;">Thank you for being part of this mission.</p>
        <p style="margin:0;line-height:1.7;">
          <strong>Mothers of Special Heroes (MOSH)</strong><br />
          Empowering Children. Supporting Families. Building Inclusion.
        </p>
      </div>
    </div>
  </body>
</html>
""".strip()

    return text_body, html_body


def _admin_booking_alert_email_content(*, booking: Booking) -> tuple[str, str]:
    guest = booking.guest
    guest_name = guest.full_name if guest is not None else "Unknown guest"
    guest_email = guest.email if guest is not None and guest.email else "not provided"
    guest_phone = guest.phone if guest is not None and guest.phone else "not provided"
    guest_type = guest.guest_type.value if guest is not None else "unknown"
    booking_reference = booking.reference
    admin_link = f"{settings.public_web_url.rstrip('/')}/admin/dashboard"
    booking_link = f"{settings.public_web_url.rstrip('/')}/booking/{booking_reference}/payment"
    notes = booking.notes.strip() if booking.notes else "No additional notes provided."

    text_body = (
        "Hello MOSH Team,\n\n"
        "A new booking has been submitted for the MOSH Fundraising Dinner.\n\n"
        "Booking Summary\n"
        f"- Booking type: {guest_type}\n"
        f"- Number of Seats: {booking.seats}\n"
        f"- Booking Reference: {booking_reference}\n"
        "- Status: pending\n\n"
        "Guest Details\n"
        f"- Full Name: {guest_name}\n"
        f"- Email: {guest_email}\n"
        f"- Phone: {guest_phone}\n\n"
        "Additional Notes\n"
        f"- {notes}\n\n"
        "Quick Links\n"
        f"- Admin dashboard: {admin_link}\n"
        f"- Public booking page: {booking_link}\n\n"
        "Next Action\n"
        "- Monitor for payment proof upload\n"
        "- Review and confirm payment once submitted\n\n"
        "MOSH Booking System\n"
    )

    safe_guest_name = html.escape(guest_name)
    safe_guest_email = html.escape(guest_email)
    safe_guest_phone = html.escape(guest_phone)
    safe_guest_type = html.escape(guest_type.title())
    safe_reference = html.escape(booking_reference)
    safe_notes = html.escape(notes)
    safe_admin_link = html.escape(admin_link)
    safe_booking_link = html.escape(booking_link)

    html_body = f"""
<html>
  <body style="margin:0;padding:0;background:#f7f8fb;font-family:Arial,sans-serif;color:#1f2937;">
    <div style="max-width:680px;margin:0 auto;padding:24px 16px;">
      <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;">
        <p style="margin:0 0 16px;font-size:16px;">Hello MOSH Team,</p>
        <p style="margin:0 0 24px;font-size:16px;">
          A new booking has been submitted for the <strong>MOSH Fundraising Dinner</strong>.
        </p>

        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Booking Summary</h2>
        <ul style="margin:0 0 24px;padding-left:20px;line-height:1.7;">
          <li><strong>Booking Type:</strong> {safe_guest_type}</li>
          <li><strong>Number of Seats:</strong> {booking.seats}</li>
          <li><strong>Booking Reference:</strong> {safe_reference}</li>
          <li><strong>Status:</strong> Pending</li>
        </ul>

        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Guest Details</h2>
        <ul style="margin:0 0 24px;padding-left:20px;line-height:1.7;">
          <li><strong>Full Name:</strong> {safe_guest_name}</li>
          <li><strong>Email:</strong> {safe_guest_email}</li>
          <li><strong>Phone:</strong> {safe_guest_phone}</li>
        </ul>

        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Additional Notes</h2>
        <p style="margin:0 0 24px;line-height:1.7;">{safe_notes}</p>

        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Quick Actions</h2>
        <p style="margin:0 0 12px;">
          <a href="{safe_admin_link}" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;">
            Open Admin Dashboard
          </a>
        </p>
        <p style="margin:0 0 24px;font-size:14px;color:#4b5563;">
          Public booking page: <a href="{safe_booking_link}" style="color:#16a34a;">{safe_booking_link}</a>
        </p>

        <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Next Action</h2>
        <ul style="margin:0;padding-left:20px;line-height:1.7;">
          <li>Monitor for payment proof upload</li>
          <li>Review and confirm payment once submitted</li>
        </ul>
      </div>
    </div>
  </body>
</html>
""".strip()

    return text_body, html_body
