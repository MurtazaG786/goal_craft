from fastapi import FastAPI
import os
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
from app.routers import goal

app=FastAPI(title="Goal Craft")

app.include_router(goal.router, prefix="/goal")