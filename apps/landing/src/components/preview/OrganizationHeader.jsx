function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

export default function OrganizationHeader({ organization }) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5 lg:px-6">
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-[0.16em] text-brand-gray">
          SAMPLE PROGRAM
        </p>
        <p className="mt-1 text-lg font-semibold text-off-white">
          {organization.program}
        </p>
        <p className="text-sm text-brand-gray">
          {organization.team} · {organization.cycle}
        </p>
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-3">
        {organization.staff.map((person) => (
          <li key={person.name} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/60 text-xs font-semibold text-gold"
            >
              {initials(person.name)}
            </span>
            <span>
              <span className="block text-sm font-semibold text-off-white">
                {person.name}
              </span>
              <span className="block text-xs text-brand-gray">{person.role}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
