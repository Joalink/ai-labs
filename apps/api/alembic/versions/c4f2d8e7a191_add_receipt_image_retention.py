"""add receipt image retention

Revision ID: c4f2d8e7a191
Revises: ae4c1f31b7d2
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "c4f2d8e7a191"
down_revision: str | Sequence[str] | None = "ae4c1f31b7d2"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("receipts", sa.Column("image_path", sa.String(), nullable=True))
    op.add_column("receipts", sa.Column("session_id", sa.String(), nullable=True))
    op.add_column(
        "receipts", sa.Column("image_expires_at", sa.DateTime(), nullable=True)
    )
    op.create_index("ix_receipts_session_id", "receipts", ["session_id"])


def downgrade() -> None:
    op.drop_index("ix_receipts_session_id", table_name="receipts")
    op.drop_column("receipts", "image_expires_at")
    op.drop_column("receipts", "session_id")
    op.drop_column("receipts", "image_path")
