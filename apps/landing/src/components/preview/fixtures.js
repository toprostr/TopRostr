/**
 * Fictional sample for the illustrative inbox.
 * The program, the recruit, the club, and the other names are invented.
 * Nothing here is a real program or a real person.
 */
export const workspaceFixture = {
  organization: {
    program: "WESTMERE COLLEGE WOMEN'S SOCCER",
    product: 'RostrAI',
    mark: 'R',
    coachInitials: 'CR',
  },
  navigation: [
    { id: 'inbox', label: 'Inbox', active: true },
    { id: 'calendar', label: 'Calendar', active: false },
    { id: 'rostr', label: 'Rostr', active: false },
    { id: 'settings', label: 'Settings', active: false },
  ],
  inbox: {
    title: 'Inbox',
    count: '3 new',
    messages: [
      {
        id: 'lila',
        name: 'LILA CALDER',
        initials: 'LC',
        time: '9:12a',
        preview: 'Highlight reel + transcript',
        selected: true,
        recruit: true,
      },
      {
        id: 'jonah',
        name: 'Jonah Hale',
        initials: 'JH',
        time: '8:40a',
        preview: 'Spring schedule',
        selected: false,
        recruit: true,
      },
      {
        id: 'priya',
        name: 'Priya Shah',
        initials: 'PS',
        time: 'Yesterday',
        preview: 'Question about ID camp',
        selected: false,
        recruit: true,
      },
      {
        id: 'northline',
        name: 'Northline Desk',
        initials: 'ND',
        time: 'Mon',
        preview: 'Showcase field changes',
        selected: false,
        recruit: false,
      },
    ],
  },
  recruit: {
    name: 'LILA CALDER',
    position: 'Goalkeeper',
    classYear: 'Class of 2027',
    club: 'HARBOR & PINE FC',
    status: 'Unreviewed',
    film: 'Highlight reel · 4:12',
    stats: [
      { label: 'GPA', value: '3.8', ai: true },
      { label: 'SAT', value: '1340', ai: false },
      { label: 'ACT', value: '29', ai: false },
      { label: 'Height', value: '5′9″', ai: false },
      { label: 'Weight', value: '150 lb', ai: false },
    ],
    tabs: [
      { id: 'film', label: 'Film', active: true },
      { id: 'academics', label: 'Academics', active: false },
      { id: 'soccer', label: 'Soccer', active: false },
      { id: 'contact', label: 'Contact', active: false },
      { id: 'notes', label: 'Notes', active: false },
    ],
  },
  assistant: {
    name: 'RostrAI',
    message: '3 new recruits today. Lila’s reel is ready — saves start at 1:42.',
    suggestions: [
      { label: 'Jump to 1:42', emphasis: true },
      { label: 'Draft a reply', emphasis: false },
    ],
    contextChip: '@LILA CALDER',
    placeholder: 'Ask anything…',
    cue: 'YOU REVIEW BEFORE ANY ACTION',
  },
  decision: {
    prompt: 'Your call. Nothing saves until you choose.',
    choices: [
      { label: 'Pass', tone: 'quiet' },
      { label: 'Review later', tone: 'outline' },
      { label: 'Interested', tone: 'solid' },
    ],
  },
  label: 'ILLUSTRATIVE PRODUCT CONCEPT / COACH-APPROVED ACTIONS',
}
