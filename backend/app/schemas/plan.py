from pydantic import BaseModel
from typing import List

class Milestone(BaseModel):
    title:str

class Task(BaseModel):
    milestone:str
    title:str
    difficulty:str
    xp:int | None=None

class Planresponse(BaseModel):
    milestones:List[Milestone]
    tasks:List[Task]

