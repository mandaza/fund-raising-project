"""init

Revision ID: 0001_init
Revises: 
Create Date: 2026-03-17

"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


revision = "0001_init"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    guest_type = sa.Enum("individual", "corporate", "sponsor", "vip", name="guest_type")
    booking_status = sa.Enum("pending", "confirmed", "cancelled", name="booking_status")
    payment_method = sa.Enum("cash", "bank_transfer", "ecocash", "visa", "other", name="payment_method")
    proof_verification_status = sa.Enum("pending", "verified", "rejected", name="proof_verification_status")

    op.create_table(
        "admins",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("username", sa.String(length=150), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("username", name="uq_admins_username"),
    )
    op.create_index("ix_admins_username", "admins", ["username"])

    op.create_table(
        "guests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("full_name", sa.String(length=200), nullable=False),
        sa.Column("email", sa.String(length=320), nullable=True),
        sa.Column("phone", sa.String(length=50), nullable=True),
        sa.Column("guest_type", guest_type, nullable=False, server_default="individual"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("email", name="uq_guests_email"),
    )
    op.create_index("ix_guests_email", "guests", ["email"])
    op.create_index("ix_guests_phone", "guests", ["phone"])

    op.create_table(
        "bookings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("guest_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("reference", sa.String(length=32), nullable=False),
        sa.Column("status", booking_status, nullable=False, server_default="pending"),
        sa.Column("seats", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("notes", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["guest_id"], ["guests.id"], ondelete="CASCADE", name="fk_bookings_guest_id"),
        sa.UniqueConstraint("reference", name="uq_bookings_reference"),
    )
    op.create_index("ix_bookings_guest_id", "bookings", ["guest_id"])
    op.create_index("ix_bookings_reference", "bookings", ["reference"])
    op.create_index("ix_bookings_status", "bookings", ["status"])

    op.create_table(
        "payments",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("booking_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("method", payment_method, nullable=False),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="USD"),
        sa.Column("provider_reference", sa.String(length=100), nullable=True),
        sa.Column("paid_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("notes", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"], ondelete="CASCADE", name="fk_payments_booking_id"),
    )
    op.create_index("ix_payments_booking_id", "payments", ["booking_id"])
    op.create_index("ix_payments_method", "payments", ["method"])
    op.create_index("ix_payments_provider_reference", "payments", ["provider_reference"])

    op.create_table(
        "payment_proofs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("payment_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("file_path", sa.String(length=500), nullable=False),
        sa.Column("original_filename", sa.String(length=255), nullable=True),
        sa.Column("content_type", sa.String(length=100), nullable=True),
        sa.Column("verification_status", proof_verification_status, nullable=False, server_default="pending"),
        sa.Column("verified_by_admin_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("verified_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("rejection_reason", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.ForeignKeyConstraint(["payment_id"], ["payments.id"], ondelete="CASCADE", name="fk_payment_proofs_payment_id"),
        sa.ForeignKeyConstraint(
            ["verified_by_admin_id"], ["admins.id"], ondelete="SET NULL", name="fk_payment_proofs_verified_by_admin_id"
        ),
    )
    op.create_index("ix_payment_proofs_payment_id", "payment_proofs", ["payment_id"])
    op.create_index("ix_payment_proofs_verification_status", "payment_proofs", ["verification_status"])
    op.create_index("ix_payment_proofs_verified_by_admin_id", "payment_proofs", ["verified_by_admin_id"])

    op.create_table(
        "notifications",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("guest_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("booking_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("admin_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("channel", sa.String(length=30), nullable=False, server_default="system"),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("body", sa.String(length=2000), nullable=False),
        sa.Column("is_read", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["guest_id"], ["guests.id"], ondelete="CASCADE", name="fk_notifications_guest_id"),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"], ondelete="CASCADE", name="fk_notifications_booking_id"),
        sa.ForeignKeyConstraint(["admin_id"], ["admins.id"], ondelete="CASCADE", name="fk_notifications_admin_id"),
    )
    op.create_index("ix_notifications_is_read", "notifications", ["is_read"])


def downgrade() -> None:
    op.drop_index("ix_notifications_is_read", table_name="notifications")
    op.drop_table("notifications")

    op.drop_index("ix_payment_proofs_verified_by_admin_id", table_name="payment_proofs")
    op.drop_index("ix_payment_proofs_verification_status", table_name="payment_proofs")
    op.drop_index("ix_payment_proofs_payment_id", table_name="payment_proofs")
    op.drop_table("payment_proofs")

    op.drop_index("ix_payments_provider_reference", table_name="payments")
    op.drop_index("ix_payments_method", table_name="payments")
    op.drop_index("ix_payments_booking_id", table_name="payments")
    op.drop_table("payments")

    op.drop_index("ix_bookings_status", table_name="bookings")
    op.drop_index("ix_bookings_reference", table_name="bookings")
    op.drop_index("ix_bookings_guest_id", table_name="bookings")
    op.drop_table("bookings")

    op.drop_index("ix_guests_phone", table_name="guests")
    op.drop_index("ix_guests_email", table_name="guests")
    op.drop_table("guests")

    op.drop_index("ix_admins_username", table_name="admins")
    op.drop_table("admins")

    # Drop enums last.
    op.execute("DROP TYPE IF EXISTS proof_verification_status")
    op.execute("DROP TYPE IF EXISTS payment_method")
    op.execute("DROP TYPE IF EXISTS booking_status")
    op.execute("DROP TYPE IF EXISTS guest_type")

