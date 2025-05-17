"""exams_updates

Revision ID: 2a671c6bc0f9
Revises: cad90f1ff3ab
Create Date: 2025-05-17 17:44:23.991115

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2a671c6bc0f9'
down_revision: Union[str, None] = 'cad90f1ff3ab'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
