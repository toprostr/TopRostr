# TopRostr — Product Requirements
**Version:** POC v0.1 (Revised)

**Tagline:** Less time managing recruiting. More time winning.

## Vision

TopRostr is an AI-native recruiting workspace for college soccer coaches. It simplifies the process of reviewing prospective athletes and turns coaching decisions into organized recruiting actions.

Rather than recreating feature-heavy recruiting platforms, TopRostr uses a clean, card-based experience with AI handling repetitive administrative work behind the scenes.

## Core Product Experience

TopRostr has two primary views:

### 1. Recruit Review

A focused, one-athlete-at-a-time evaluation experience.

- Athlete information collected through a questionnaire.
- Structured athlete cards with academic and playing information.
- Embedded highlight reels where supported.
- Coaching notes and recruiting history.
- Quick decisions: Interested, Review Later, and Pass.
- AI-assisted interpretation of informal coaching notes.

The coach remains responsible for evaluating talent and making recruiting decisions.

### 2. Recruiting Tracker

An automatically maintained view of the program's recruiting activity, organized across three independent dimensions:

| Dimension | Purpose |
|---|---|
| Interest | Which athletes the program wants to pursue |
| Engagement | Camp invitations and other recruiting interactions |
| Next Actions | Follow-ups, film requests, and outstanding tasks |

TopRostr uses structured application logic to maintain accurate lists. AI helps interpret context, identify proposed actions, prepare communication drafts, and reduce manual administration.

## Key AI Interaction

A coach might write:

*Interested. Invite to summer camp and ask for updated full-game footage.*

TopRostr interprets the note and proposes:

- Mark athlete Interested.
- Add athlete to the summer camp list.
- Create a full-game footage request.
- Prepare a personalized communication draft.

The coach confirms proposed changes before they are executed.

## POC Scope

Demonstrate the complete athlete questionnaire → Recruit Review → Recruiting Tracker workflow, including