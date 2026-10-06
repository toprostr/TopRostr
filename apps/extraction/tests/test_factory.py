import pytest
from pydantic import SecretStr

from extraction.factory import build_extractor
from extraction.fake import FakeExtractor
from extraction.openai_extractor import OpenAIExtractor
from extraction.schemas import ExtractionInput
from extraction.settings import DEFAULT_OPENAI_MODEL, ExtractionSettings


def test_missing_key_selects_the_fake(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    extractor = build_extractor()

    assert isinstance(extractor, FakeExtractor)


def test_blank_key_selects_the_fake(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "   ")

    assert isinstance(build_extractor(), FakeExtractor)


def test_key_selects_openai_without_calling_it(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-not-a-real-key")

    def explode(*args: object, **kwargs: object) -> None:
        raise AssertionError(
            "OpenAI client must not be constructed while selecting an extractor"
        )

    monkeypatch.setattr("extraction.openai_extractor.OpenAI", explode)
    extractor = build_extractor()

    assert isinstance(extractor, OpenAIExtractor)
    assert extractor.model == DEFAULT_OPENAI_MODEL


def test_settings_do_not_reveal_the_api_key() -> None:
    settings = ExtractionSettings(openai_api_key=SecretStr("sk-test-not-a-real-key"))

    assert "sk-test-not-a-real-key" not in repr(settings)
    assert settings.openai_api_key is not None
    assert settings.openai_api_key.get_secret_value() == "sk-test-not-a-real-key"


def test_build_extractor_can_take_settings_directly() -> None:
    settings = ExtractionSettings(openai_api_key=None)
    message = ExtractionInput(subject="hi", sender="nope", body="hey")

    result = build_extractor(settings).extract(message)

    assert result.model_dump(mode="json") == {
        "name": None,
        "email": None,
        "graduation_year": None,
        "position": None,
        "club": None,
        "film_url": None,
        "academic_info": None,
    }
