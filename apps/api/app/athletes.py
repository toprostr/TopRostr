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
    "review_later": "Review Later",
    "pass": "Pass",
}


class AthleteNotFoundError(Exception):
    def __init__(self, athlete_id: int) -> None:
        self.athlete_id = athlete_id
        super().__init__(f"Athlete {athlete_id} not found")


def list_athletes(db: Session) -> list[Athlete]:
    return list(db.scalars(select(Athlete).order_by(Athlete.id)))


def list_interested(db: Session) -> list[Athlete]:
    statement = (
        select(Athlete)
        .where(Athlete.status == RecruitingStatus.INTERESTED.value)
        .order_by(Athlete.id)
    )
    return list(db.scalars(statement))


def set_recruiting_status(db: Session, athlete_id: int, status: str) -> Athlete:
    athlete = db.get(Athlete, athlete_id)
    if athlete is None:
        raise AthleteNotFoundError(athlete_id)
    athlete.status = status
    db.commit()
    db.refresh(athlete)
    return athlete


def delete_athletes_by_email(db: Session, emails: list[str]) -> None:
    db.execute(delete(Athlete).where(Athlete.email.in_(emails)))
    db.commit()
