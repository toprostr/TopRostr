from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.athletes import (
    AthleteNotFoundError,
    list_athletes,
    list_interested,
    set_recruiting_status,
)
from app.db import get_db
from app.schemas.athlete import AthleteResponse, AthleteStatusUpdate

router = APIRouter(prefix="/api/v1", tags=["athletes"])
DbSession = Annotated[Session, Depends(get_db)]


@router.get("/athletes", response_model=list[AthleteResponse])
def get_athletes(db: DbSession) -> list[AthleteResponse]:
    return [AthleteResponse.model_validate(athlete) for athlete in list_athletes(db)]


@router.patch("/athletes/{athlete_id}/status", response_model=AthleteResponse)
def update_athlete_status(
    athlete_id: int,
    payload: AthleteStatusUpdate,
    db: DbSession,
) -> AthleteResponse:
    try:
        athlete = set_recruiting_status(db, athlete_id, payload.status.value)
    except AthleteNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Athlete not found") from exc
    return AthleteResponse.model_validate(athlete)


@router.get("/tracker", response_model=list[AthleteResponse])
def get_tracker(db: DbSession) -> list[AthleteResponse]:
    return [AthleteResponse.model_validate(athlete) for athlete in list_interested(db)]
