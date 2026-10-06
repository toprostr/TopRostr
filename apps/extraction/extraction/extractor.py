"""The extraction boundary shared by every implementation.

`Extractor` is a `Protocol`: any object with a matching `extract` method
satisfies it, the same way a Java interface is satisfied by a class that
implements its methods. There is no base class to inherit.

https://docs.python.org/3/library/typing.html#typing.Protocol
"""

from __future__ import annotations

import logging
from typing import Protocol, runtime_checkable

from extraction.schemas import ExtractionInput, ExtractionResult

logger = logging.getLogger(__name__)


class ExtractionError(Exception):
    """The extractor could not return a validated result.

    The message is safe to show. It never includes the email or an API key.
    """


@runtime_checkable
class Extractor(Protocol):
    """Turn one recruiting email into athlete fields.

    Implementations only extract. They do not send messages or score athletes.
    """

    def extract(self, message: ExtractionInput) -> ExtractionResult:
        """Return facts stated in `message`. Unstated fields stay null."""
        ...


def log_extraction(
    extractor_name: str,
    result: ExtractionResult,
    *,
    model: str | None = None,
) -> None:
    """Record that extraction finished without recording what the email said.

    Field names are not athlete data. Values, the body, and secrets are not
    written. Callers should not log the exception text from a model provider
    either: those messages sometimes echo the request.
    """

    populated = [
        name for name, value in result.model_dump().items() if value is not None
    ]
    if model is None:
        logger.info(
            "extraction complete extractor=%s populated=%s",
            extractor_name,
            ",".join(populated),
        )
        return
    logger.info(
        "extraction complete extractor=%s model=%s populated=%s",
        extractor_name,
        model,
        ",".join(populated),
    )
