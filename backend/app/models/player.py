from sqlalchemy import Column, Integer
from app.core.database import Base

class Player(Base):

    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)

    xp = Column(Integer, default=0)

    level = Column(Integer, default=1)