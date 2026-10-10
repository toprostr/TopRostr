import { workspaceFixture } from './fixtures.js'

const assistant = workspaceFixture.assistant

export const workspaceConcepts = [
  { id: 'inbox', label: 'Inbox', assistant },
  {
    id: 'calendar', label: 'Calendar',
    description: 'Illustrative full-week calendar with recruiting calls, campus visits, training camps, practices, and games, plus a suggested match for Chris that has not been added. AI suggests events; the coach confirms them.',
    assistant: {
      ...assistant,
      message: 'Alex’s campus visit is Thursday, 9–11 am. I can draft an itinerary with a campus tour, staff meeting, and facilities visit.',
      detail: null,
      suggestions: [{ label: 'Draft itinerary', emphasis: true }],
      contextChip: '@RostrAI', cue: null,
    },
  },
  {
    id: 'rostr', label: 'Rostr',
    description: 'Illustrative recruit tracker with six fictional recruits grouped by Interested, Review later, and Unreviewed. AI highlights two recruits for the class of 2027.',
    assistant: {
      ...assistant,
      message: 'Alex and Jack are 2027 recruits ready for review.',
      detail: null,
      recruits: [
        { name: 'Alex Miller', initials: 'AM', detail: 'DEF · 2027 · TopRostr FC', gpa: '3.8' },
        { name: 'Jack Brown', initials: 'JB', detail: 'GK · 2027 · Slammers FC', gpa: '3.6' },
      ],
      suggestions: [{ label: 'Filter to 2027 recruits', emphasis: true }, { label: 'Dismiss', emphasis: false }],
      contextChip: '@RostrAI', cue: null,
    },
  },
  {
    id: 'settings', label: 'Settings',
    description: 'Illustrative settings for a fictional coach, connected Gmail and calendar, staff access, AI preferences, and notifications. These are visual examples; no accounts are connected and no settings can be changed.',
    assistant: {
      ...assistant,
      message: 'I draft replies and suggest next steps. I never send, save, or change a recruit’s status without you.',
      detail: 'Ask me what any setting does.',
      suggestions: [], contextChip: '@RostrAI', cue: null,
    },
  },
]

export const rosterGroups = [
  { label: 'Interested', recruits: [
    ['AM', 'Alex Miller', 'DEF', '2027', 'TopRostr FC', '3.8', 'Today · reel'],
    ['JB', 'Jack Brown', 'GK', '2027', 'Slammers FC', '3.6', '3 days · email'],
  ] },
  { label: 'Review later', recruits: [
    ['BD', 'Ben Davis', 'CM', '2027', 'Pacific Elite', '3.4', 'Today · email'],
    ['LM', 'Luke Martin', 'GK', '2028', 'San Diego Surf', '3.5', '1 week · film'],
  ] },
  { label: 'Unreviewed', recruits: [
    ['CW', 'Chris Wilson', 'FW', '2027', 'Beach FC', '3.9', 'Yesterday · email'],
    ['SO', 'Sam Ortiz', 'CB', '2028', 'Albion SC', '3.2', 'New'],
  ] },
]
