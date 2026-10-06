"""Recruiting-email extraction for TopRostr.

Turn a subject, sender, and body into athlete fields. Missing facts stay null.
This package only extracts. It does not send messages or score athletes.
"""

from extraction.extractor import ExtractionError, Extractor
from extraction.factory import build_extractor
from extraction.fake import FakeExtractor
from extraction.openai_extractor import OpenAIExtractor
from extraction.schemas import ExtractionInput, ExtractionResult
from extraction.settings import ExtractionSettings

__all__ = [
    "ExtractionError",
    "ExtractionInput",
    "ExtractionResult",
    "ExtractionSettings",
    "Extractor",
    "FakeExtractor",
    "OpenAIExtractor",
    "build_extractor",
]
