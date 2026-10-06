"""Runtime configuration loaded from the environment.

Pydantic settings is the Python equivalent of Spring's `@ConfigurationProperties`:
the process environment is validated once into a typed object. The API key is a
`SecretStr`, so `repr(settings)` and tracebacks do not print it.

https://docs.pydantic.dev/latest/concepts/pydantic_settings/
"""

from __future__ import annotations

from typing import Any

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_OPENAI_MODEL = "gpt-4o-mini"


class ExtractionSettings(BaseSettings):
    """Settings for choosing an extractor. An empty key means "use the fake"."""

    model_config = SettingsConfigDict(extra="ignore")

    openai_api_key: SecretStr | None = None
    openai_model: str = Field(default=DEFAULT_OPENAI_MODEL)

    @field_validator("openai_api_key", mode="before")
    @classmethod
    def blank_api_key_is_unset(cls, value: Any) -> Any:
        if isinstance(value, str) and not value.strip():
            return None
        return value

    @field_validator("openai_model", mode="before")
    @classmethod
    def blank_model_uses_default(cls, value: Any) -> Any:
        if isinstance(value, str) and not value.strip():
            return DEFAULT_OPENAI_MODEL
        return value
