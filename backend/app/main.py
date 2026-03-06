from fastapi import FastAPI
import os
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
from app.routers import goal_routes
from app.core.database import engine, Base
from app.models.milestone import Milestone
from app.models.task import Task
from app.models import goal

app=FastAPI(title="Goal Craft")

app.include_router(goal_routes.router, prefix="/goal")

Base.metadata.create_all(bind=engine)
