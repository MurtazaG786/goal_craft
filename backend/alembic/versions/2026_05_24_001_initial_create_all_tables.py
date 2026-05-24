"""Initial migration - create all tables

Revision ID: 001_initial
Revises: 
Create Date: 2026-05-24

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Players table
    op.create_table(
        'players',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('email', sa.String(), nullable=True, unique=True, index=True),
        sa.Column('hashed_password', sa.String(), nullable=True),
        sa.Column('username', sa.String(), server_default='GoalCraft Adventurer'),
        sa.Column('avatar', sa.String(), server_default='adventurer'),
        sa.Column('xp', sa.Integer(), server_default='0'),
        sa.Column('level', sa.Integer(), server_default='1'),
        sa.Column('streak', sa.Integer(), server_default='0'),
        sa.Column('last_streak_date', sa.Date(), nullable=True),
    )

    # Goals table
    op.create_table(
        'goals',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('player_id', sa.Integer(), sa.ForeignKey('players.id'), nullable=False),
        sa.Column('goal_text', sa.String(), nullable=True),
        sa.Column('deadline', sa.String(), nullable=True),
    )

    # Milestones table
    op.create_table(
        'milestones',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('goal_id', sa.Integer(), sa.ForeignKey('goals.id'), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('status', sa.String(), server_default='locked'),
    )

    # Tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('milestone_id', sa.Integer(), sa.ForeignKey('milestones.id'), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('difficulty', sa.String(), nullable=True),
        sa.Column('xp', sa.Integer(), nullable=True),
        sa.Column('type', sa.String(), server_default='goal'),
        sa.Column('scheduled_date', sa.Date(), nullable=True),
        sa.Column('completed', sa.Boolean(), server_default='false'),
    )


def downgrade() -> None:
    op.drop_table('tasks')
    op.drop_table('milestones')
    op.drop_table('goals')
    op.drop_table('players')
