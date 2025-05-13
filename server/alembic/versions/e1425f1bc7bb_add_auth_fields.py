"""add_auth_fields

Revision ID: e1425f1bc7bb
Revises: a72029bf083f
Create Date: 2025-05-13 01:18:52.540445

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e1425f1bc7bb'
down_revision: Union[str, None] = 'a72029bf083f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('users', sa.Column('is_active', sa.Boolean(), server_default='true'))
    op.alter_column('users', 'email', nullable=False)
    op.alter_column('users', 'password_hash', nullable=False)

def downgrade():
    # Reverse the changes
    op.drop_column('users', 'is_active')
    op.alter_column('users', 'email', nullable=True)
    op.alter_column('users', 'password_hash', nullable=True)
