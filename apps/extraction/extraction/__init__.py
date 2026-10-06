"""Recruiting-email extraction and coach-note suggestions for TopRostr.

Email extraction turns a subject, sender, and body into athlete fields.
Note suggestions turn a coach's note into interest, engagement, and next
actions. Missing facts stay empty. This package does not save records,
contact anyone, or score athletes.
"""

from extraction.extractor import ExtractionError, Extractor
from extraction.factory import build_extractor, build_suggester
from extraction.fake import FakeExtractor
from extraction.openai_extractor import OpenAIExtractor
from extraction.openai_suggester import OpenAINoteSuggester
from extraction.schemas import ExtractionInput, ExtractionResult
from extraction.settings import ExtractionSettings
from extraction.suggestions import (
    FakeNoteSuggester,
    NoteSuggester,
    RecruitingSuggestions,
    SuggestedInterest,
)

__all__ = [
    "ExtractionError",
    "ExtractionInput",
    "ExtractionResult",
    "ExtractionSettings",
    "Extractor",
    "FakeExtractor",
    "FakeNoteSuggester",
    "NoteSuggester",
    "OpenAIExtractor",
    "OpenAINoteSuggester",
    "RecruitingSuggestions",
    "SuggestedInterest",
    "build_extractor",
    "build_suggester",
]
