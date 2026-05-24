import json
import random
from datetime import date
from sqlalchemy.orm import Session

from app.models.task import Task
from app.models.milestone import Milestone
from app.models.goal import Goal
from app.services.ai.planner import client
from app.services.ai.side_quest_agent import generate_side_quests
from app.core.config import settings


def generate_daily_tasks(db: Session, user_id: int):
    today = date.today()

    # find active milestones for user
    active_milestones = db.query(Milestone).join(Goal).filter(
        Goal.player_id == user_id,
        Milestone.status == "active"
    ).all()

    if not active_milestones:
        return []

    milestone = active_milestones[0]
    goal = db.query(Goal).filter(Goal.id == milestone.goal_id).first()

    # unfinished goal tasks
    goal_tasks = db.query(Task).filter(
        Task.milestone_id == milestone.id,
        Task.type == "goal",
        Task.completed == False
    ).limit(3).all()

    daily_tasks = []

    for t in goal_tasks:
        t.scheduled_date = today
        daily_tasks.append(t)

    # Use AI to generate 1 self-improvement and 1 fun task based on the goal
    prompt = f"""
    You are a daily quest generator for a gamified productivity app.
    The user is currently working on the goal: "{goal.goal_text}".
    Their current milestone is: "{milestone.title}".

    Generate 2 short, highly engaging, dynamic daily tasks to help them stay motivated today:
    1. A "self" improvement task (e.g., related to mental health, physical health, or learning).
    2. A "fun" task (e.g., related to creativity, inspiration, or taking a healthy break).

    Return ONLY valid JSON in this format:
    {{
        "self_task": "task description",
        "fun_task": "task description"
    }}
    """

    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt
        )
        text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)

        self_task_title = data.get("self_task", "Take a 10 minute walk to clear your mind")
        fun_task_title = data.get("fun_task", "Listen to an inspiring podcast for 15 minutes")
    except Exception as e:
        print("Error generating dynamic daily tasks:", e)
        self_task_title = "Take a 10 minute walk to clear your mind"
        fun_task_title = "Listen to an inspiring podcast for 15 minutes"

    # self improvement task
    daily_tasks.append(
        Task(
            milestone_id=milestone.id,
            title=self_task_title,
            difficulty="easy",
            xp=10,
            type="self",
            scheduled_date=today
        )
    )

    # fun task
    daily_tasks.append(
        Task(
            milestone_id=milestone.id,
            title=fun_task_title,
            difficulty="easy",
            xp=10,
            type="fun",
            scheduled_date=today
        )
    )

    side_quests = generate_side_quests()
    if side_quests:
        picked = random.sample(side_quests, k=min(2, len(side_quests)))
        for quest in picked:
            difficulty = quest.get("difficulty", "Easy").lower()
            if difficulty not in ["easy", "medium", "hard"]:
                difficulty = "easy"
            daily_tasks.append(
                Task(
                    milestone_id=milestone.id,
                    title=quest.get("title", "Side Quest"),
                    difficulty=difficulty,
                    xp=int(quest.get("xpReward", 20)),
                    type="side",
                    scheduled_date=today
                )
            )

    for task in daily_tasks:
        db.add(task)

    db.commit()

    return daily_tasks