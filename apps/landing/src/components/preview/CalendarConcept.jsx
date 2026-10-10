import PreviewIcon from './PreviewIcon.jsx'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = ['8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm']

export default function CalendarConcept() {
  return (
    <div className="min-w-0 overflow-x-auto bg-[#f4f4f5]">
      <div className="min-w-[680px] px-6 pt-[22px] pb-6">
        <div className="flex items-center gap-2.5">
          <p className="preview-heading text-2xl font-bold tracking-tight">October 5 – 11</p>
          <span className="flex items-center gap-3 px-1"><PreviewIcon name="arrow-left" /><PreviewIcon name="arrow-right" /></span>
          <span className="ml-auto rounded-lg border border-[#d9d9dd] px-2.5 py-1.5 text-xs"><span className="text-[#6b6b70]">Next </span>Nov 14 · ID camp</span>
          <span className="preview-heading rounded-lg border border-[#d9d9dd] px-3.5 py-1.5 text-[13px] font-bold">Today</span>
        </div>
        <div className="mt-3.5 grid grid-cols-[56px_repeat(7,minmax(0,1fr))]">
          <span />
          {days.map((day, index) => <div key={day} className="flex h-11 items-center gap-1.5 pl-2 text-xs text-[#6b6b70]">
            {day}<span className={`preview-heading flex size-[26px] items-center justify-center text-[15px] ${index === 3 ? 'rounded-full bg-[#0a0a0a] font-bold text-white' : 'text-[#18181b]'}`}>{index + 5}</span>
          </div>)}
        </div>
        <div className="relative h-[695px]">
          {hours.map((hour, index) => <div key={hour} className="absolute right-0 left-0 flex items-center" style={{ top: 34 + index * 55 }}>
            <span className="w-14 shrink-0 pl-1 text-[11px] text-[#9c9ca3]">{hour}</span><span className="h-px flex-1 bg-[#d9d9dd]" />
          </div>)}
          <div className="absolute top-0 right-0 bottom-0 left-14 grid grid-cols-7 border-r border-b border-[#d9d9dd]">
            {days.map((day, index) => <div key={day} className={`border-l border-[#d9d9dd] ${index === 3 ? 'bg-white/60' : ''}`} />)}
            <div className="absolute top-1.5 left-1 h-[22px] w-[calc(42.857%-8px)] rounded-[5px] bg-[#e2e2e5] pl-2 text-[11px] leading-[22px] text-[#6b6b70]">NCAA quiet period</div>
            <div className="calendar-event top-[477px] left-[calc(42.857%+4px)] h-[49px] border border-[#d9d9dd] bg-white">
              <p className="text-xs font-semibold">Rhys’s coach</p><p className="text-[11px] text-[#6b6b70]">Call · 4:00 pm</p>
            </div>
            <div className="calendar-event top-[367px] left-[calc(71.429%+4px)] h-[104px] bg-[#0a0a0a] text-white">
              <p className="text-xs font-semibold">Harbor &amp; Pine FC vs Pacific Elite</p><p className="text-[11px] text-[#b4b4ba]">2:00 pm · Watch Tessa</p>
            </div>
            <div className="calendar-event top-[312px] left-[calc(85.714%+4px)] h-[104px] border border-dashed border-[#9c9ca3] text-[#6b6b70]">
              <p className="text-xs font-semibold">Nia’s match?</p><p className="text-[11px]">Suggested · not added</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
