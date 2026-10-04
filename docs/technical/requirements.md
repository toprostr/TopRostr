# TopRostr — Technical Requirements Document

**Version:** 0.1  
**Status:** Draft  
**Related Documents:** PRD.md, USER_FLOWS.md

## 1. Technical Overview

TopRostr is a Python-first, AI-powered recruiting assistant that integrates with Gmail and provides a lightweight web dashboard for college soccer coaches.

The MVP will use manual, coach-initiated email processing rather than continuously monitoring incoming messages.

### Proposed Technology Stack

| Component | Technology |
|---|---|
| Primary Language | Python 3 |
| Backend Framework | FastAPI |
| Data Validation | Pydantic |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| AI Integration | OpenAI Python SDK |
| Gmail Integration | Google Workspace Add-on / Gmail API (subject to technical feasibility) |
| Dashboard | Jinja2, HTMX, Tailwind CSS |
| Testing | pytest, httpx |
| Development | Cursor, GitHub, Docker |

## 2. Functional Requirements

### FR-01: Gmail Integration

- Coaches must be able to authorize TopRostr to access the supported Gmail functionality.
- TopRostr must provide an entry point accessible from Gmail.
- Coaches must explicitly initiate the processing of an opened recruiting email.
- The application must securely retrieve the relevant email content.
- Continuous inbox monitoring is not required.

### FR-02: AI Email Processing

When a coach initiates processing, TopRostr must extract available recruiting information.

Initial fields:

- Athlete name.
- Email address.
- Graduation year.
- Playing position.
- Club/team.
- Academic information, if provided.
- Highlight film links.

Missing information must remain explicitly unknown.

The original correspondence must be preserved or referenced for verification.

### FR-03: Athlete Profile Generation

- Display extracted information in a structured format.
- Allow coaches to correct information before saving.
- Validate submitted information.
- Save confirmed athlete profiles to PostgreSQL.
- Associate profiles with their source correspondence.

### FR-04: Existing Athlete Detection

- Check whether an incoming submission potentially belongs to an existing athlete.
- Use available identifiers, such as the sender email address, to identify possible matches.
- Display potential matches to the coach.
- Require confirmation before merging or updating an existing profile.
- Preserve existing information rather than silently overwriting it.

### FR-05: Recruiting Dashboard

Provide a lightweight web interface where coaches can:

- View saved athlete profiles.
- Filter by graduation year and position.
- Filter by film availability.
- Open individual athlete profiles.
- View associated recruiting correspondence.
- Edit athlete information and add notes.

### FR-06: Authentication and Authorization

- Support authenticated coach accounts.
- Associate coaches with a recruiting program.
- Restrict access to recruiting information based on program membership.
- Protect backend endpoints against unauthorized requests.

## 3. Non-Functional Requirements

### Security and Privacy

- Store credentials and API keys securely.
- Request the minimum Gmail permissions necessary.
- Protect access to athlete information.
- Prevent unauthorized cross-program data access.
- Do not log complete recruiting emails or sensitive authentication tokens.
- Establish appropriate retention and deletion practices before processing real athlete information.

### Reliability

- Handle Gmail and LLM API failures gracefully.
- Provide understandable error messages.
- Allow failed operations to be retried safely.
- Avoid creating duplicate profiles from repeated processing.
- Preserve coach corrections if an operation fails.

### Performance

- Email extraction should provide visible processing feedback.
- Dashboard filtering should remain responsive with a realistic pilot dataset.
- Track extraction latency and API usage during development.

Specific performance targets will be established after initial prototype testing.

### Maintainability

- Follow idiomatic, typed Python conventions.
- Separate API routes, business logic, AI processing, and database operations.
- Validate external inputs.
- Maintain automated tests.
- Document environment configuration and local development instructions.

## 4. Testing Requirements

Testing will cover:

1. API request and response validation.
2. AI extraction accuracy using synthetic recruiting emails.
3. Missing or malformed email information.
4. Duplicate athlete detection.
5. Database persistence and retrieval.
6. Authentication and program-level authorization.
7. Gmail integration failures.
8. Primary user workflow from email analysis through athlete profile creation.

## 5. MVP Technical Constraints

- Gmail will be the initial target email provider.
- Processing will be explicitly initiated by the coach.
- One primary Python backend.
- One relational database.
- Lightweight, server-rendered web dashboard.
- No autonomous recruiting agents.
- No automated outbound emails.
- No continuous mailbox synchronization.
- No separate microservice architecture.

## 6. Primary System Workflow

1. Coach opens a recruiting email in Gmail.
2. Coach initiates TopRostr.
3. Gmail integration securely sends the selected message information to the backend.
4. Python backend validates the request.
5. AI extraction service processes the email.
6. Extracted information is validated against a structured schema.
7. TopRostr checks for potential existing athlete records.
8. Coach reviews and confirms the information.
9. Backend persists the confirmed athlete record.
10. Athlete becomes accessible through the web dashboard.

## 7. MVP Completion Criteria

The technical MVP is complete when a coach can successfully:

- Authenticate and access TopRostr.
- Analyze a selected Gmail message.
- Review and correct extracted information.
- Save a new athlete or update an existing record.
- Access that athlete through the TopRostr dashboard.
- Filter and review saved athlete information.

All primary workflows must be supported by automated backend tests.