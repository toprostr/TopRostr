import PreviewIcon from './PreviewIcon.jsx'
import { rosterGroups } from './concepts.js'

export default function RosterConcept() {
  return (
    <div className="min-w-0 overflow-x-auto bg-[#f4f4f5]">
      <div className="min-w-[720px] px-6 pt-7 pb-10 @min-[1024px]:px-9">
        <div className="mb-5 flex items-center gap-2.5">
          <p className="preview-heading text-[28px] font-bold tracking-tight">Rostr</p><span className="text-[13px] text-[#6b6b70]">6 active</span>
          <div className="ml-auto flex gap-2">{['Position', 'Class'].map(label => <span key={label} className="flex items-center gap-1.5 rounded-lg border border-[#d9d9dd] px-3 py-1.5 text-[13px]">{label}<PreviewIcon name="chevron" /></span>)}</div>
        </div>
        <div className="roster-row h-[34px] border-b border-[#d9d9dd] text-xs text-[#6b6b70]">
          {['Name', 'Pos', 'Class', 'Club', 'GPA', 'Last touch'].map(label => <span key={label}>{label}</span>)}
        </div>
        {rosterGroups.map((group, groupIndex) => <div key={group.label} className="mt-3.5">
          <div className="preview-heading flex h-10 items-center gap-2 pl-1 text-[15px] font-bold"><PreviewIcon name="chevron" />{group.label}<span className="text-[13px] font-medium text-[#9c9ca3]">2</span></div>
          {group.recruits.map(([initials, name, position, year, club, gpa, touch], rowIndex) => <div key={name} className="roster-row h-[52px] border-b border-[#d9d9dd] text-[14px]">
            <span className="flex items-center gap-2.5"><span className="preview-heading flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e2e2e5] text-[10px] font-bold">{initials}</span><span className="truncate font-medium">{name}</span></span>
            <span className="text-[#6b6b70]">{position}</span><span className="preview-heading">{year}</span><span className="truncate text-[#6b6b70]">{club}</span>
            <span className="preview-heading flex items-center gap-[5px]">{gpa}{groupIndex === 0 && rowIndex === 0 ? <PreviewIcon name="ai-dot" /> : null}</span>
            <span className="truncate text-[13px] text-[#6b6b70]">{touch}</span>
          </div>)}
        </div>)}
        <div className="preview-heading mt-3.5 flex h-10 items-center gap-2 pl-1 text-[15px] font-bold text-[#6b6b70]"><PreviewIcon name="arrow-right" />Pass<span className="text-[13px] font-medium text-[#9c9ca3]">4</span></div>
      </div>
    </div>
  )
}
