"""make_password_hash_nullable

Revision ID: 8c38ed13a3eb
Revises: e1425f1bc7bb
Create Date: 2025-05-13 01:33:28.724236

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8c38ed13a3eb'
down_revision: Union[str, None] = 'e1425f1bc7bb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column('users', 'password_hash', existing_type=sa.String(length=128), nullable=True)

def downgrade():
    op.alter_column('users', 'password_hash', existing_type=sa.String(length=128), nullable=False)
