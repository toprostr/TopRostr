/**
 * Fictional sample for the illustrative workspace.
 * Names, the school, and the club are invented. Nothing here is a real program.
 */
export const workspaceFixture = {
  organization: {
    program: 'Westmere College',
    team: "Women's Soccer",
    cycle: 'Fall 2027 cycle',
    staff: [
      { name: 'Elena Voss', role: 'Head Coach' },
      { name: 'Jordan Hale', role: 'Assistant Coach' },
    ],
  },
  navigation: [
    { id: 'inbox', label: 'Inbox', active: true },
    { id: 'rostr', label: 'Rostr', active: false },
    { id: 'calendar', label: 'Calendar', active: false },
    { id: 'activity', label: 'Activity', active: false },
  ],
  recruit: {
    name: 'Lila Calder',
    classYear: 'Class of 2027',
    position: 'Attacking midfielder',
    school: 'Ridgeline Preparatory',
    club: 'Harbor & Pine FC',
    source: 'coach@harborandpine.example',
    film: 'Left-footed combination in the final third. Two clips from a spring friendly.',
    clips: ['Spring friendly', 'Combination play', 'Final third'],
    notes:
      'Club coach asked which weekend camps still have room. No visit is booked.',
  },
  suggestion: {
    label: 'Suggested reply',
    intro: 'Proposes a draft. Does not send it.',
    body: "Ask Harbor & Pine FC for two full-match films and Lila Calder's spring exam dates. Leave any visit plans unwritten so the coach can decide.",
    cue: "Coach's choice. Nothing is sent or saved in this preview.",
    choices: ['Use this draft', 'Set aside'],
  },
}
