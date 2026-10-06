"""Read one extraction request as JSON on stdin and write the result to stdout.

Uses the fake extractor when OPENAI_API_KEY is unset, and the OpenAI extractor
when it is set. Errors are one fixed sentence on stderr. The email is not echoed.
"""

from __future__ import annotations

import json
import sys

from pydantic import ValidationError

from extraction.extractor import ExtractionError
from extraction.factory import build_extractor
from extraction.schemas import ExtractionInput


def main() -> None:
    raw = sys.stdin.read()
    try:
        payload = json.loads(raw)
        message = ExtractionInput.model_validate(payload)
    except (json.JSONDecodeError, ValidationError, TypeError, ValueError):
        print("Invalid extraction input.", file=sys.stderr)
        raise SystemExit(1) from None

    try:
        result = build_extractor().extract(message)
    except ExtractionError as exc:
        print(str(exc), file=sys.stderr)
        raise SystemExit(1) from None

    print(result.model_dump_json(indent=2))


if __name__ == "__main__":
    main()
