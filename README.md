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
- **Database (POC):** SQLite, SQLAlchemy, Alembic. PostgreSQL remains the planned production database.
- **Frontend (POC):** Jinja2, HTMX, Tailwind CSS, served by FastAPI
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

Run Alembic, the seed, uvicorn, and pytest from `apps/api`. Alembic looks for `alembic.ini` in the current directory and does not find it from the repository root. The same working directory is what the app and the seed use for `apps/api/toprostr.db`.

```bash
cd apps/api
uv sync --locked
uv run alembic upgrade head
uv run python -m app.seed
uv run uvicorn app.main:app --reload
```

`app.seed` inserts about eight fictional demo recruits. Run it again any time; athletes that are already stored are left alone, so recruiting decisions stay put. `uv run python -m app.seed --reset` replaces only those demo athletes.

Coach-note suggestions use the fake suggester unless `OPENAI_API_KEY` is set. Copy the example file and put the key on that one line:

```bash
cp .env.example .env
```

`apps/api/.env` is gitignored and holds only `OPENAI_API_KEY`. Do not put `DATABASE_URL` in that file. Alembic is the only code that reads `DATABASE_URL` today. Setting it there would not change the app's database, and loading it into the environment would point Alembic at a different file than the app and the seed. Leave it unset so all three share `apps/api/toprostr.db`. An empty key, or no `.env` file, keeps suggestions on the fake suggester. Tests do not call OpenAI.

Once running, the app is available at:

- Recruit Review: http://127.0.0.1:8000/
- Recruiting Tracker: http://127.0.0.1:8000/tracker
- Health check: http://127.0.0.1:8000/health
- Interactive API documentation: http://127.0.0.1:8000/docs

### Run tests

From `apps/api` (not the repository root):

```bash
uv run pytest -v
```

The extraction package has its own checks. From `apps/extraction`:

```bash
uv sync --locked
uv run pytest -v
```

## Documentation

Project documentation lives in [`docs/`](docs/):

- [`PRD`](docs/product/prd.md) — Product requirements and user flows
- [`Technical Docs`](docs/technical/) — Architecture, database design, and API design