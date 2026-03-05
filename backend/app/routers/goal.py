from fastapi import APIRouter
from pydantic import BaseModel
import os
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
from app.services.ai.graph import build_graph

router = APIRouter()

graph = build_graph()
from app.schemas.plan import Planresponse
class GoalRequest(BaseModel):
    goal: str
    deadline: str

@router.post("/create",response_model=Planresponse)
def create_goal(data: GoalRequest):
    try:
        result = graph.invoke({
            "goal": data.goal,
            "deadline": data.deadline
        })
        return result

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return {"error": str(e)}