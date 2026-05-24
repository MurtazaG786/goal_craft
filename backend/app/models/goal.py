from sqlalchemy import Integer, Column, String, ForeignKey
from app.core.database import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(Integer, ForeignKey("players.id"))
    goal_text = Column(String)
    deadline = Column(String)

