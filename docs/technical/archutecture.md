# TopRostr — System Architecture
**Version:** POC v0.1 (Revised)

## Overview

TopRostr uses a modular Python/FastAPI backend serving a lightweight web application.

The two primary experiences—Recruit Review and Recruiting Tracker—operate on the same athlete records and recruiting activity data.

## High-Level Flow

```text
            Athlete Questionnaire
                     |
                     v
               FastAPI Backend
                     |
                     v
                PostgreSQL
                     |
             +-------+-------+
             |               |
             v               v
       Recruit Review   Recruiting Tracker
             |               ^
             |               |
       Coach Decisions       |
       & Informal Notes      |
             |               |
             v               |
         AI Service          |
             |               |
             v               |
      Proposed Actions       |
             |               |
             v               |
       Coach Approval -------+
```

## Responsibilities

**Pydantic Schemas:** Validate athlete submissions, API responses, and structured AI proposals.

**Recruiting Service:** Manages interest, engagement, and outstanding actions through deterministic Python logic.

**AI Service:** Interprets notes and prepares summaries, proposed actions, and communication drafts. It does not independently execute recruiting decisions.

**Database:** Persists athletes, coaching observations, recruiting activities, and task state.

**Frontend:** Jinja2 and HTMX provide responsive athlete cards and recruiting trackers without requiring a separate JavaScript application.

## Initial Data Model Direction

The existing `AthleteCreate`, `AthleteResponse`, and `RecruitingStatus` schemas remain the starting point for TR-009.

Future development will introduce separate models for engagement activities and recruiting tasks. Camp invitations and follow-ups should not become additional values in one oversized status enum.

## Future Integrations

Gmail, Outlook, spreadsheet imports, and additional intake methods may be introduced later. All should connect to the same underlying recruiting workflow.