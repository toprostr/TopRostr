import logging
from collections.abc import Sequence
from pathlib import Path
from typing import Annotated

from extraction.extractor import ExtractionError
from extraction.suggestions import NoteSuggester, RecruitingSuggestions
from fastapi import APIRouter, Depends, Form, HTTPException, Query, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.athletes import (
    NOTES_MAX_LENGTH,
    POSITION_LABELS,
    STATUS_LABELS,
    AthleteNotFoundError,
    NotesTooLongError,
    list_athletes,
    save_confirmed_suggestions,
    set_recruiting_status,
)
from app.db import get_db
from app.film import youtube_embed_url
from app.models.athlete import Athlete
from app.schemas.athlete import AthleteResponse, RecruitingDecision
from app.suggestions import get_suggester

logger = logging.getLogger(__name__)

TEMPLATES_DIR = Path(__file__).resolve().parents[2] / "templates"
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
templates.env.globals["positions"] = POSITION_LABELS
templates.env.globals["status_labels"] = STATUS_LABELS
templates.env.globals["youtube_embed_url"] = youtube_embed_url

router = APIRouter(tags=["pages"])
DbSession = Annotated[Session, Depends(get_db)]
Suggester = Annotated[NoteSuggester, Depends(get_suggester)]

# Tabs on the tracker. "all" is a view, not a stored status.
TRACKER_FILTERS = frozenset({"interested", "review_later", "pass", "all"})


def _cards(athletes: Sequence[Athlete]) -> list[AthleteResponse]:
    return [AthleteResponse.model_validate(athlete) for athlete in athletes]


def _athlete_or_404(db: Session, athlete_id: int) -> Athlete:
    athlete = db.get(Athlete, athlete_id)
    if athlete is None:
        raise HTTPException(status_code=404, detail="Athlete not found")
    return athlete


def _render_card(request: Request, athlete: Athlete, **extra: object) -> HTMLResponse:
    context: dict[str, object] = {
        "athlete": AthleteResponse.model_validate(athlete),
        "just_saved": False,
        "suggestions": None,
        "draft_notes": None,
        "suggestion_message": None,
        "suggestions_saved": False,
    }
    context.update(extra)
    return templates.TemplateResponse(
        request,
        "partials/recruit_card.html",
        context,
    )


def _accepted_interest(value: str | None) -> str | None:
    if value is None or not value.strip():
        return None
    try:
        return RecruitingDecision(value).value
    except ValueError:
        return None


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
    return _render_card(request, athlete, just_saved=True)


@router.get("/athletes/{athlete_id}/card", response_class=HTMLResponse)
def recruit_card(athlete_id: int, request: Request, db: DbSession) -> HTMLResponse:
    """Reload the card from the database. Dismiss uses this and saves nothing."""
    return _render_card(request, _athlete_or_404(db, athlete_id))


@router.post("/athletes/{athlete_id}/suggestions", response_class=HTMLResponse)
def suggest_for_athlete(
    athlete_id: int,
    request: Request,
    db: DbSession,
    suggester: Suggester,
    notes: Annotated[str | None, Form()] = None,
) -> HTMLResponse:
    """Return suggestions for a note. This route does not write."""
    athlete = _athlete_or_404(db, athlete_id)
    draft = notes or ""
    message = _suggestion_message(draft)
    if message is not None:
        return _render_card(
            request,
            athlete,
            draft_notes=draft,
            suggestion_message=message,
        )
    try:
        suggestions = suggester.suggest(draft)
    except ExtractionError:
        # The note and the provider error stay out of the log.
        logger.warning("suggestion failed athlete_id=%s", athlete_id)
        return _render_card(
            request,
            athlete,
            draft_notes=draft,
            suggestion_message="Couldn't read those notes. Nothing was saved.",
        )
    if (
        suggestions.interest is None
        and not suggestions.engagement
        and not suggestions.next_actions
    ):
        return _render_card(
            request,
            athlete,
            draft_notes=draft,
            suggestion_message="No suggestions in that note. Nothing was saved.",
        )
    return _render_card(
        request,
        athlete,
        draft_notes=draft,
        suggestions=suggestions,
    )


@router.post(
    "/athletes/{athlete_id}/suggestions/confirm",
    response_class=HTMLResponse,
)
def confirm_suggestions(
    athlete_id: int,
    request: Request,
    db: DbSession,
    notes: Annotated[str | None, Form()] = None,
    apply_interest: Annotated[str | None, Form()] = None,
    engagement: Annotated[str | None, Form()] = None,
    next_actions: Annotated[list[str] | None, Form()] = None,
) -> HTMLResponse:
    """Save checked suggestions. Unchecked values are not written."""
    _athlete_or_404(db, athlete_id)
    interest = _accepted_interest(apply_interest)
    cleaned = RecruitingSuggestions(
        engagement=engagement,
        next_actions=list(next_actions or []),
    )
    stored_next = "; ".join(cleaned.next_actions) if cleaned.next_actions else None
    try:
        athlete = save_confirmed_suggestions(
            db,
            athlete_id,
            notes=notes,
            interest=interest,
            engagement=cleaned.engagement,
            next_action=stored_next,
        )
    except AthleteNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Athlete not found") from exc
    except NotesTooLongError:
        return _render_card(
            request,
            _athlete_or_404(db, athlete_id),
            draft_notes=notes,
            suggestion_message="Notes are limited to 2000 characters. Nothing was saved.",
        )
    return _render_card(
        request,
        athlete,
        just_saved=interest is not None,
        suggestions_saved=bool(cleaned.engagement or stored_next),
    )


def _suggestion_message(draft: str) -> str | None:
    if not draft.strip():
        return "Add a note so TopRostr can suggest next steps. Nothing was saved."
    if len(draft.strip()) > NOTES_MAX_LENGTH:
        return "Notes are limited to 2000 characters. Nothing was saved."
    return None
