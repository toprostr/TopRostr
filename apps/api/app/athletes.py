from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.athlete import Athlete
from app.schemas.athlete import RecruitingStatus

POSITION_LABELS = {
    "GK": "Goalkeeper",
    "CB": "Center Back",
    "LB": "Left Back",
    "RB": "Right Back",
    "CDM": "Defensive Mid",
    "CM": "Center Mid",
    "W": "Winger",
    "ST": "Striker",
}

STATUS_LABELS = {
    "unreviewed": "Unreviewed",
    "interested": "Interested",
    "review_later": "Review later",
    "pass": "Pass",
}

NOTES_MAX_LENGTH = 2000


class AthleteNotFoundError(Exception):
    def __init__(self, athlete_id: int) -> None:
        self.athlete_id = athlete_id
        super().__init__(f"Athlete {athlete_id} not found")


class NotesTooLongError(Exception):
    """Coach notes are longer than the athletes.notes column allows."""

    def __init__(self, length: int) -> None:
        self.length = length
        super().__init__(f"Notes are limited to {NOTES_MAX_LENGTH} characters")


def list_athletes(db: Session) -> list[Athlete]:
    return list(db.scalars(select(Athlete).order_by(Athlete.id)))


def list_interested(db: Session) -> list[Athlete]:
    statement = (
        select(Athlete)
        .where(Athlete.status == RecruitingStatus.INTERESTED.value)
        .order_by(Athlete.id)
    )
    return list(db.scalars(statement))


def set_recruiting_status(
    db: Session,
    athlete_id: int,
    status: str,
    notes: str | None = None,
) -> Athlete:
    """Save a coach's decision.

    ``notes`` is optional so the JSON status route can change a decision
    without touching notes. When the form sends the field, including an
    empty textarea, the stored note is replaced.
    """
    athlete = db.get(Athlete, athlete_id)
    if athlete is None:
        raise AthleteNotFoundError(athlete_id)
    athlete.status = status
    if notes is not None:
        athlete.notes = _clean_notes(notes)
    db.commit()
    db.refresh(athlete)
    return athlete


def _clean_notes(notes: str) -> str | None:
    cleaned = notes.strip()
    if len(cleaned) > NOTES_MAX_LENGTH:
        raise NotesTooLongError(len(cleaned))
    return cleaned or None


def delete_athletes_by_email(db: Session, emails: list[str]) -> None:
    db.execute(delete(Athlete).where(Athlete.email.in_(emails)))
    db.commit()
