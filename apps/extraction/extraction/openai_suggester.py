"""OpenAI implementation of `NoteSuggester`.

Structured outputs bind the response to `RecruitingSuggestions`. The prompt
tells the model to leave unstated decisions empty and not to score or contact
anyone. The result model's validators still drop a ranking or a "we already
emailed them" label if the model emits one.

https://developers.openai.com/api/docs/guides/structured-outputs
"""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from openai import OpenAI, OpenAIError
from pydantic import SecretStr, ValidationError

from extraction.extractor import ExtractionError
from extraction.prompt import SUGGESTION_SYSTEM_PROMPT, render_note
from extraction.suggestions import RecruitingSuggestions, log_suggestions

logger = logging.getLogger(__name__)

_Parse = Callable[..., Any]


class OpenAINoteSuggester:
    """Call the Responses API and parse the output into suggestions.

    `parse` is a test seam. Production code leaves it empty and the real client
    is created on the first `suggest` call. Tests pass a stub and never open a
    socket. The API key stays in a `SecretStr` until that real client is built.
    """

    def __init__(
        self,
        *,
        api_key: SecretStr,
        model: str,
        parse: _Parse | None = None,
        timeout_seconds: float = 20.0,
    ) -> None:
        if not api_key.get_secret_value().strip():
            raise ValueError("OPENAI_API_KEY is required to build an OpenAI suggester.")
        self._api_key = api_key
        self._model = model
        self._parse = parse
        self._timeout_seconds = timeout_seconds

    @property
    def model(self) -> str:
        return self._model

    def suggest(self, notes: str) -> RecruitingSuggestions:
        try:
            response = self._parse_response(notes)
        except (OpenAIError, TimeoutError, ValidationError):
            # Do not chain the provider exception. Its text can echo the note
            # or the request, and those must not land in logs or tracebacks.
            logger.warning("openai suggestion failed model=%s", self._model)
            raise ExtractionError("The suggestion provider request failed.") from None

        parsed = getattr(response, "output_parsed", None)
        if isinstance(parsed, RecruitingSuggestions):
            result = parsed
        elif parsed is None:
            raise ExtractionError("The model did not return suggestions.")
        else:
            result = RecruitingSuggestions.model_validate(parsed)
        log_suggestions("openai", result, model=self._model)
        return result

    def _parse_response(self, notes: str) -> Any:
        parse = self._parse if self._parse is not None else self._live_parse()
        return parse(
            model=self._model,
            input=[
                {"role": "system", "content": SUGGESTION_SYSTEM_PROMPT},
                {"role": "user", "content": render_note(notes)},
            ],
            text_format=RecruitingSuggestions,
            store=False,
        )

    def _live_parse(self) -> _Parse:
        client = OpenAI(
            api_key=self._api_key.get_secret_value(),
            timeout=self._timeout_seconds,
            max_retries=2,
        )
        return client.responses.parse
