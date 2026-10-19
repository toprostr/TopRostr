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
    description: 'Illustrative recruit tracker with twelve fictional recruits grouped by Interested, Review later, and Unreviewed. AI highlights two recruits for the class of 2027.',
    assistant: {
      ...assistant,
      message: 'You have 4 players marked Interested. Your next training camp is Saturday, October 10, 9 am–noon.',
      detail: 'I can draft invitations for Alex, Jack, Michael, and Ryan. Review the messages before sending.',
      suggestions: [{ label: 'Draft camp invitations', emphasis: true }],
      contextChip: '@RostrAI', cue: null,
    },
  },
  {
    id: 'settings', label: 'Settings',
    description: 'Illustrative settings for a fictional coach, connected Gmail and calendar, AI preferences, notifications, and sample plan usage. These are visual examples; no accounts are connected and no settings can be changed.',
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
    ['MS', 'Michael Smith', 'CM', '2027', 'TopRostr FC', '3.7', 'Today · film'],
    ['RJ', 'Ryan Johnson', 'DEF', '2027', 'Pacific Elite', '3.6', 'Yesterday · call'],
  ] },
  { label: 'Review later', recruits: [
    ['BD', 'Ben Davis', 'CM', '2027', 'Pacific Elite', '3.4', 'Today · email'],
    ['LM', 'Luke Martin', 'GK', '2028', 'San Diego Surf', '3.5', '1 week · film'],
    ['DT', 'David Taylor', 'FW', '2027', 'Beach FC', '3.3', '2 days · email'],
    ['JA', 'James Anderson', 'DEF', '2028', 'TopRostr FC', '3.9', '3 days · film'],
  ] },
  { label: 'Unreviewed', recruits: [
    ['CW', 'Chris Wilson', 'FW', '2027', 'Beach FC', '3.9', 'Yesterday · email'],
    ['SO', 'Sam Ortiz', 'CB', '2028', 'Albion SC', '3.2', 'New'],
    ['DH', 'Daniel Harris', 'CM', '2027', 'San Diego Surf', '3.5', 'New'],
    ['MT', 'Matt Thompson', 'FW', '2028', 'Pacific Elite', '3.7', 'New'],
  ] },
]
