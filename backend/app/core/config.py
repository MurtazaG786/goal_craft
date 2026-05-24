import os
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
load_dotenv(os.path.join(BASE_DIR, ".env"))
load_dotenv()


def _parse_csv(value: str | None, default: list[str]) -> list[str]:
    if value is None:
        return default
    items = [item.strip() for item in value.split(",")]
    return [item for item in items if item]


def _parse_bool(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


class Settings:
    """Centralized application configuration loaded from environment variables."""

    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./goalcraft.db")

    # App
    ENV: str = os.getenv("ENV", "development")
    ENABLE_DOCS: bool = _parse_bool(os.getenv("ENABLE_DOCS"), ENV != "production")

    # Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 7)))

    # AI Model
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.0-flash")

    # CORS
    CORS_ORIGINS: list[str] = _parse_csv(os.getenv("CORS_ORIGINS"), ["*"])
    CORS_ALLOW_CREDENTIALS: bool = _parse_bool(os.getenv("CORS_ALLOW_CREDENTIALS"), True)

    # Allowed hosts
    ALLOWED_HOSTS: list[str] = _parse_csv(os.getenv("ALLOWED_HOSTS"), [])


settings = Settings()
