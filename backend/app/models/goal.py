from sqlalchemy import Integer,Column,String
from app.core.database import Base

class Goal(Base):
    __tablename__="goals"

    id=Column(Integer,primary_key=True,index=True)
    goal_text=Column(String)
    deadline=Column(String)

