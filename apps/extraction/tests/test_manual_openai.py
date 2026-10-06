"""Manual check against the live OpenAI API.

Skipped unless OPENAI_API_KEY is set. CI does not set that variable, so this
module never calls OpenAI in CI. Run it on purpose:

    OPENAI_API_KEY=... uv run pytest -m manual

The assertions are structural. Exact wording still varies between model
snapshots; the fixture file is the accuracy check for the fake extractor.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

import pytest

from extraction.factory import build_extractor
from extraction.openai_extractor import OpenAIExtractor
from extraction.schemas import ExtractionInput, ExtractionResult

pytestmark = pytest.mark.skipif(
    not os.environ.get("OPENAI_API_KEY"),
    reason="Manual OpenAI test. Set OPENAI_API_KEY to run it. Skipped in CI.",
)

_ALL_NULL = {
    "name": None,
    "email": None,
    "graduation_year": None,
    "position": None,
    "club": None,
    "film_url": None,
    "academic_info": None,
}
_CASES = json.loads(
    (Path(__file__).parent / "fixtures" / "recruiting_emails.json").read_text(
        encoding="utf-8"
    )
)


@pytest.mark.manual
@pytest.mark.parametrize("case", _CASES, ids=lambda case: case["id"])
def test_live_openai_client_accepts_each_fixture(case: dict[str, object]) -> None:
    raw_input = case["input"]
    assert isinstance(raw_input, dict)
    extractor = build_extractor()
    assert isinstance(extractor, OpenAIExtractor)

    result = extractor.extract(ExtractionInput.model_validate(raw_input))

    assert isinstance(result, ExtractionResult)
    if case["id"] in {"no_athlete_info", "malformed_short"}:
        assert result.model_dump(mode="json") == _ALL_NULL
