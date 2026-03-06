from langgraph.graph import StateGraph, END
from typing import TypedDict,List,Dict
from langgraph.graph import StateGraph, END

from app.services.ai.milestone_agent import generate_milestones
from app.services.ai.task_agent import generate_tasks
from app.services.gamification import assign_xp
from app.services.scheduler import schedule_tasks

def milestone_node(state):

    result = generate_milestones(state["goal"], state["deadline"])
    milestones = result.get("milestones", [])
    print("Generated milestones:", milestones)
    return {"milestones": milestones}

def task_node(state):

    milestones = state.get("milestones")
    if not milestones:
        raise ValueError("Milestones were not generated before task node")
    result = generate_tasks(state["goal"], milestones)
    return {"tasks": result.get("tasks", [])}


def xp_node(state):
    tasks = assign_xp(state["tasks"])
    return {"tasks": tasks}

def schedule_node(state):

    tasks = schedule_tasks(state.get("tasks", []), state["deadline"])
    return {"tasks": tasks}


from app.services.ai.planner import generate_plan

class GoalState(TypedDict,total=False):
    goal: str
    deadline: str
    milestones:List[Dict]
    tasks:List[Dict]
    plan: dict
def build_graph():

    graph = StateGraph(GoalState)

    graph.add_node("milestones", milestone_node)
    graph.add_node("tasks", task_node)
    graph.add_node("xp", xp_node)
    graph.add_node("scheduling",schedule_node)

    graph.set_entry_point("milestones")

    graph.add_edge("milestones", "tasks")
    graph.add_edge("tasks", "xp")
    graph.add_edge("xp","scheduling")
    graph.add_edge("scheduling", END)

    return graph.compile()