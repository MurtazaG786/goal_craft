import os
from dotenv import load_dotenv
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
load_dotenv(os.path.join(BASE_DIR, ".env"))
load_dotenv()

class initiate:
    GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")
    DATABASE_URL=os.getenv("DATABASE_URL")

settings=initiate()
