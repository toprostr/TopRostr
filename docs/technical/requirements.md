# TopRostr — Technical Requirements
**Version:** POC v0.1 (Revised)

## Technology Stack

- Python 3.13 / FastAPI / Pydantic
- PostgreSQL / SQLAlchemy / Alembic
- Jinja2 / HTMX / lightweight CSS
- Server-side LLM integration
- uv / Ruff / Pyright / pytest
- GitHub Actions

## Functional Requirements

### Athlete Intake

Accept validated questionnaire submissions and persist structured athlete records.

### Recruit Review

Render athlete cards, questionnaire information, film links, coaching notes, and recruiting decisions.

### Recruiting Tracker

Maintain independent recruiting dimensions rather than storing all activity in one status field.

Support Interested lists, camp lists, outstanding requests, and follow-up tasks.

### AI Service

The LLM should:

- Summarize relevant athlete information.
- Interpret informal coaching notes.
- Propose structured recruiting actions.
- Generate personalized communication drafts.
- Explain suggested follow-up tasks using recorded context.

AI responses must be validated through Pydantic before the application uses them.

**The LLM must not directly modify database records, independently evaluate athletic ability, or send communications.** FastAPI executes validated and coach-approved actions.

### Data Portability

Allow recruiting records, statuses, and notes to be exported to CSV for use in Excel and other systems.

## Engineering Principles

- Keep business logic separate from LLM prompts and infrastructure.
- Use normal database queries for filtering, list management, and deadlines.
- Mock external AI requests in automated tests.
- Preserve coaching notes and original submissions.
- Use fictional athlete data during the POC.
- Require additional security, privacy, access control, and institutional review before real-world deployment.