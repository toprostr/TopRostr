from collections.abc import Sequence
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, Form, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.athletes import (
    POSITION_LABELS,
    STATUS_LABELS,
    AthleteNotFoundError,
    list_athletes,
    list_interested,
    set_recruiting_status,
)
from app.db import get_db
from app.models.athlete import Athlete
from app.schemas.athlete import AthleteResponse, RecruitingDecision

TEMPLATES_DIR = Path(__file__).resolve().parents[2] / "templates"
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
templates.env.globals["positions"] = POSITION_LABELS
templates.env.globals["status_labels"] = STATUS_LABELS

router = APIRouter(tags=["pages"])
DbSession = Annotated[Session, Depends(get_db)]


def _cards(athletes: Sequence[Athlete]) -> list[AthleteResponse]:
    return [AthleteResponse.model_validate(athlete) for athlete in athletes]


@router.get("/", response_class=HTMLResponse)
def recruit_review(request: Request, db: DbSession) -> HTMLResponse:
    return templates.TemplateResponse(
        request,
        "review.html",
        {
            "athletes": _cards(list_athletes(db)),
            "active": "review",
        },
    )


@router.get("/tracker", response_class=HTMLResponse)
def recruiting_tracker(request: Request, db: DbSession) -> HTMLResponse:
    interested = _cards(list_interested(db))
    return templates.TemplateResponse(
        request,
        "tracker.html",
        {
            "athletes": interested,
            "active": "tracker",
        },
    )


@router.post("/athletes/{athlete_id}/decision", response_class=HTMLResponse)
def save_decision(
    athlete_id: int,
    request: Request,
    status: Annotated[RecruitingDecision, Form()],
    db: DbSession,
) -> HTMLResponse:
    try:
        athlete = set_recruiting_status(db, athlete_id, status.value)
    except AthleteNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Athlete not found") from exc
    return templates.TemplateResponse(
        request,
        "partials/athlete_card.html",
        {
            "athlete": AthleteResponse.model_validate(athlete),
            "just_saved": True,
        },
    )
