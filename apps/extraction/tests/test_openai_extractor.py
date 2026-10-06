import logging

import pytest
from openai import OpenAIError
from pydantic import SecretStr

from extraction.extractor import ExtractionError
from extraction.openai_extractor import OpenAIExtractor
from extraction.prompt import SYSTEM_PROMPT
from extraction.schemas import ExtractionInput, ExtractionResult


class _Response:
    def __init__(self, parsed: object) -> None:
        self.output_parsed = parsed


def _message() -> ExtractionInput:
    return ExtractionInput(
        subject="2028 GK - John Smith",
        sender="john@example.com",
        body="Coach, my name is John Smith. UniqueBodyTokenXYZ",
    )


def test_openai_extractor_binds_the_result_model_and_forbids_guessing(
    caplog: pytest.LogCaptureFixture,
) -> None:
    calls: list[dict[str, object]] = []

    def parse(**kwargs: object) -> _Response:
        calls.append(kwargs)
        return _Response(ExtractionResult(name="John Smith", graduation_year=2028))

    extractor = OpenAIExtractor(
        api_key=SecretStr("sk-test-not-a-real-key"),
        model="gpt-4o-mini",
        parse=parse,
    )

    with caplog.at_level(logging.DEBUG):
        result = extractor.extract(_message())

    assert result.name == "John Smith"
    assert result.graduation_year == 2028
    assert result.email is None
    assert calls[0]["text_format"] is ExtractionResult
    assert calls[0]["model"] == "gpt-4o-mini"
    assert calls[0]["store"] is False
    messages = calls[0]["input"]
    assert isinstance(messages, list)
    assert messages[0]["content"] == SYSTEM_PROMPT
    assert "Do not guess" in SYSTEM_PROMPT
    assert "return null" in SYSTEM_PROMPT
    assert "UniqueBodyTokenXYZ" in str(messages[1]["content"])
    assert "sk-test-not-a-real-key" not in caplog.text
    assert "UniqueBodyTokenXYZ" not in caplog.text
    assert "John Smith" not in caplog.text


def test_stubbed_extractor_does_not_construct_the_openai_client(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    def explode(*args: object, **kwargs: object) -> None:
        raise AssertionError("OpenAI client must not be constructed in tests")

    monkeypatch.setattr("extraction.openai_extractor.OpenAI", explode)
    extractor = OpenAIExtractor(
        api_key=SecretStr("sk-test-not-a-real-key"),
        model="gpt-4o-mini",
        parse=lambda **kwargs: _Response(ExtractionResult()),
    )

    assert extractor.extract(_message()) == ExtractionResult()


def test_provider_failure_does_not_include_the_email(
    caplog: pytest.LogCaptureFixture,
) -> None:
    def fail(**kwargs: object) -> _Response:
        raise OpenAIError("provider echoed UniqueBodyTokenXYZ sk-test-not-a-real-key")

    extractor = OpenAIExtractor(
        api_key=SecretStr("sk-test-not-a-real-key"),
        model="gpt-4o-mini",
        parse=fail,
    )

    with caplog.at_level(logging.DEBUG), pytest.raises(ExtractionError) as caught:
        extractor.extract(_message())

    assert "UniqueBodyTokenXYZ" not in str(caught.value)
    assert "sk-test-not-a-real-key" not in str(caught.value)
    assert "UniqueBodyTokenXYZ" not in caplog.text
    assert caught.value.__cause__ is None


def test_missing_parsed_output_is_an_extraction_error() -> None:
    extractor = OpenAIExtractor(
        api_key=SecretStr("sk-test-not-a-real-key"),
        model="gpt-4o-mini",
        parse=lambda **kwargs: _Response(None),
    )

    with pytest.raises(ExtractionError, match="did not return"):
        extractor.extract(_message())


def test_invalid_model_output_is_nulled_not_kept() -> None:
    extractor = OpenAIExtractor(
        api_key=SecretStr("sk-test-not-a-real-key"),
        model="gpt-4o-mini",
        parse=lambda **kwargs: _Response(
            {
                "name": "Priya Shah",
                "email": "priya-at-example",
                "graduation_year": 1899,
                "position": "CM",
                "club": None,
                "film_url": ["not-a-link"],
                "academic_info": None,
            }
        ),
    )

    result = extractor.extract(_message())

    assert result.name == "Priya Shah"
    assert result.position == "CM"
    assert result.email is None
    assert result.graduation_year is None
    assert result.film_url is None


def test_blank_api_key_is_rejected() -> None:
    with pytest.raises(ValueError, match="OPENAI_API_KEY"):
        OpenAIExtractor(api_key=SecretStr("   "), model="gpt-4o-mini")
