"""perf indexes

Revision ID: 0002_perf_indexes
Revises: 0001_init
Create Date: 2026-03-18

"""

from __future__ import annotations

from alembic import op


revision = "0002_perf_indexes"
down_revision = "0001_init"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Helps ORDER BY created_at DESC in admin listing.
    op.create_index("ix_bookings_created_at", "bookings", ["created_at"])

    # Helps "verified proofs for payments" lookups/joins.
    op.create_index(
        "ix_payment_proofs_verification_status_payment_id",
        "payment_proofs",
        ["verification_status", "payment_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_payment_proofs_verification_status_payment_id", table_name="payment_proofs")
    op.drop_index("ix_bookings_created_at", table_name="bookings")

