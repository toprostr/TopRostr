"""Deterministic extractor for tests and for local runs without an API key.

It copies facts that match an explicit label or phrase. It does not infer a
missing fact from a similar email, and it does not score the athlete. The
result model still has the last word: a matched value that is not actually a
valid email or graduation year becomes null.
"""

from __future__ import annotations

import re
from urllib.parse import urlparse

from extraction.extractor import log_extraction
from extraction.schemas import ExtractionInput, ExtractionResult

_LABELS = {
    "name": "name",
    "email": "email",
    "e-mail": "email",
    "graduation year": "graduation_year",
    "grad year": "graduation_year",
    "class of": "graduation_year",
    "position": "position",
    "club": "club",
    "team": "club",
    "academics": "academic_info",
    "academic info": "academic_info",
    "academic information": "academic_info",
    "gpa": "academic_info",
}
_FILM_LABELS = frozenset(
    {"film", "films", "highlights", "highlight film", "highlight films", "hudl"}
)
_FILM_HOST_SUFFIXES = (".hudl.com", ".youtube.com", ".vimeo.com")
_FILM_HOSTS = frozenset(
    {
        "hudl.com",
        "youtube.com",
        "youtu.be",
        "vimeo.com",
        "www.hudl.com",
        "www.youtube.com",
        "www.vimeo.com",
    }
)
_POSITION_CODES = frozenset(
    {
        "GK",
        "CB",
        "LB",
        "RB",
        "LWB",
        "RWB",
        "CDM",
        "CM",
        "CAM",
        "LM",
        "RM",
        "LW",
        "RW",
        "ST",
        "CF",
        "WB",
        "SS",
    }
)
# Phrases that mean a position even without "I am a" in front of them.
_POSITION_PHRASES = (
    "goalkeeper",
    "centre back",
    "center back",
    "left back",
    "right back",
    "left wing back",
    "right wing back",
    "defensive midfielder",
    "central midfielder",
    "attacking midfielder",
    "left winger",
    "right winger",
    "center forward",
    "centre forward",
    "wing back",
    "striker",
)
# These words also appear in ordinary sentences ("looking forward").
_AMBIGUOUS_POSITIONS = ("forward", "winger", "keeper")
_NAME_STOP_WORDS = frozenset({"and", "i", "from", "who", "a", "an", "the", "at", "of"})

_LABEL_RE = re.compile(r"^\s*([A-Za-z][A-Za-z -]{0,40}?)\s*:\s*(.*?)\s*$")
_URL_RE = re.compile(r"https?://[^\s<>\"']+")
_EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b")
_YEAR_PROSE_RE = re.compile(
    r"\b(?:class of|graduating in|graduation year(?: is)?|i am an?)\s+(20\d{2})\b",
    re.IGNORECASE,
)
_CLUB_PROSE_RE = re.compile(r"\bplay(?:ing)? for\s+([^.,!\n…]+)", re.IGNORECASE)
_GPA_RE = re.compile(r"\b\d\.\d{1,2}\s*GPA\b", re.IGNORECASE)
_TEST_RE = re.compile(
    r"\b(?:(?:SAT|ACT)\s*(?:score\s*)?(?:of\s*)?\d{2,4}|\d{2,4}\s*(?:SAT|ACT))\b",
    re.IGNORECASE,
)
_FIRST_PERSON_RE = re.compile(r"\bmy name is\b|\bi am an?\b", re.IGNORECASE)
_SUBJECT_RE = re.compile(
    r"^(?P<year>20\d{2})\s+(?P<position>[A-Za-z]{2,4})"
    r"\s+[-–—]\s+(?P<name>[A-Za-z][A-Za-z'’.-]*"
    r"(?:\s+[A-Za-z][A-Za-z'’.-]*)+)\s*$"
)
_AMBIGUOUS_CONTEXT_RE = re.compile(
    r"\b(?:position\s*(?:is|:)|playing as an?|i am an?)\s+(?:\d{4}\s+)?$",
    re.IGNORECASE,
)


class FakeExtractor:
    """Rule-based extractor. The same email always produces the same result."""

    def extract(self, message: ExtractionInput) -> ExtractionResult:
        labeled = _labeled_values(message.body)
        subject_year, subject_position, subject_name = _from_subject(message.subject)
        result = ExtractionResult(
            name=_prefer_text(
                labeled, "name", _name_from_prose(message.body), subject_name
            ),
            email=_email(message, labeled),
            graduation_year=_year(message, labeled, subject_year),
            position=_prefer_text(
                labeled,
                "position",
                _position_from_prose(message.body),
                subject_position,
            ),
            club=_prefer_text(labeled, "club", _club_from_prose(message.body), None),
            academic_info=_academic(message.body, labeled),
            film_url=_film_urls(message.body),
        )
        log_extraction("fake", result)
        return result


def _collapse(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def _labeled_values(body: str) -> dict[str, str]:
    found: dict[str, str] = {}
    for raw_label, value in _iter_labels(body):
        key = _LABELS.get(_collapse(raw_label).lower())
        if key is None or key in found:
            continue
        found[key] = value
    return found


def _iter_labels(body: str) -> list[tuple[str, str]]:
    pairs: list[tuple[str, str]] = []
    for line in body.replace("\r\n", "\n").splitlines():
        match = _LABEL_RE.match(line)
        if match is None:
            continue
        pairs.append((match.group(1), match.group(2)))
    return pairs


def _prefer_text(
    labeled: dict[str, str],
    key: str,
    prose: str | None,
    fallback: str | None,
) -> str | None:
    if key in labeled and _collapse(labeled[key]):
        return _collapse(labeled[key])
    if prose:
        return prose
    return fallback


def _email(message: ExtractionInput, labeled: dict[str, str]) -> str | None:
    if "email" in labeled and _collapse(labeled["email"]):
        # Pass the labeled text through even when it is not an email. The
        # result model turns it into null, and we do not replace it with the
        # sender: the email tried to state an address and got it wrong.
        return _collapse(labeled["email"])
    found = _EMAIL_RE.findall(message.body)
    if len(found) == 1:
        return found[0]
    if len(found) > 1:
        return None
    if _FIRST_PERSON_RE.search(message.body):
        return message.sender
    return None


def _year(
    message: ExtractionInput,
    labeled: dict[str, str],
    subject_year: int | None,
) -> int | None:
    if "graduation_year" in labeled and _collapse(labeled["graduation_year"]):
        return _one_year(_collapse(labeled["graduation_year"]))
    prose = _YEAR_PROSE_RE.search(message.body)
    if prose is not None:
        return int(prose.group(1))
    return subject_year


def _one_year(value: str) -> int | None:
    years = re.findall(r"\b(\d{4})\b", value)
    if len(years) != 1:
        return None
    return int(years[0])


def _academic(body: str, labeled: dict[str, str]) -> str | None:
    if "academic_info" in labeled and _collapse(labeled["academic_info"]):
        return _collapse(labeled["academic_info"])
    matches: list[tuple[int, str]] = []
    for pattern in (_GPA_RE, _TEST_RE):
        matches.extend(
            (match.start(), _collapse(match.group(0)))
            for match in pattern.finditer(body)
        )
    if not matches:
        return None
    ordered: list[str] = []
    for _, text in sorted(matches):
        if text not in ordered:
            ordered.append(text)
    return "; ".join(ordered)


def _name_from_prose(body: str) -> str | None:
    # The period is not part of the word, so "John Smith." does not keep the dot.
    word = r"[A-Za-z][A-Za-z'’-]*"
    match = re.search(rf"\bmy name is\s+({word})", body, re.IGNORECASE)
    if match is None:
        return None
    words = [match.group(1)]
    rest = body[match.end() :]
    while len(words) < 4:
        next_word = re.match(rf"\s+({word})", rest)
        if next_word is None or next_word.group(1).lower() in _NAME_STOP_WORDS:
            break
        words.append(next_word.group(1))
        rest = rest[next_word.end() :]
    return _collapse(" ".join(words))


def _position_from_prose(body: str) -> str | None:
    candidates: list[tuple[int, int, str]] = []
    for phrase in _POSITION_PHRASES:
        for match in re.finditer(rf"\b{re.escape(phrase)}\b", body, re.IGNORECASE):
            original = body[match.start() : match.end()]
            candidates.append((match.start(), -len(original), _collapse(original)))
    if candidates:
        candidates.sort()
        return candidates[0][2]
    for phrase in _AMBIGUOUS_POSITIONS:
        for match in re.finditer(rf"\b{re.escape(phrase)}\b", body, re.IGNORECASE):
            window = body[max(0, match.start() - 40) : match.start()]
            if _AMBIGUOUS_CONTEXT_RE.search(window):
                return _collapse(body[match.start() : match.end()])
    for code in sorted(_POSITION_CODES, key=len, reverse=True):
        if re.search(rf"\b{code}\b", body):
            return code
    return None


def _club_from_prose(body: str) -> str | None:
    match = _CLUB_PROSE_RE.search(body)
    if match is None:
        return None
    return _collapse(match.group(1))


def _from_subject(subject: str) -> tuple[int | None, str | None, str | None]:
    match = _SUBJECT_RE.match(subject.strip())
    if match is None:
        return None, None, None
    position = match.group("position")
    if position.upper() not in _POSITION_CODES:
        return None, None, None
    return int(match.group("year")), position, _collapse(match.group("name"))


def _film_urls(body: str) -> list[str] | None:
    labeled_chunks: list[str] = []
    other_lines: list[str] = []
    for line in body.replace("\r\n", "\n").splitlines():
        match = _LABEL_RE.match(line)
        if match is not None and _collapse(match.group(1)).lower() in _FILM_LABELS:
            labeled_chunks.append(match.group(2))
        else:
            other_lines.append(line)

    urls: list[str] = []
    for chunk in labeled_chunks:
        urls.extend(_URL_RE.findall(chunk))
    for line in other_lines:
        for url in _URL_RE.findall(line):
            if _is_film_host(url):
                urls.append(url)
    return urls or None


def _is_film_host(url: str) -> bool:
    host = (urlparse(url).hostname or "").lower()
    if host in _FILM_HOSTS:
        return True
    return any(host.endswith(suffix) for suffix in _FILM_HOST_SUFFIXES)
