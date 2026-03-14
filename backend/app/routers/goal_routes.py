from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))

from app.services.ai.daily_quest_agent import generate_daily_tasks
from app.services.ai.graph import build_graph
from app.schemas.plan import Planresponse
from app.core.database import get_db
from app.models.task import Task
from app.models.player import Player
from app.models.goal import Goal
from app.models.milestone import Milestone
from datetime import date




router = APIRouter()

graph = build_graph()


class GoalRequest(BaseModel):
    goal: str
    description: str
    difficulty: str
    deadline: str


@router.post("/create", response_model=Planresponse)
def create_goal(data: GoalRequest, db: Session = Depends(get_db)):

    try:

        # 1️⃣ Create goal
        goal = Goal(
            goal_text=data.goal,
            deadline=data.deadline
        )

        db.add(goal)
        db.commit()
        db.refresh(goal)

        goal_id = goal.id

        # 2️⃣ Generate plan with AI
        result = graph.invoke({
            "goal": data.goal,
            "description": data.description,
            "difficulty": data.difficulty,
            "deadline": data.deadline
        })

        milestone_map = {}

        # 3️⃣ Save milestones
        for i, m in enumerate(result["milestones"]):

            milestone = Milestone(
                goal_id=goal_id,
                title=m["title"],
                status="active" if i == 0 else "locked"
            )

            db.add(milestone)
            db.flush()

            milestone_map[m["title"]] = milestone.id

        # 4️⃣ Save tasks
        for t in result["tasks"]:

            milestone_id = milestone_map.get(t["milestone"])

            task = Task(
                milestone_id=milestone_id,
                title=t["title"],
                difficulty=t["difficulty"],
                xp=t.get("xp", 50),
                type=t.get("type", "goal")
            )

            db.add(task)

        db.commit()

        return result

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return {"error": str(e)}
    
@router.get("/milestone/{milestone_id}/tasks")
def get_tasks_for_milestone(milestone_id: int, db: Session = Depends(get_db)):

    tasks = db.query(Task).filter(
        Task.milestone_id == milestone_id
    ).all()

    return tasks   

@router.post("/task/{task_id}/complete")
def complete_task(task_id: int, db: Session = Depends(get_db)):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    if task.completed:
        return {"message": "Task already completed"}

    task.completed = True

    # XP logic
    player = db.query(Player).first()

    if not player:
        player = Player(xp=0, level=1)
        db.add(player)
        db.commit()
        db.refresh(player)

    player.xp += task.xp
    player.level = player.xp // 100 + 1

    milestone = db.query(Milestone).filter(
        Milestone.id == task.milestone_id
    ).first()

    tasks = db.query(Task).filter(
        Task.milestone_id == milestone.id
    ).all()

    if all(t.completed for t in tasks):

        milestone.status = "completed"

        next_milestone = db.query(Milestone).filter(
            Milestone.goal_id == milestone.goal_id,
            Milestone.id > milestone.id
        ).order_by(Milestone.id).first()

        if next_milestone:
            next_milestone.status = "active"

    db.commit()

    return {
        "xp_gained": task.xp,
        "level": player.level
    }

@router.post("/task/{task_id}/complete")
def complete_task(task_id: int, db: Session = Depends(get_db)):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return {"error": "Task not found"}

    if task.completed:
        return {"message": "Task already completed"}

    task.completed = True

    player = db.query(Player).first()

    if not player:
        player = Player(xp=0, level=1)
        db.add(player)
        db.commit()
        db.refresh(player)

    player.xp += task.xp

    # simple level formula
    player.level = player.xp // 100 + 1

    db.commit()

    return {
        "xp_gained": task.xp,
        "total_xp": player.xp,
        "level": player.level
    }
@router.get("/player")
def get_player(db: Session = Depends(get_db)):

    player = db.query(Player).first()

    if not player:
        player = Player(xp=0, level=1)
        db.add(player)
        db.commit()
        db.refresh(player)

    return {
        "xp": player.xp,
        "level": player.level
    }
@router.get("/daily")
def get_daily_tasks(db: Session = Depends(get_db)):

    today = date.today()

    tasks = db.query(Task).filter(
        Task.scheduled_date == today
    ).all()

    if not tasks:
        tasks = generate_daily_tasks(db)

    result = []

    for task in tasks:
        result.append({
            "id": task.id,
            "title": task.title,
            "difficulty": task.difficulty,
            "xp": task.xp,
            "completed": task.completed
        })

    return result

@router.get("/milestones")
def get_milestones(db: Session = Depends(get_db)):

    milestones = db.query(Milestone).all()

    result = []

    for m in milestones:
        result.append({
            "id": m.id,
            "title": m.title,
            "status": m.status
        })

    return result

@router.get("/{goal_id}/milestones")
def get_goal_milestones(goal_id: int, db: Session = Depends(get_db)):

    milestones = (
        db.query(Milestone)
        .filter(Milestone.goal_id == goal_id)
        .all()
    )

    result = []

    for i, m in enumerate(milestones):

        if i == 0:
            status = "active"
        else:
            status = "locked"

        result.append({
            "id": m.id,
            "title": m.title,
            "description": "Milestone in your journey",
            "status": status
        })

    return {
        "milestones": result
    }