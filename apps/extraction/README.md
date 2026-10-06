# TopRostr extraction

Standalone package that turns one recruiting email into athlete fields.

It only extracts. It does not send messages, score or rank athletes, or integrate with Gmail. Coaches paste a message into the dashboard later; this package never sees that dashboard. `apps/api` can depend on it later without this package depending on the API.

The result contract is [API design §3](../../docs/technical/api_design.md): `name`, `email`, `graduation_year`, `position`, `club`, `film_url`, and `academic_info`. Every field defaults to `null`. `film_url` is either `null` or a list of links, because one email can contain several. Anything the email does not state stays `null`. A bad email address or an impossible graduation year becomes `null` instead of being stored. See [FR-02](../../docs/product/requirements.md) and [PRD §5](../../docs/product/prd.md).

## Install

Requires Python 3.13 and [uv](https://docs.astral.sh/uv/).

```bash
cd apps/extraction
uv sync --locked
```

## Checks

Same four checks as `apps/api`:

```bash
uv run ruff check .
uv run ruff format --check .
uv run pyright
uv run pytest -v
```

`pytest` uses the fake extractor. It does not call OpenAI. The live test is skipped unless `OPENAI_API_KEY` is set, which CI does not set.

## Run with the fake extractor

Leave `OPENAI_API_KEY` unset. The command below reads JSON from stdin and prints the result. This is the API design example, so film and academics stay `null`, and the position stays the word written in the body (`goalkeeper`), not an abbreviated code.

```bash
uv run python -m extraction <<'EOF'
{"subject":"2028 GK - John Smith","sender":"john@example.com","body":"Coach, my name is John Smith. I am a 2028 goalkeeper playing for XYZ Academy..."}
EOF
```

## Run with OpenAI

Export a key in your shell. Do not commit it. The client reads `OPENAI_API_KEY` from the environment (and optional `OPENAI_MODEL`, default `gpt-4o-mini`) through [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/). The key is a `SecretStr` and is not written to logs.

```bash
export OPENAI_API_KEY="sk-..."
export OPENAI_MODEL="gpt-4o-mini"   # optional
uv run python -m extraction <<'EOF'
{"subject":"2028 GK - John Smith","sender":"john@example.com","body":"Coach, my name is John Smith. I am a 2028 goalkeeper playing for XYZ Academy..."}
EOF
```

Structured output is bound to the Pydantic result model. The prompt tells the model not to guess, and the request sets `store=false` so the provider is asked not to retain the email after the call. Guide: [Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

To send the synthetic fixtures through the live client:

```bash
OPENAI_API_KEY="sk-..." uv run pytest -m manual
```

That test spends API credits. `uv run pytest -m "not manual"` skips it even if a key is present.

## Layout

| Module | Role |
| --- | --- |
| `extraction/schemas.py` | Input and result models. Invalid values become `null`. |
| `extraction/extractor.py` | `Extractor` protocol. |
| `extraction/fake.py` | Deterministic extractor for tests and for dev with no key. |
| `extraction/openai_extractor.py` | OpenAI Responses `parse` client. |
| `extraction/factory.py` | Fake when no key is set, OpenAI when a key is set. |
| `extraction/suggestions.py` | Coach-note suggestions: interest, engagement, next actions. |
| `extraction/openai_suggester.py` | OpenAI suggester. Same key rule as extraction. |
| `tests/fixtures/recruiting_emails.json` | Synthetic emails and the expected fake results. |

Fixtures cover a complete email, missing fields, messy formatting, several film links, no athlete info, a very short email, invalid values, a subject-only email, and an email with two addresses where guessing would be wrong.

## Design notes

**Separate package.** `apps/api` is changing on another branch. A second project with its own `pyproject.toml` and `uv.lock` can be tested on its own, and the API can add a path dependency later. Putting this code inside `apps/api` would have been fewer repos to think about, and it would have collided with that work. A network service would have been the other extreme; nothing here needs its own process yet. See [architecture](../../docs/technical/archutecture.md): extraction is a backend module, not a microservice.

**Protocol plus a fake, instead of mocking the SDK.** `Extractor` is a [`Protocol`](https://docs.python.org/3/library/typing.html#typing.Protocol) (a Java-style interface without a base class). Tests and local dev call `FakeExtractor`, which actually reads the email with explicit rules. Mocking `OpenAI.responses.parse` would check that we passed the right arguments, and it would not show what should be extracted from a messy email. The OpenAI class still has a small `parse` seam so unit tests can check the prompt and the bound model without constructing a client. The live call is a manual test only.

**Null, not an exception, for one bad field.** [`field_validator`](https://docs.pydantic.dev/latest/concepts/validators/) turns an invalid email or an impossible year into `null`. Raising `ValidationError` for the whole object would also keep the bad value out, and it would throw away the name and position that were fine. Graduation years outside 1990–2045 are treated as unknown. That window is wider than the saved-athlete bounds in `apps/api`; saving can still reject a year later.

**What the fake will not do.** It uses the sender address only when the body is first person ("my name is" / "I am a") and the body does not already state an address. Two addresses and no label stay `null`. A link is film only when it is on a film line or the host is Hudl, YouTube, or Vimeo. "Looking forward" is not a position.
