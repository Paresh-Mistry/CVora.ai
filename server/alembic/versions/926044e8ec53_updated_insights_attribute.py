"""Updated Insights Attribute

Revision ID: 926044e8ec53
Revises: c2de3144a070
Create Date: 2026-07-25 17:08:58.867687

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '926044e8ec53'
down_revision: Union[str, Sequence[str], None] = 'c2de3144a070'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
