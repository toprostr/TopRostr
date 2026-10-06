"""Choose an extractor or a note suggester from settings.

No key, or a blank key, selects the fake. A key selects the OpenAI client.
The key is read from the environment and is not returned to a caller.
"""

from __future__ import annotations

from extraction.extractor import Extractor
from extraction.fake import FakeExtractor
from extraction.openai_extractor import OpenAIExtractor
from extraction.openai_suggester import OpenAINoteSuggester
from extraction.settings import ExtractionSettings
from extraction.suggestions import FakeNoteSuggester, NoteSuggester


def build_extractor(settings: ExtractionSettings | None = None) -> Extractor:
    """Return the fake extractor unless `OPENAI_API_KEY` is set."""

    resolved = _resolve(settings)
    if resolved.openai_api_key is None:
        return FakeExtractor()
    return OpenAIExtractor(api_key=resolved.openai_api_key, model=resolved.openai_model)


def build_suggester(settings: ExtractionSettings | None = None) -> NoteSuggester:
    """Return the fake note suggester unless `OPENAI_API_KEY` is set."""

    resolved = _resolve(settings)
    if resolved.openai_api_key is None:
        return FakeNoteSuggester()
    return OpenAINoteSuggester(
        api_key=resolved.openai_api_key,
        model=resolved.openai_model,
    )


def _resolve(settings: ExtractionSettings | None) -> ExtractionSettings:
    return settings if settings is not None else ExtractionSettings()
