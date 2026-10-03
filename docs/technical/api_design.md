# TopRostr — API Design

**Version:** 0.1 | **Status:** Draft  
**Backend:** Python / FastAPI

## Overview

The FastAPI backend serves two clients:

- Gmail Add-on: Email processing and athlete creation.
- Web Dashboard: Athlete management and recruiting organization.

All athlete operations require authentication and program-level authorization.

## 1. Gmail Integration

Google Workspace Add-on callbacks are handled separately from the application's REST API.

| Endpoint | Method | Purpose |
|---|---|---|
| `/integrations/gmail/home` | POST | Render initial Gmail add-on card |
| `/integrations/gmail/analyze` | POST | Retrieve and analyze selected email |
| `/integrations/gmail/save` | POST | Save coach-confirmed athlete information |

These endpoints receive Google Workspace event payloads and return supported card responses.

The backend must validate incoming requests and the coach's identity.

## 2. Athlete API

Base path: `/api/v1`

| Endpoint | Method | Purpose |
|---|---|---|
| `/athletes` | GET | Retrieve saved athletes |
| `/athletes` | POST | Create athlete |
| `/athletes/{id}` | GET | Retrieve athlete profile |
| `/athletes/{id}` | PATCH | Update athlete information |
| `/athletes/{id}/emails` | GET | Retrieve associated correspondence |
| `/athletes/{id}/notes` | POST | Add recruiting note |

### Filtering

The athlete collection endpoint should support basic query parameters.

Example:

`GET /api/v1/athletes?graduation_year=2028&position=GK`

Pagination should be supported as the recruiting database grows.

## 3. AI Extraction

The extraction service converts raw recruiting correspondence into structured athlete information.

### Example input

```json
{
  "subject": "2028 GK - John Smith",
  "sender": "john@example.com",
  "body": "Coach, my name is John Smith. I am a 2028 goalkeeper playing for XYZ Academy..."
}
```

### Example extraction result

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "graduation_year": 2028,
  "position": "GK",
  "club": "XYZ Academy",
  "film_url": null,
  "academic_info": null
}
```

Missing fields return `null`. Extracted information is provisional until confirmed by the coach.

Gmail add-on requests will invoke this functionality through the backend. The extraction service should remain independent of Gmail-specific request formats so it can be tested separately.

## 4. Athlete Creation Workflow

1. Receive the Gmail action.
2. Retrieve the authorized email.
3. Extract and validate athlete information.
4. Check for possible duplicate records.
5. Return an editable review card.
6. Receive the coach's confirmation.
7. Validate the confirmed data and save the athlete.

The save action must use a server-controlled reference to the reviewed extraction, rather than trusting arbitrary athlete data or a program ID supplied by the client.

Repeated save requests should not unintentionally create duplicate records.

## 5. Error Handling

Use consistent errors for the application REST API.

| Status | Meaning |
|---|---|
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflicting operation |
| 422 | Validation error |
| 502/503 | External dependency unavailable |

Gmail callbacks must translate application errors into valid add-on responses that coaches can understand.

## 6. API Conventions

- Use UUIDs for resource identifiers.
- Validate request/response models using Pydantic.
- Keep business logic outside route handlers.
- Use dependency injection for database sessions and authentication.
- Enforce authorization server-side.
- Never expose API keys or Gmail access tokens to the client.
- Generate OpenAPI documentation through FastAPI.
- Write pytest tests for primary endpoints.
