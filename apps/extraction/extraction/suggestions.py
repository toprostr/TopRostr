"""Turn a coach's note into suggestions they can confirm.

This sits beside email extraction. It does not read an inbox, write a
database, contact anyone, or score talent. The API saves a suggestion only
after the coach checks it and clicks Confirm.
"""

from __future__ import annotations

import logging
import re
from enum import StrEnum
from typing import Any, Protocol, runtime_checkable

from pydantic import BaseModel, ConfigDict, field_validator

logger = logging.getLogger(__name__)

_MAX_LABEL_LENGTH = 80
_MAX_ACTIONS = 5
_BLOCKED_LABEL = re.compile(
    r"\b(?:score|scores|rank|ranks|ranking|ranked|rating|rated)\b",
    re.IGNORECASE,
)
# A completed outreach is not a suggestion. The coach still has to do the task.
_ALREADY_CONTACTED = re.compile(
    r"\b(?:sent|emailed|texted|messaged|called|contacted)\b",
    re.IGNORECASE,
)
_PASS = re.compile(r"\b(?:not interested|pass|not a fit)\b", re.IGNORECASE)
_LATER = re.compile(
    r"\breview later\b|\brevisit\b|\bsecond look\b|\bcircle back\b",
    re.IGNORECASE,
)
_INTERESTED = re.compile(r"\binterested\b|\bpursue\b|\boffer\b", re.IGNORECASE)
_CAMP = re.compile(r"\b(?:summer camp|camp)\b", re.IGNORECASE)
_VISIT = re.compile(r"\bcampus visit\b|\bvisit\b", re.IGNORECASE)
_CALL = re.compile(r"\bphone\b|\bcall\b", re.IGNORECASE)
_FOOTAGE = re.compile(
    r"\b(?:footage|full-game|full game|highlight|film)\b",
    re.IGNORECASE,
)
_DRAFT = re.compile(
    r"\b(?:ask|invite|email|write|draft|reach out)\b",
    re.IGNORECASE,
)


class SuggestedInterest(StrEnum):
    """A decision the note states. The coach still has to confirm it."""

    INTERESTED = "interested"
    REVIEW_LATER = "review_later"
    PASS = "pass"


class RecruitingSuggestions(BaseModel):
    """Suggested interest, one engagement, and next actions.

    Extra fields are ignored. A label that scores talent or claims the
    program already made contact is dropped instead of stored.
    """

    model_config = ConfigDict(extra="ignore")

    interest: SuggestedInterest | None = None
    engagement: str | None = None
    next_actions: list[str] = []

    @field_validator("interest", mode="before")
    @classmethod
    def interest_must_be_a_decision_or_null(cls, value: Any) -> str | None:
        if not isinstance(value, str):
            return None
        cleaned = value.strip().lower()
        if cleaned in {item.value for item in SuggestedInterest}:
            return cleaned
        return None

    @field_validator("engagement", mode="before")
    @classmethod
    def engagement_must_be_a_safe_label(cls, value: Any) -> str | None:
        return _safe_label(value)

    @field_validator("next_actions", mode="before")
    @classmethod
    def actions_must_be_safe_labels(cls, value: Any) -> list[str]:
        if value is None:
            return []
        raw_items = value if isinstance(value, list) else [value]
        labels: list[str] = []
        for item in raw_items:
            label = _safe_label(item)
            if label is None or label in labels:
                continue
            labels.append(label)
            if len(labels) == _MAX_ACTIONS:
                break
        return labels


@runtime_checkable
class NoteSuggester(Protocol):
    """Interpret one note. Implementations do not save or contact anyone."""

    def suggest(self, notes: str) -> RecruitingSuggestions:
        """Return suggestions grounded in `notes`. Unstated parts stay empty."""
        ...


class FakeNoteSuggester:
    """Rule-based suggester used when `OPENAI_API_KEY` is unset.

    The same note always produces the same suggestions. It copies tasks the
    note actually names. It does not score the athlete.
    """

    def suggest(self, notes: str) -> RecruitingSuggestions:
        text = notes.strip()
        if not text:
            result = RecruitingSuggestions()
        else:
            result = RecruitingSuggestions(
                interest=_interest(text),
                engagement=_engagement(text),
                next_actions=_actions(text),
            )
        log_suggestions("fake", result)
        return result


def log_suggestions(
    suggester_name: str,
    result: RecruitingSuggestions,
    *,
    model: str | None = None,
) -> None:
    """Record that suggestions were produced without recording the note.

    Counts and booleans are not the note, the labels, or a secret. Labels can
    echo the coach's words, so they stay out of the log too.
    """

    if model is None:
        logger.info(
            "suggestions ready suggester=%s interest=%s engagement=%s actions=%s",
            suggester_name,
            result.interest is not None,
            result.engagement is not None,
            len(result.next_actions),
        )
        return
    logger.info(
        "suggestions ready suggester=%s model=%s interest=%s engagement=%s actions=%s",
        suggester_name,
        model,
        result.interest is not None,
        result.engagement is not None,
        len(result.next_actions),
    )


def _safe_label(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    collapsed = re.sub(r"\s+", " ", value).strip()
    if not collapsed or len(collapsed) > _MAX_LABEL_LENGTH:
        return None
    if _BLOCKED_LABEL.search(collapsed) or _ALREADY_CONTACTED.search(collapsed):
        return None
    return collapsed


def _interest(text: str) -> SuggestedInterest | None:
    if _PASS.search(text):
        return SuggestedInterest.PASS
    if _LATER.search(text):
        return SuggestedInterest.REVIEW_LATER
    if _INTERESTED.search(text):
        return SuggestedInterest.INTERESTED
    return None


def _engagement(text: str) -> str | None:
    if _CAMP.search(text):
        return "Summer camp invitation"
    if _VISIT.search(text):
        return "Campus visit"
    if _CALL.search(text):
        return "Intro call"
    return None


def _actions(text: str) -> list[str]:
    actions: list[str] = []
    if _FOOTAGE.search(text):
        actions.append("Request full-game footage")
    if _CAMP.search(text):
        actions.append("Add to summer camp list")
    if _DRAFT.search(text):
        actions.append("Prepare communication draft")
    return actions
