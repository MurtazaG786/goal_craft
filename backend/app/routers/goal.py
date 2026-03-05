from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai.graph import build_graph

router = APIRouter()

graph = build_graph()

class GoalRequest(BaseModel):
    goal: str
    deadline: str

@router.post("/create")
def create_goal(data: GoalRequest):

    result = graph.invoke({
        "goal": data.goal,
        "deadline": data.deadline
    })

    return result