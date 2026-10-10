/**
 * Fictional sample for the illustrative inbox.
 * The program, the recruit, the club, and the other names are invented.
 * Nothing here is a real program or a real person.
 */
export const workspaceFixture = {
  organization: {
    program: "Westmere Hollow College Women's Soccer",
    product: 'TopRostr',
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
        id: 'tessa',
        name: 'Tessa Quillfeather',
        initials: 'TQ',
        time: '9:12a',
        preview: 'Highlight reel + transcript',
        selected: true,
        recruit: true,
      },
      {
        id: 'rhys',
        name: 'Rhys Vantwell',
        initials: 'RV',
        time: '8:40a',
        preview: 'Spring schedule',
        selected: false,
        recruit: true,
      },
      {
        id: 'nia',
        name: 'Nia Oakhollow',
        initials: 'NO',
        time: 'Yesterday',
        preview: 'Question about ID camp',
        selected: false,
        recruit: true,
      },
      {
        id: 'kestrelmoor',
        name: 'Kestrelmoor Showcase',
        initials: 'KS',
        time: 'Mon',
        preview: 'Showcase field changes',
        selected: false,
        recruit: false,
      },
    ],
  },
  recruit: {
    name: 'Tessa Quillfeather',
    position: 'Goalkeeper',
    classYear: 'Class of 2027',
    club: 'Harbor & Pine FC',
    status: 'Unreviewed',
    film: {
      title: 'Fall highlights · GK',
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
    message: '3 new recruits today. Tessa’s reel is ready — first save at 1:42.',
    suggestions: [
      { label: 'Jump to 1:42', emphasis: true },
      { label: 'Draft a reply', emphasis: false },
    ],
    contextChip: '@Tessa Quillfeather',
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
  label: 'Illustrative product concept',
}
