import random
from datetime import date
from sqlalchemy.orm import Session

from app.models.task import Task
from app.models.milestone import Milestone


SELF_IMPROVEMENT_TASKS = [
    "10 minute meditation",
    "Stretch for 5 minutes",
    "Read 5 pages of a book",
    "Write a quick journal entry",
    "Take a 10 minute walk"
]

FUN_TASKS = [
    "Watch a short inspiring tech talk",
    "Explore a new tool related to your goal",
    "Sketch your next big idea",
    "Listen to a productivity podcast"
]


def generate_daily_tasks(db: Session):

    today = date.today()

    # find active milestone
    milestone = db.query(Milestone).filter(
        Milestone.status == "active"
    ).first()

    if not milestone:
        return []

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

    # self improvement task
    daily_tasks.append(
        Task(
            milestone_id=milestone.id,
            title=random.choice(SELF_IMPROVEMENT_TASKS),
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
            title=random.choice(FUN_TASKS),
            difficulty="easy",
            xp=10,
            type="fun",
            scheduled_date=today
        )
    )

    for task in daily_tasks:
        db.add(task)

    db.commit()

    return daily_tasks