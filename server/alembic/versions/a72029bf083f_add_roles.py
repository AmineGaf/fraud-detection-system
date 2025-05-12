"""add_roles

Revision ID: a72029bf083f
Revises: a00d7ff2fc0a
Create Date: 2025-05-12 18:36:41.661661

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a72029bf083f'
down_revision: Union[str, None] = 'a00d7ff2fc0a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
