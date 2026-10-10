export default function RecruitPanel({ recruit, organization }) {
  return (
    <div className="min-w-0 px-4 py-5 sm:px-5 lg:px-6">
      <p className="text-sm text-brand-gray md:hidden">
        {organization.program} · {organization.team}
      </p>
      <p className="mt-2 text-xl font-semibold text-off-white md:mt-0">
        {recruit.name}
      </p>
      <p className="mt-1 text-sm text-brand-gray">
        {recruit.classYear} · {recruit.position}
      </p>
      <p className="mt-4 text-sm text-off-white">{recruit.school}</p>
      <p className="text-sm text-off-white">{recruit.club}</p>
      <p className="mt-3 break-words text-sm text-brand-gray">
        Opened from Inbox · {recruit.source}
      </p>

      <div
        data-preview-step="recruit-highlight"
        className="preview-step mt-5 border-l-2 border-gold bg-gold/10 px-4 py-4"
      >
        <p className="text-xs font-semibold tracking-[0.16em] text-gold">
          RECRUIT CONTEXT
        </p>
        <div className="mt-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-brand-gray">
            FILM
          </p>
          <p className="mt-1 text-sm leading-relaxed text-off-white">{recruit.film}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {recruit.clips.map((clip) => (
              <li
                key={clip}
                className="rounded-md border border-off-white/15 bg-charcoal/50 px-3 py-2 text-sm text-off-white"
              >
                {clip}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-brand-gray">
            NOTES
          </p>
          <p className="mt-1 text-sm leading-relaxed text-off-white">{recruit.notes}</p>
        </div>
      </div>
    </div>
  )
}
