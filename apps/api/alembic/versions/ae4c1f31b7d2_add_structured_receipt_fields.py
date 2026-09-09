"""add structured receipt fields

Revision ID: ae4c1f31b7d2
Revises: 8da7c57d7403
Create Date: 2026-08-11 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "ae4c1f31b7d2"
down_revision: str | Sequence[str] | None = "8da7c57d7403"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("receipts", sa.Column("merchant", sa.String(), nullable=True))
    op.add_column("receipts", sa.Column("receipt_date", sa.Date(), nullable=True))
    op.add_column("receipts", sa.Column("line_items", sa.JSON(), nullable=True))
    op.add_column("receipts", sa.Column("subtotal", sa.Float(), nullable=True))
    op.add_column("receipts", sa.Column("tax", sa.Float(), nullable=True))
    op.add_column("receipts", sa.Column("total", sa.Float(), nullable=True))
    op.add_column("receipts", sa.Column("currency", sa.String(length=3), nullable=True))


def downgrade() -> None:
    op.drop_column("receipts", "currency")
    op.drop_column("receipts", "total")
    op.drop_column("receipts", "tax")
    op.drop_column("receipts", "subtotal")
    op.drop_column("receipts", "line_items")
    op.drop_column("receipts", "receipt_date")
    op.drop_column("receipts", "merchant")
