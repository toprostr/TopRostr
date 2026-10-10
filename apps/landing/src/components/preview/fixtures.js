/**
 * Fictional sample for the illustrative inbox.
 * The program, the recruit, the club, and the other names are invented.
 * Nothing here is a real program or a real person.
 */
export const workspaceFixture = {
  organization: {
    program: "TopRostr University Men's Soccer",
    product: 'TopRostr',
    coachInitials: 'TR',
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
        id: 'alex',
        name: 'Alex Miller',
        initials: 'AM',
        time: '9:12a',
        preview: 'Highlight reel + transcript',
        selected: true,
        recruit: true,
      },
      {
        id: 'ben',
        name: 'Ben Davis',
        initials: 'BD',
        time: '8:40a',
        preview: 'Highlight reel + transcript',
        selected: false,
        recruit: true,
      },
      {
        id: 'chris',
        name: 'Chris Wilson',
        initials: 'CW',
        time: 'Yesterday',
        preview: 'Highlight reel + transcript',
        selected: false,
        recruit: true,
      },
      {
        id: 'david',
        name: 'David Taylor',
        initials: 'DT',
        time: 'Mon',
        preview: 'Highlight reel + transcript',
        selected: false,
        recruit: true,
      },
      { id: 'jack', name: 'Jack Brown', initials: 'JB', time: 'Mon', preview: 'Highlight reel + transcript', selected: false, recruit: true },
      { id: 'michael', name: 'Michael Smith', initials: 'MS', time: 'Mon', preview: 'Highlight reel + transcript', selected: false, recruit: true },
      { id: 'ryan', name: 'Ryan Johnson', initials: 'RJ', time: 'Sun', preview: 'Highlight reel + transcript', selected: false, recruit: true },
      { id: 'james', name: 'James Anderson', initials: 'JA', time: 'Sun', preview: 'Highlight reel + transcript', selected: false, recruit: true },
      { id: 'daniel', name: 'Daniel Harris', initials: 'DH', time: 'Sat', preview: 'Highlight reel + transcript', selected: false, recruit: true },
      { id: 'matt', name: 'Matt Thompson', initials: 'MT', time: 'Fri', preview: 'Highlight reel + transcript', selected: false, recruit: true },
      { id: 'luke', name: 'Luke Martin', initials: 'LM', time: 'Fri', preview: 'Highlight reel + transcript', selected: false, recruit: true },
      { id: 'sam', name: 'Sam Williams', initials: 'SW', time: 'Thu', preview: 'Highlight reel + transcript', selected: false, recruit: true },
    ],
  },
  recruit: {
    name: 'Alex Miller',
    position: 'Defender',
    classYear: 'Class of 2027',
    club: 'TopRostr FC',
    status: 'Unreviewed',
    film: {
      title: 'Fall highlights · DEF',
      duration: '4:12',
    },
    stats: [
      { label: 'GPA', value: '3.8' },
      { label: 'SAT', value: '1340' },
      { label: 'ACT', value: '29' },
      { label: 'Height', value: '5′9″' },
      { label: 'Weight', value: '150 lb' },
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
    name: 'TopRostr AI',
    message: 'RostrAI',
    detail: 'Alex is a 2027 defender from TopRostr FC. His highlight reel and transcript are ready to review. He is currently unreviewed.',
    summarySections: [
      { title: 'Academic profile', body: '3.8 GPA · 1340 SAT · 29 ACT. Review his transcript for course rigor and recent grades before assessing academic fit.' },
      { title: 'Physical profile', body: '5′9″ · 150 lb. Assess mobility, strength in duels, and recovery speed for your defensive system.' },
      { title: 'Film review', body: '4:12 of submitted highlights. Look for 1v1 defending, positioning, aerial duels, and passing under pressure. Highlights alone do not establish consistency across a full match.' },
      { title: 'Follow-up', body: 'Request full-match footage, an upcoming match schedule, and a club coach reference. Confirm his interest in your program and availability for camp.' },
    ],
    suggestions: [],
    contextChip: '@RostrAI',
    placeholder: 'Ask anything…',
    cue: 'YOU REVIEW BEFORE ANY ACTION',
  },
  decision: {
    prompt: 'Your call. Nothing saves until you choose.',
    choices: [
      { label: 'Pass', tone: 'quiet' },
      { label: 'Review later', tone: 'outline' },
      { label: 'Interested', tone: 'solid' },
      { label: 'Invite to camp', tone: 'outline' },
    ],
  },
  label: 'Illustrative product concept',
}
