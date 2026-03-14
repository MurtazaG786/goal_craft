from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.core.database import Base, engine
from app.routers import goal_routes


@asynccontextmanager
async def lifespan(app: FastAPI):

    print("⚠ Resetting database...")

    # Drop all tables
    Base.metadata.drop_all(bind=engine)

    # Recreate tables
    Base.metadata.create_all(bind=engine)

    print("✅ Database recreated")

    yield


app = FastAPI(lifespan=lifespan)

# routers
app.include_router(goal_routes.router, prefix="/goal", tags=["Goal"])

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)