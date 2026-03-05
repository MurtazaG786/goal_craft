from langgraph.graph import StateGraph, END
from typing import TypedDict
from app.services.ai.planner import generate_plan

class GoalState(TypedDict,total=False):
    goal: str
    deadline: str
    plan: dict

def planner_node(state: GoalState):
    plan = generate_plan(state["goal"], state["deadline"])
    return {"plan": plan}

def build_graph():

    graph = StateGraph(GoalState)

    graph.add_node("planner", planner_node)

    graph.set_entry_point("planner")

    graph.add_edge("planner", END)

    return graph.compile()