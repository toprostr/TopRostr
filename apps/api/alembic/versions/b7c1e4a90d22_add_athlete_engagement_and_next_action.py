"""add athlete engagement and next action

Revision ID: b7c1e4a90d22
Revises: 81ce85ba2f6b
Create Date: 2026-10-06 02:20:00.000000

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "b7c1e4a90d22"
down_revision: str | Sequence[str] | None = "81ce85ba2f6b"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table("athletes", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("engagement", sa.String(length=200), nullable=True)
        )
        batch_op.add_column(
            sa.Column("next_action", sa.String(length=500), nullable=True)
        )


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("athletes", schema=None) as batch_op:
        batch_op.drop_column("next_action")
        batch_op.drop_column("engagement")
