export default function RecruitPanel({ recruit, organization }) {
  return (
    <div className="min-w-0 px-4 py-5 sm:px-5 lg:px-6">
      <p className="text-sm text-[#3A3D44] md:hidden">
        {organization.program} · {organization.team}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2 md:mt-0">
        <p className="text-xl font-semibold text-[#1C1C1E]">{recruit.name}</p>
        <span className="cursor-default rounded-full bg-gold px-2.5 py-0.5 text-xs font-semibold text-[#1C1C1E]">
          Interested
        </span>
      </div>
      <p className="mt-1 text-sm text-[#3A3D44]">
        {recruit.classYear} · {recruit.position}
      </p>
      <p className="mt-4 text-sm text-[#1C1C1E]">{recruit.school}</p>
      <p className="text-sm text-[#1C1C1E]">{recruit.club}</p>
      <p className="mt-3 break-words text-sm text-[#3A3D44]">
        Opened from Inbox · {recruit.source}
      </p>

      <div
        data-preview-step="recruit-highlight"
        className="preview-step mt-5 border-l-2 border-gold bg-[#EEEEF0] px-4 py-4"
      >
        <p className="text-xs font-semibold tracking-[0.16em] text-[#1C1C1E]">
          RECRUIT CONTEXT
        </p>
        <div className="mt-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#3A3D44]">
            FILM
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#1C1C1E]">{recruit.film}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {recruit.clips.map((clip) => (
              <li
                key={clip}
                className="rounded-md border border-[#D4D4D8] bg-white px-3 py-2 text-sm text-[#1C1C1E]"
              >
                {clip}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#3A3D44]">
            NOTES
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#1C1C1E]">{recruit.notes}</p>
        </div>
      </div>
    </div>
  )
}
