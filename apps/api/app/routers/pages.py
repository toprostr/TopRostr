from collections.abc import Sequence
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, Form, HTTPException, Query, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.athletes import (
    POSITION_LABELS,
    STATUS_LABELS,
    AthleteNotFoundError,
    NotesTooLongError,
    list_athletes,
    set_recruiting_status,
)
from app.db import get_db
from app.film import youtube_embed_url
from app.models.athlete import Athlete
from app.schemas.athlete import AthleteResponse, RecruitingDecision

TEMPLATES_DIR = Path(__file__).resolve().parents[2] / "templates"
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
templates.env.globals["positions"] = POSITION_LABELS
templates.env.globals["status_labels"] = STATUS_LABELS
templates.env.globals["youtube_embed_url"] = youtube_embed_url

router = APIRouter(tags=["pages"])
DbSession = Annotated[Session, Depends(get_db)]

# Tabs on the tracker. "all" is a view, not a stored status.
TRACKER_FILTERS = frozenset({"interested", "review_later", "pass", "all"})


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
def recruiting_tracker(
    request: Request,
    db: DbSession,
    status: Annotated[str, Query()] = "interested",
) -> HTMLResponse:
    status_filter = status if status in TRACKER_FILTERS else "interested"
    return templates.TemplateResponse(
        request,
        "tracker.html",
        {
            "athletes": _cards(list_athletes(db)),
            "active": "tracker",
            "status_filter": status_filter,
        },
    )


@router.post("/athletes/{athlete_id}/decision", response_class=HTMLResponse)
def save_decision(
    athlete_id: int,
    request: Request,
    status: Annotated[RecruitingDecision, Form()],
    db: DbSession,
    notes: Annotated[str | None, Form()] = None,
) -> HTMLResponse:
    try:
        athlete = set_recruiting_status(db, athlete_id, status.value, notes=notes)
    except AthleteNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Athlete not found") from exc
    except NotesTooLongError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return templates.TemplateResponse(
        request,
        "partials/recruit_card.html",
        {
            "athlete": AthleteResponse.model_validate(athlete),
            "just_saved": True,
        },
    )
