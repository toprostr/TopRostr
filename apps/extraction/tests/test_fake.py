import json
import logging
from pathlib import Path

import pytest

from extraction.fake import FakeExtractor
from extraction.schemas import ExtractionInput

_FIXTURES = Path(__file__).parent / "fixtures" / "recruiting_emails.json"
_CASES = json.loads(_FIXTURES.read_text(encoding="utf-8"))


@pytest.mark.parametrize("case", _CASES, ids=lambda case: case["id"])
def test_fake_matches_fixture_and_leaves_missing_fields_null(
    case: dict[str, object],
) -> None:
    raw_input = case["input"]
    expected = case["expected"]
    assert isinstance(raw_input, dict)
    assert isinstance(expected, dict)

    result = FakeExtractor().extract(ExtractionInput.model_validate(raw_input))
    actual = result.model_dump(mode="json")

    assert actual == expected
    for field, expected_value in expected.items():
        if expected_value is None:
            assert actual[field] is None


def test_fake_is_deterministic() -> None:
    message = ExtractionInput.model_validate(_CASES[0]["input"])
    extractor = FakeExtractor()

    assert extractor.extract(message) == extractor.extract(message)


def test_looking_forward_is_not_a_position() -> None:
    result = FakeExtractor().extract(
        ExtractionInput(
            subject="Hello",
            sender="casey@example.com",
            body="My name is Casey Ng. I am looking forward to hearing from you.",
        )
    )

    assert result.name == "Casey Ng"
    assert result.email == "casey@example.com"
    assert result.position is None
    assert result.graduation_year is None
    assert result.club is None
    assert result.film_url is None
    assert result.academic_info is None


def test_school_website_is_not_film() -> None:
    result = FakeExtractor().extract(
        ExtractionInput(
            subject="Schedule",
            sender="office@riverside.edu",
            body="See https://riverside.edu/schedule for details.",
        )
    )

    assert result.film_url is None
    assert result.email is None


def test_fake_does_not_log_the_email_body(caplog: pytest.LogCaptureFixture) -> None:
    token = "UniqueBodyTokenXYZ"
    message = ExtractionInput(
        subject="Hello",
        sender="casey@example.com",
        body=f"My name is Casey Ng. Club secret {token}. I play for Token FC.",
    )

    with caplog.at_level(logging.INFO):
        FakeExtractor().extract(message)

    assert token not in caplog.text
    assert "Casey Ng" not in caplog.text
    assert "casey@example.com" not in caplog.text
    assert "extractor=fake" in caplog.text
