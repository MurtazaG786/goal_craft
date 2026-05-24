from sqlalchemy import Column, Integer, String, Date
from app.core.database import Base

class Player(Base):

    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=True)
    username = Column(String, default="GoalCraft Adventurer")
    avatar = Column(String, default="🐧")

    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak = Column(Integer, default=0)
    last_streak_date = Column(Date, nullable=True)