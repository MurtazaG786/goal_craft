from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.services.ai.daily_quest_agent import generate_daily_tasks
from app.services.ai.graph import build_graph
from app.services.ai.side_quest_agent import generate_side_quests
from app.services.gamification import assign_xp
from app.services.scheduler import schedule_tasks
from app.schemas.plan import Planresponse
from app.core.database import get_db
from app.models.task import Task
from app.models.player import Player
from app.models.goal import Goal
from app.models.milestone import Milestone
from app.core.auth import get_current_user
from datetime import date, timedelta
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

graph = build_graph()


def xp_for_level(level: int) -> int:
    return 100 + (level - 1) * 50


def calculate_level(total_xp: int) -> int:
    level = 1
    xp_remaining = total_xp

    while xp_remaining >= xp_for_level(level):
        xp_remaining -= xp_for_level(level)
        level += 1

    return level


class GoalRequest(BaseModel):
    goal: str
    description: str
    difficulty: str
    deadline: str


def build_fallback_plan(goal: str, difficulty: str):
    milestone_title = f"Kickoff: {goal}"
    milestones = [{"title": milestone_title}]
    tasks = [
        {
            "milestone": milestone_title,
            "title": "Define success criteria and milestones",
            "difficulty": difficulty
        },
        {
            "milestone": milestone_title,
            "title": "Schedule focused work blocks for this week",
            "difficulty": difficulty
        },
        {
            "milestone": milestone_title,
            "title": "Complete the first actionable step",
            "difficulty": difficulty
        }
    ]

    tasks = assign_xp(tasks)
    tasks = schedule_tasks(tasks, "")
    return {
        "milestones": milestones,
        "tasks": tasks
    }


@router.post("/create", response_model=Planresponse)
def create_goal(data: GoalRequest, db: Session = Depends(get_db), current_user: Player = Depends(get_current_user)):

    try:

        # 1️⃣ Create goal
        goal = Goal(
            player_id=current_user.id,
            goal_text=data.goal,
            deadline=data.deadline
        )

        db.add(goal)
        db.flush()

        goal_id = goal.id

        # 2️⃣ Generate plan with AI
        try:
            result = graph.invoke({
                "goal": data.goal,
                "description": data.description,
                "difficulty": data.difficulty,
                "deadline": data.deadline
            })
        except Exception as ai_error:
            logger.error("AI plan generation failed, falling back: %s", ai_error)
            result = build_fallback_plan(data.goal, data.difficulty)

        if not isinstance(result, dict):
            raise ValueError("Plan generation returned invalid format")

        milestones = result.get("milestones")
        tasks = result.get("tasks")

        if not isinstance(milestones, list) or not isinstance(tasks, list):
            logger.error("AI plan format invalid, falling back")
            result = build_fallback_plan(data.goal, data.difficulty)
            milestones = result.get("milestones")
            tasks = result.get("tasks")

        if not milestones or not tasks:
            logger.error("AI plan empty, falling back")
            result = build_fallback_plan(data.goal, data.difficulty)
            milestones = result.get("milestones")
            tasks = result.get("tasks")

        milestone_map = {}

        # 3️⃣ Save milestones
        for i, m in enumerate(milestones):

            milestone = Milestone(
                goal_id=goal_id,
                title=m["title"],
                status="active" if i == 0 else "locked"
            )

            db.add(milestone)
            db.flush()

            milestone_map[m["title"]] = milestone.id

        # 4️⃣ Save tasks
        for t in tasks:

            milestone_id = milestone_map.get(t["milestone"])
            if milestone_id is None:
                raise ValueError("Task milestone does not match any generated milestone")

            scheduled_date = None
            if t.get("scheduled_date"):
                scheduled_date = date.fromisoformat(str(t["scheduled_date"]))

            task = Task(
                milestone_id=milestone_id,
                title=t["title"],
                difficulty=t["difficulty"],
                xp=t.get("xp", 50),
                type=t.get("type", "goal"),
                scheduled_date=scheduled_date
            )

            db.add(task)

        db.commit()

        return {
            "goal_id": goal_id,
            "milestones": milestones,
            "tasks": tasks
        }

    except Exception as e:
        import traceback
        logger.error("Goal creation failed: %s", e)
        print(traceback.format_exc())
        db.rollback()
        raise HTTPException(status_code=503, detail=str(e))

@router.get("/milestone/{milestone_id}/tasks")
def get_tasks_for_milestone(milestone_id: int, db: Session = Depends(get_db), current_user: Player = Depends(get_current_user)):

    milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    goal = db.query(Goal).filter(Goal.id == milestone.goal_id).first()
    if not goal or goal.player_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    tasks = db.query(Task).filter(
        Task.milestone_id == milestone_id
    ).all()

    return tasks

@router.post("/task/{task_id}/complete")
def complete_task(task_id: int, db: Session = Depends(get_db), current_user: Player = Depends(get_current_user)):

    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.completed:
        return {"message": "Task already completed"}

    # Verify authorization
    milestone = db.query(Milestone).filter(Milestone.id == task.milestone_id).first()
    if milestone:
        goal = db.query(Goal).filter(Goal.id == milestone.goal_id).first()
        if goal and goal.player_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")

    task.completed = True

    # XP logic
    xp_map = {
        "easy": 10,
        "medium": 20,
        "hard": 40
    }

    gained_xp = task.xp if task.xp is not None else xp_map.get(task.difficulty, 10)
    current_user.xp += gained_xp
    current_user.level = calculate_level(current_user.xp)

    today = date.today()
    last_streak_date = current_user.last_streak_date

    if last_streak_date != today:
        if last_streak_date == today - timedelta(days=1):
            current_user.streak += 1
        else:
            current_user.streak = 1
        current_user.last_streak_date = today

    if milestone:
        tasks = db.query(Task).filter(Task.milestone_id == milestone.id).all()

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
        "message": "task completed",
        "xp_gained": gained_xp,
        "total_xp": current_user.xp,
        "level": current_user.level,
        "streak": current_user.streak
    }


class SideQuestCompleteRequest(BaseModel):
    xp: int


@router.post("/side_quests/complete")
def complete_side_quest(data: SideQuestCompleteRequest, db: Session = Depends(get_db), current_user: Player = Depends(get_current_user)):

    gained_xp = max(0, int(data.xp))
    current_user.xp += gained_xp
    current_user.level = calculate_level(current_user.xp)

    db.commit()

    return {
        "message": "side quest completed",
        "xp_gained": gained_xp,
        "total_xp": current_user.xp,
        "level": current_user.level,
        "streak": current_user.streak
    }

@router.get("/daily")
def get_daily_tasks(db: Session = Depends(get_db), current_user: Player = Depends(get_current_user)):

    today = date.today()

    # Get user's active milestones
    active_milestones = db.query(Milestone).join(Goal).filter(
        Goal.player_id == current_user.id,
        Milestone.status == "active"
    ).all()

    milestone_ids = [m.id for m in active_milestones]

    if not milestone_ids:
        return []

    tasks = db.query(Task).filter(
        Task.scheduled_date == today,
        Task.milestone_id.in_(milestone_ids)
    ).all()

    if not tasks:
        # Generate tasks passing the user
        tasks = generate_daily_tasks(db, current_user.id)

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


@router.get("/side_quests")
def get_side_quests(current_user: Player = Depends(get_current_user)):
    quests = generate_side_quests()
    # Ensure they have an ID for the frontend mapping
    for i, q in enumerate(quests):
        q["id"] = i + 1
        q["completed"] = False
    return quests

@router.get("/milestones")
def get_milestones(db: Session = Depends(get_db), current_user: Player = Depends(get_current_user)):

    milestones = db.query(Milestone).join(Goal).filter(Goal.player_id == current_user.id).all()

    result = []

    for m in milestones:
        result.append({
            "id": m.id,
            "title": m.title,
            "status": m.status
        })

    return result

@router.get("/{goal_id}/milestones")
def get_goal_milestones(goal_id: int, db: Session = Depends(get_db), current_user: Player = Depends(get_current_user)):

    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.player_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=403, detail="Not authorized")

    milestones = (
        db.query(Milestone)
        .filter(Milestone.goal_id == goal_id)
        .all()
    )

    result = []

    for i, m in enumerate(milestones):

        status = m.status

        result.append({
            "id": m.id,
            "title": m.title,
            "description": "Milestone in your journey",
            "status": status
        })

    return {
        "milestones": result
    }