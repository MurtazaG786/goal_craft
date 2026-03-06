from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base


class Task(Base):

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    milestone_id = Column(Integer, ForeignKey("milestones.id"))

    title = Column(String)

    difficulty = Column(String)

    xp = Column(Integer)