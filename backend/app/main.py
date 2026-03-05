from fastapi import FastAPI
from app.routers import goal

app=FastAPI(title="Goal Craft")

app.include_router(goal.router, prefix="/goal")