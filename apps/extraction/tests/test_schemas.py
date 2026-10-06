import json

import pytest
from pydantic import ValidationError

from extraction.schemas import (
    MAX_GRADUATION_YEAR,
    MIN_GRADUATION_YEAR,
    ExtractionInput,
    ExtractionResult,
)


def test_result_defaults_are_null() -> None:
    dumped = ExtractionResult().model_dump(mode="json")

    assert dumped == {
        "name": None,
        "email": None,
        "graduation_year": None,
        "position": None,
        "club": None,
        "film_url": None,
        "academic_info": None,
    }
    assert json.loads(ExtractionResult().model_dump_json()) == dumped


def test_result_schema_marks_every_field_nullable() -> None:
    schema = ExtractionResult.model_json_schema()

    assert set(schema["properties"]) == {
        "name",
        "email",
        "graduation_year",
        "position",
        "club",
        "film_url",
        "academic_info",
    }
    for name, prop in schema["properties"].items():
        assert "null" in json.dumps(prop), name


def test_input_requires_subject_sender_and_body() -> None:
    message = ExtractionInput(
        subject="2028 GK - John Smith",
        sender="john@example.com",
        body="Coach, my name is John Smith.",
    )

    assert message.subject == "2028 GK - John Smith"
    with pytest.raises(ValidationError):
        ExtractionInput.model_validate({"subject": "Hi", "sender": "a@example.com"})


def test_input_strips_whitespace_and_ignores_unknown_keys() -> None:
    message = ExtractionInput.model_validate(
        {
            "subject": "  Hello  ",
            "sender": "  a@example.com  ",
            "body": "  Hi  ",
            "mailbox": "ignored",
        }
    )

    assert message.subject == "Hello"
    assert message.sender == "a@example.com"
    assert message.body == "Hi"


def test_invalid_email_becomes_null() -> None:
    result = ExtractionResult(name="Priya Shah", email="priya-at-example")

    assert result.name == "Priya Shah"
    assert result.email is None


def test_unknown_placeholder_text_becomes_null() -> None:
    result = ExtractionResult(
        name="N/A",
        email="unknown",
        position="null",
        club="not provided",
        academic_info="none",
    )

    assert result.name is None
    assert result.email is None
    assert result.position is None
    assert result.club is None
    assert result.academic_info is None


def test_email_domain_is_normalized_without_a_network_lookup() -> None:
    result = ExtractionResult(email="Jordan.Lee@Example.com")

    assert result.email == "Jordan.Lee@example.com"


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        (2028, 2028),
        ("2028", 2028),
        (MIN_GRADUATION_YEAR, MIN_GRADUATION_YEAR),
        (MAX_GRADUATION_YEAR, MAX_GRADUATION_YEAR),
        (MIN_GRADUATION_YEAR - 1, None),
        (MAX_GRADUATION_YEAR + 1, None),
        (1899, None),
        ("1899", None),
        ("spring", None),
        ("2026 or 2027", None),
        (True, None),
        (2028.5, None),
        ("", None),
    ],
)
def test_impossible_graduation_year_becomes_null(
    raw: object, expected: int | None
) -> None:
    result = ExtractionResult(graduation_year=raw)  # type: ignore[arg-type]

    assert result.graduation_year == expected


def test_empty_and_invalid_film_links_become_null() -> None:
    assert ExtractionResult(film_url=[]).film_url is None
    assert ExtractionResult.model_validate({"film_url": "not-a-link"}).film_url is None
    assert ExtractionResult(film_url=["not-a-link", ""]).film_url is None


def test_film_links_keep_valid_urls_and_drop_the_rest() -> None:
    result = ExtractionResult(
        film_url=[
            "https://www.hudl.com/video/one",
            "not-a-link",
            "https://www.hudl.com/video/one",
            "https://youtu.be/two",
        ]
    )

    assert result.film_url == [
        "https://www.hudl.com/video/one",
        "https://youtu.be/two",
    ]


def test_result_ignores_fields_outside_the_contract() -> None:
    result = ExtractionResult.model_validate(
        {"name": "Ada", "ranking": 1, "contact_athlete": True}
    )

    assert result.name == "Ada"
    assert "ranking" not in result.model_dump()
