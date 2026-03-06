from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base


class Milestone(Base):

    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)

    goal_id = Column(Integer, ForeignKey("goals.id"))

    title = Column(String)