function SidebarIcon({ id }) {
  const common = {
    viewBox: '0 0 24 24',
    className: 'size-5 shrink-0',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (id === 'inbox') {
    return (
      <svg {...common}>
        <path d="M4 6.5h16v12H4z" />
        <path d="M4 8.5 12 14l8-5.5" />
      </svg>
    )
  }

  if (id === 'rostr') {
    return (
      <svg {...common}>
        <path d="M9 7h11M9 12h11M9 17h11" />
        <circle cx="4.5" cy="7" r="1" fill="currentColor" stroke="none" />
        <circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="4.5" cy="17" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (id === 'calendar') {
    return (
      <svg {...common}>
        <path d="M5 6.5h14v13H5z" />
        <path d="M8 4.5v3M16 4.5v3M5 10.5h14" />
      </svg>
    )
  }

  if (id === 'activity') {
    return (
      <svg {...common}>
        <path d="M3 12h3.5l2.2-5.5 3.6 11 2.2-5.5H21" />
      </svg>
    )
  }

  return null
}

export default function WorkspaceSidebar({ navigation }) {
  return (
    <ul className="flex flex-col py-2">
      {navigation.map((item) => (
        <li
          key={item.id}
          className={`flex flex-col items-center gap-1 border-l-2 px-1 py-3 text-center text-xs leading-tight lg:flex-row lg:gap-3 lg:px-4 lg:text-left lg:text-sm ${
            item.active
              ? 'border-gold bg-white text-[#1C1C1E]'
              : 'border-transparent text-[#1C1C1E]'
          }`}
        >
          <SidebarIcon id={item.id} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
