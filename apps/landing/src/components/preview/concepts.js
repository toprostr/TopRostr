import { workspaceFixture } from './fixtures.js'

const assistant = workspaceFixture.assistant

export const workspaceConcepts = [
  { id: 'inbox', label: 'Inbox', assistant },
  {
    id: 'calendar', label: 'Calendar',
    description: 'Illustrative weekly calendar showing a coach call, a match to watch Tessa, and a suggested match for Nia that has not been added. AI suggests events; the coach confirms them.',
    assistant: {
      ...assistant,
      message: 'Saturday you can see Tessa live. Want me to add Nia’s match Sunday?',
      suggestions: [{ label: 'Add', emphasis: true }, { label: 'Not now', emphasis: false }],
      contextChip: '@This week', cue: null,
    },
  },
  {
    id: 'rostr', label: 'Rostr',
    description: 'Illustrative recruit tracker with six fictional recruits grouped by Interested, Review later, and Unreviewed. AI suggests two goalkeepers for the class of 2027.',
    assistant: {
      ...assistant,
      message: 'You’re light at GK for 2027. Tessa and Ava fit.',
      recruits: [
        { name: 'Tessa Quillfeather', initials: 'TQ', detail: 'GK · 2027 · Harbor & Pine FC', gpa: '3.8' },
        { name: 'Ava Moreno', initials: 'AM', detail: 'GK · 2027 · Slammers FC', gpa: '3.6' },
      ],
      suggestions: [{ label: 'Filter to 2027 GKs', emphasis: true }, { label: 'Dismiss', emphasis: false }],
      contextChip: '@Rostr', cue: null,
    },
  },
  {
    id: 'settings', label: 'Settings',
    description: 'Illustrative settings for a fictional coach, connected Gmail and calendar, staff access, AI preferences, and notifications. These are visual examples; no accounts are connected and no settings can be changed.',
    assistant: {
      ...assistant,
      message: 'I draft replies and suggest next steps. I never send, save, or change a recruit’s status without you.',
      detail: 'Ask me what any setting does.',
      suggestions: [], contextChip: '@Settings', cue: null,
    },
  },
]

export const rosterGroups = [
  { label: 'Interested', recruits: [
    ['TQ', 'Tessa Quillfeather', 'GK', '2027', 'Harbor & Pine FC', '3.8', 'Today · reel'],
    ['AM', 'Ava Moreno', 'GK', '2027', 'Slammers FC', '3.6', '3 days · email'],
  ] },
  { label: 'Review later', recruits: [
    ['RV', 'Rhys Vantwell', 'CM', '2027', 'Pacific Elite', '3.4', 'Today · email'],
    ['LP', 'Lena Park', 'GK', '2028', 'San Diego Surf', '3.5', '1 week · film'],
  ] },
  { label: 'Unreviewed', recruits: [
    ['NF', 'Nia Fernwhistle', 'FW', '2027', 'Beach FC', '3.9', 'Yesterday · email'],
    ['SO', 'Sam Ortiz', 'CB', '2028', 'Albion SC', '3.2', 'New'],
  ] },
]
