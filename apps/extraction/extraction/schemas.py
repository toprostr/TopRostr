"""Input and result models for recruiting-email extraction.

The result model is the contract in API design §3: every athlete field is
optional and defaults to null. Invalid values become null here so one bad
field is never stored and does not discard the fields that were valid.

Pydantic models and validators:
https://docs.pydantic.dev/latest/concepts/models/
https://docs.pydantic.dev/latest/concepts/validators/
"""

from __future__ import annotations

import re
from typing import Any

from email_validator import EmailNotValidError, validate_email
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    TypeAdapter,
    ValidationError,
    field_validator,
)
from pydantic.networks import HttpUrl

# Wider than the saved-athlete bounds in apps/api. Extraction only rejects years
# that cannot be a recruiting class; saving a record can apply a tighter rule.
MIN_GRADUATION_YEAR = 1990
MAX_GRADUATION_YEAR = 2045

_UNKNOWN_TEXT = frozenset(
    {
        "",
        "null",
        "none",
        "n/a",
        "na",
        "unknown",
        "not provided",
        "not stated",
        "not specified",
        "-",
        "--",
    }
)
_MAX_NAME_LENGTH = 80
_MAX_POSITION_LENGTH = 40
_MAX_CLUB_LENGTH = 120
_MAX_ACADEMIC_LENGTH = 500
_YEAR_TEXT = re.compile(r"\d{4}")
_URL_ADAPTER = TypeAdapter(HttpUrl)


class ExtractionInput(BaseModel):
    """One recruiting email, already separated from the client that received it.

    Field names match API design §3. The text is already in hand; this model
    does not know which client produced it.
    """

    model_config = ConfigDict(extra="ignore", str_strip_whitespace=True)

    subject: str = Field(max_length=300)
    sender: str = Field(max_length=320)
    body: str = Field(max_length=20_000)


class ExtractionResult(BaseModel):
    """Athlete facts stated in one email. Unstated and invalid fields are null."""

    model_config = ConfigDict(extra="ignore")

    name: str | None = Field(
        default=None,
        description="Athlete's name as written. Null if the email does not state it.",
    )
    email: str | None = Field(
        default=None,
        description="Athlete's email address as written. Null if none is stated.",
    )
    graduation_year: int | None = Field(
        default=None,
        description="Four-digit graduation year stated in the email. Null if absent.",
    )
    position: str | None = Field(
        default=None,
        description="Playing position as written. Null if the email does not state it.",
    )
    club: str | None = Field(
        default=None,
        description="Club or team as written. Null if the email does not state it.",
    )
    film_url: list[str] | None = Field(
        default=None,
        description="Highlight or film links written in the email. Null if there are none.",
    )
    academic_info: str | None = Field(
        default=None,
        description="Academic facts copied from the email. Null if none are stated.",
    )

    @field_validator("name", mode="before")
    @classmethod
    def name_must_be_stated(cls, value: Any) -> str | None:
        return _clean_name(value)

    @field_validator("email", mode="before")
    @classmethod
    def email_must_be_valid_or_null(cls, value: Any) -> str | None:
        return _clean_email(value)

    @field_validator("graduation_year", mode="before")
    @classmethod
    def year_must_be_plausible_or_null(cls, value: Any) -> int | None:
        return _clean_year(value)

    @field_validator("position", mode="before")
    @classmethod
    def position_must_be_stated(cls, value: Any) -> str | None:
        return _clean_position(value)

    @field_validator("club", mode="before")
    @classmethod
    def club_must_be_stated(cls, value: Any) -> str | None:
        return _clean_club(value)

    @field_validator("academic_info", mode="before")
    @classmethod
    def academic_info_must_be_stated(cls, value: Any) -> str | None:
        return _clean_academic(value)

    @field_validator("film_url", mode="before")
    @classmethod
    def film_urls_must_be_http_links_or_null(cls, value: Any) -> list[str] | None:
        return _clean_film_url(value)


def _collapse(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def _as_text(value: Any, *, max_length: int) -> str | None:
    if not isinstance(value, str):
        return None
    collapsed = _collapse(value)
    if collapsed.lower() in _UNKNOWN_TEXT or len(collapsed) > max_length:
        return None
    return collapsed


def _clean_name(value: Any) -> str | None:
    text = _as_text(value, max_length=_MAX_NAME_LENGTH)
    if text is None or any(char.isdigit() for char in text):
        return None
    if "@" in text or _contains_url(text):
        return None
    if not any(char.isalpha() for char in text):
        return None
    return text


def _clean_position(value: Any) -> str | None:
    text = _as_text(value, max_length=_MAX_POSITION_LENGTH)
    if text is None or any(char.isdigit() for char in text):
        return None
    if "@" in text or _contains_url(text) or len(text.split()) > 6:
        return None
    if not any(char.isalpha() for char in text):
        return None
    return text


def _clean_club(value: Any) -> str | None:
    text = _as_text(value, max_length=_MAX_CLUB_LENGTH)
    if text is None or "@" in text or _contains_url(text):
        return None
    if not any(char.isalpha() for char in text):
        return None
    return text


def _clean_academic(value: Any) -> str | None:
    text = _as_text(value, max_length=_MAX_ACADEMIC_LENGTH)
    if text is None:
        return None
    if not any(char.isalpha() or char.isdigit() for char in text):
        return None
    return text


def _clean_email(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    candidate = _collapse(value)
    if candidate.lower() in _UNKNOWN_TEXT:
        return None
    try:
        # No DNS lookup: deliverability checks would turn extraction into a
        # network call and could change results between machines.
        return validate_email(candidate, check_deliverability=False).normalized
    except EmailNotValidError:
        return None


def _clean_year(value: Any) -> int | None:
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, int):
        year = value
    elif isinstance(value, str):
        candidate = _collapse(value)
        if candidate.lower() in _UNKNOWN_TEXT or not _YEAR_TEXT.fullmatch(candidate):
            return None
        year = int(candidate)
    else:
        return None
    if year < MIN_GRADUATION_YEAR or year > MAX_GRADUATION_YEAR:
        return None
    return year


def _clean_film_url(value: Any) -> list[str] | None:
    if value is None:
        return None
    raw_items: list[Any]
    if isinstance(value, str):
        raw_items = [value]
    elif isinstance(value, list):
        raw_items = value
    else:
        return None

    urls: list[str] = []
    seen: set[str] = set()
    for item in raw_items:
        if not isinstance(item, str):
            continue
        candidate = item.strip().rstrip(".,);>")
        if not candidate or candidate.lower() in _UNKNOWN_TEXT:
            continue
        normalized = _valid_http_url(candidate)
        if normalized is None or normalized in seen:
            continue
        seen.add(normalized)
        urls.append(normalized)
    return urls or None


def _valid_http_url(candidate: str) -> str | None:
    try:
        parsed = _URL_ADAPTER.validate_python(candidate)
    except ValidationError:
        return None
    if parsed.scheme not in {"http", "https"}:
        return None
    if parsed.username or parsed.password:
        return None
    return str(parsed)


def _contains_url(value: str) -> bool:
    lowered = value.lower()
    return "http://" in lowered or "https://" in lowered
