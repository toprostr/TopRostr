"""OpenAI implementation of `Extractor`.

Structured outputs bind the response to `ExtractionResult`, so the model has to
return those fields. The prompt tells it to leave missing facts null. The
result model's validators still run, which is what turns a bad email address or
an impossible graduation year into null if the model emits one anyway.

https://developers.openai.com/api/docs/guides/structured-outputs
"""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from openai import OpenAI, OpenAIError
from pydantic import SecretStr, ValidationError

from extraction.extractor import ExtractionError, log_extraction
from extraction.prompt import SYSTEM_PROMPT, render_user_message
from extraction.schemas import ExtractionInput, ExtractionResult

logger = logging.getLogger(__name__)

_Parse = Callable[..., Any]


class OpenAIExtractor:
    """Call the Responses API and parse the output into `ExtractionResult`.

    `parse` is a test seam. Production code leaves it empty and the real client
    is created on the first `extract` call. Tests pass a stub and never open a
    socket. The API key stays in a `SecretStr` until that real client is built.
    """

    def __init__(
        self,
        *,
        api_key: SecretStr,
        model: str,
        parse: _Parse | None = None,
        timeout_seconds: float = 30.0,
    ) -> None:
        if not api_key.get_secret_value().strip():
            raise ValueError("OPENAI_API_KEY is required to build an OpenAI extractor.")
        self._api_key = api_key
        self._model = model
        self._parse = parse
        self._timeout_seconds = timeout_seconds

    @property
    def model(self) -> str:
        return self._model

    def extract(self, message: ExtractionInput) -> ExtractionResult:
        try:
            response = self._parse_response(message)
        except (OpenAIError, ValidationError):
            # Do not chain the provider exception. Its text can echo the email
            # body or the request, and those must not land in logs or tracebacks.
            logger.warning("openai extraction failed model=%s", self._model)
            raise ExtractionError("The extraction provider request failed.") from None

        parsed = getattr(response, "output_parsed", None)
        if isinstance(parsed, ExtractionResult):
            result = parsed
        elif parsed is None:
            raise ExtractionError("The model did not return an extraction result.")
        else:
            result = ExtractionResult.model_validate(parsed)
        log_extraction("openai", result, model=self._model)
        return result

    def _parse_response(self, message: ExtractionInput) -> Any:
        parse = self._parse if self._parse is not None else self._live_parse()
        return parse(
            model=self._model,
            input=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": render_user_message(message)},
            ],
            text_format=ExtractionResult,
            # Recruiting text should not be retained by the provider after the call.
            store=False,
        )

    def _live_parse(self) -> _Parse:
        client = OpenAI(
            api_key=self._api_key.get_secret_value(),
            timeout=self._timeout_seconds,
            max_retries=2,
        )
        return client.responses.parse
