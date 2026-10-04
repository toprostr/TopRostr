# TopRostr

TopRostr is a recruiting workflow tool for college soccer coaches.

As athletes increasingly use AI to scale their recruiting outreach, coaches need a better way to manage incoming emails without losing track of promising recruits.

TopRostr aims to turn recruiting emails into structured, reviewable athlete profiles while keeping coaches in control of the process.

## MVP

TopRostr starts as a Gmail-based recruiting assistant for college soccer coaches.

Coaches will be able to:

- Analyze an opened recruiting email through a Google Workspace add-on.
- Extract athlete information into an editable recruit profile using AI.
- Review and confirm information before saving.
- Manage saved recruits through a lightweight web dashboard.

The MVP focuses on coach-initiated actions. It does not automatically monitor inboxes, evaluate athlete talent, or send recruiting messages.

## Tech Stack

TopRostr is built as a Python-first, modular backend.

- **Backend:** Python 3.13, FastAPI, Pydantic
- **Dependency management:** uv
- **Database (planned):** PostgreSQL, SQLAlchemy, Alembic
- **Frontend (planned):** Jinja2, HTMX, Tailwind CSS
- **Integration (planned):** Gmail / Google Workspace Add-on
- **AI (planned):** LLM-based structured athlete information extraction
- **Code quality:** Ruff, Pyright, pytest
- **CI:** GitHub Actions

The project prioritizes a simple architecture and incremental development.

## Getting Started

### Prerequisites

- Python 3.13
- [uv](https://docs.astral.sh/uv/)

### Run the API locally

From the repository root:

```bash
cd apps/api
uv sync --locked
uv run uvicorn app.main:app --reload
```

Once running, the API is available at:

- Health check: http://127.0.0.1:8000/health
- Interactive API documentation: http://127.0.0.1:8000/docs

### Run tests

From `apps/api`:

```bash
uv run pytest -v
```

## Documentation

Project documentation lives in [`docs/`](docs/):

- [`PRD`](docs/product/prd.md) — Product requirements and user flows
- [`Technical Docs`](docs/technical/) — Architecture, database design, and API design