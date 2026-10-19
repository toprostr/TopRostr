import PreviewIcon from './PreviewIcon.jsx'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = ['8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm']


// Illustrative staff schedule; times are hours on the weekly grid.
const events = [
  { day: 0, start: 9, duration: 1, title: 'Recruiting review', time: '9:00 am' },
  { day: 0, start: 11, duration: 1, title: 'Alex · call', time: '11:00 am' },
  { day: 0, start: 15, duration: 2, title: 'Team practice', time: '3:00 pm' },
  { day: 1, start: 9, duration: 2, title: 'Ben · campus visit', time: '9:00 am' },
  { day: 1, start: 12, duration: 1, title: 'Club coach call', time: '12:00 pm' },
  { day: 1, start: 15, duration: 2, title: 'Team practice', time: '3:00 pm' },
  { day: 2, start: 9, duration: 1, title: 'Film review', time: '9:00 am' },
  { day: 2, start: 11, duration: 1, title: 'Chris · call', time: '11:00 am' },
  { day: 2, start: 14, duration: 2, title: 'Team practice', time: '2:00 pm' },
  { day: 2, start: 17, duration: 1, title: 'Camp planning', time: '5:00 pm' },
  { day: 3, start: 9, duration: 2, title: 'Alex · campus visit', time: '9:00 am' },
  { day: 3, start: 13, duration: 2, title: 'Team practice', time: '1:00 pm' },
  { day: 3, start: 16, duration: 1, title: 'Ben’s coach · call', time: '4:00 pm' },
  { day: 4, start: 9, duration: 1, title: 'Recruiting review', time: '9:00 am' },
  { day: 4, start: 11, duration: 1, title: 'Jack · call', time: '11:00 am' },
  { day: 4, start: 14, duration: 2, title: 'Pre-game practice', time: '2:00 pm' },
  { day: 5, start: 9, duration: 3, title: 'Recruit training camp', time: '9:00 am – noon' },
  { day: 5, start: 14, duration: 2, title: 'TopRostr FC vs Pacific Elite', time: '2:00 pm · Watch Alex' },
  { day: 6, start: 9, duration: 2, title: 'Camp · second session', time: '9:00 am' },
  { day: 6, start: 13, duration: 2, title: 'Chris’s match?', time: '1:00 pm', suggested: true },
  { day: 6, start: 16, duration: 2, title: 'University game', time: '4:00 pm' },
]

export default function CalendarConcept() {
  return (
    <div className="min-w-0 overflow-x-auto bg-[#f4f4f5]">
      <div className="min-w-[680px] px-6 pt-[22px] pb-6">
        <div className="flex items-center gap-2.5">
          <p className="preview-heading text-2xl font-bold tracking-tight">October 5 – 11</p>
          <span className="flex items-center gap-3 px-1"><PreviewIcon name="arrow-left" /><PreviewIcon name="arrow-right" /></span>
          <span className="ml-auto rounded-lg border border-[#d9d9dd] px-2.5 py-1.5 text-xs"><span className="text-[#6b6b70]">Next </span>Sat 10 · Training camp</span>
          <span className="preview-heading rounded-lg border border-[#d9d9dd] px-3.5 py-1.5 text-[13px] font-bold">Today</span>
        </div>
        <p className="mt-3 flex items-center gap-2 text-[12px] text-[#6b6b70]">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
          Google Calendar · Connected
        </p>
        <div className="mt-3.5 grid grid-cols-[56px_repeat(7,minmax(0,1fr))]">
          <span />
          {days.map((day, index) => <div key={day} className="flex h-11 items-center gap-1.5 pl-2 text-xs text-[#6b6b70]">
            {day}<span className={`preview-heading flex size-[26px] items-center justify-center text-[15px] ${index === 3 ? 'rounded-full bg-gold font-bold text-charcoal' : 'text-[#18181b]'}`}>{index + 5}</span>
          </div>)}
        </div>
        <div className="relative h-[695px]">
          {hours.map((hour, index) => <div key={hour} className="pointer-events-none absolute right-0 left-0 z-[1] flex items-center" style={{ top: 34 + index * 55 }}>
            <span className="w-14 shrink-0 pl-1 text-[11px] text-[#9c9ca3]">{hour}</span><span className="h-px flex-1 bg-[#d9d9dd]" />
          </div>)}
          <div className="absolute top-0 right-0 bottom-0 left-14 grid grid-cols-7 border-r border-b border-[#d9d9dd]">
            {days.map((day, index) => <div key={day} className={`border-l border-[#d9d9dd] ${index === 3 ? 'bg-[#4b4d54]' : ''}`} />)}
            {events.map(event => <div
              key={`${event.day}-${event.start}`}
              className={`calendar-event z-[2] border text-charcoal ${event.suggested ? 'border-dashed border-gold bg-gold/10' : 'border-gold bg-gold'}`}
              style={{ top: 34 + (event.start - 8) * 55, left: `calc(${event.day * 100 / 7}% + 4px)`, height: event.duration * 55 - 6 }}
            >
              <p className="text-xs font-semibold">{event.title}</p>
              <p className="text-[11px]">{event.time}</p>
              {event.suggested ? <p className="text-[11px]">Suggested · not added</p> : null}
            </div>)}
          </div>
        </div>
      </div>
    </div>
  )
}
