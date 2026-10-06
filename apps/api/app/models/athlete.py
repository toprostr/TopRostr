from sqlalchemy import Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class Athlete(Base):
    """Persisted recruit. Status values are enforced by the API, not the database."""

    __tablename__ = "athletes"

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(80))
    last_name: Mapped[str] = mapped_column(String(80))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    graduation_year: Mapped[int]
    primary_position: Mapped[str] = mapped_column(String(8))
    club_team: Mapped[str] = mapped_column(String(120))
    gpa: Mapped[float | None] = mapped_column(Float, nullable=True)
    highlight_reel_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    location: Mapped[str | None] = mapped_column(String(120), nullable=True)
    notes: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    engagement: Mapped[str | None] = mapped_column(String(200), nullable=True)
    next_action: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(
        String(32),
        default="unreviewed",
        server_default="unreviewed",
    )
