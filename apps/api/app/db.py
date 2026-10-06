from collections.abc import Generator
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# Always apps/api/toprostr.db, even if a command is started from the repo root.
DB_PATH = Path(__file__).resolve().parents[1] / "toprostr.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session]:
    """Request-scoped database session.

    FastAPI calls this once per request, injects the yielded Session into
    the route, and runs the finally block after the response is sent.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
