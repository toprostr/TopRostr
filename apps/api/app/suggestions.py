"""Load the note suggester for Recruit Review.

The key, when the coach has one, lives in ``apps/api/.env`` as
``OPENAI_API_KEY`` and nowhere else. This module reads that one name from
the file. It does not load the rest of the file into the process environment,
so a ``DATABASE_URL`` in the same file cannot point Alembic at a different
database. With the variable unset, Alembic, the seed, and the app share
``apps/api/toprostr.db``.
"""

from __future__ import annotations

import os
from pathlib import Path

from extraction.factory import build_suggester
from extraction.settings import ExtractionSettings
from extraction.suggestions import NoteSuggester
from pydantic import SecretStr

ENV_PATH = Path(__file__).resolve().parents[1] / ".env"


def read_openai_api_key(path: Path) -> SecretStr | None:
    """Return ``OPENAI_API_KEY`` from a dotenv file, or None when it is blank.

    Every other line is ignored. Nothing is written to ``os.environ``.
    """
    if not path.is_file():
        return None
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        if name.strip() != "OPENAI_API_KEY":
            continue
        secret = value.strip().strip('"').strip("'")
        if not secret:
            return None
        return SecretStr(secret)
    return None


def get_suggester() -> NoteSuggester:
    """Use the fake suggester unless a key is configured.

    A non-blank key in ``apps/api/.env`` wins. Otherwise the process
    environment is used, which is how a shell export still works. A missing
    or blank key selects the fake suggester and does not call OpenAI.
    """
    file_key = read_openai_api_key(ENV_PATH)
    if file_key is not None:
        return build_suggester(ExtractionSettings(openai_api_key=file_key))
    if not os.environ.get("OPENAI_API_KEY", "").strip():
        return build_suggester(ExtractionSettings(openai_api_key=None))
    return build_suggester()
