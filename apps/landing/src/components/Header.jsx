import { useEffect, useId, useRef, useState } from 'react'
import CTAButton from './CTAButton.jsx'

const NAV_LINKS = [
  { href: '#founders', label: 'Mission' },
  { href: '#preview', label: 'Platform' },
]

const DESKTOP_LINK_CLASS =
  'font-heading text-[13px] font-semibold uppercase tracking-[0.16em] text-off-white underline-offset-4 hover:underline hover:decoration-gold focus-visible:underline focus-visible:decoration-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold'

const MOBILE_LINK_CLASS =
  'flex min-h-11 w-full items-center font-heading text-base font-semibold uppercase tracking-[0.14em] text-off-white underline-offset-4 hover:underline hover:decoration-gold focus-visible:underline focus-visible:decoration-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold'

function MenuIcon({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
      {open ? (
        <path
          d="M4 4 L16 16 M16 4 L4 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M3 5 H17 M3 10 H17 M3 15 H17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

function focusableMenuItems(menu) {
  if (!menu) {
    return []
  }

  return [...menu.querySelectorAll('a[href], button:not([disabled])')]
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const toggleRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined
    }

    const media = window.matchMedia('(min-width: 768px)')

    function closeOnDesktop() {
      if (media.matches) {
        setMenuOpen(false)
      }
    }

    media.addEventListener('change', closeOnDesktop)
    return () => media.removeEventListener('change', closeOnDesktop)
  }, [])

  // Dialog pattern: the Close control lives in the dialog, so Tab cycles
  // through it. Escape and Close both return focus to the menu toggle.
  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const menu = menuRef.current
    focusableMenuItems(menu)[0]?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
        toggleRef.current?.focus()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const items = focusableMenuItems(menu)
      const first = items[0]
      const last = items[items.length - 1]

      if (!first || !last) {
        return
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  function closeMenu(restoreFocus) {
    setMenuOpen(false)
    if (restoreFocus) {
      toggleRef.current?.focus()
    }
  }

  return (
    <header className="border-b border-off-white/20 bg-charcoal">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 px-5 py-3 md:justify-center md:gap-8 md:px-8 md:py-5 lg:px-16">
        <a
          href="#hero"
          className="relative inline-flex shrink-0 items-center rounded-sm after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-gold after:opacity-0 hover:after:opacity-100 focus-visible:after:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <img
            src="/brand/svg/mark-offwhite.svg"
            alt="TopRostr"
            width="194"
            height="100"
            className="h-6 w-auto sm:h-7 md:h-8"
          />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={DESKTOP_LINK_CLASS}>
              {link.label}
            </a>
          ))}
          <CTAButton size="nav" location="header" />
        </nav>

        <button
          type="button"
          ref={toggleRef}
          className="inline-flex h-11 w-11 items-center justify-center text-off-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label="Open menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon open={false} />
        </button>
      </div>

      {menuOpen ? (
        <div
          id={menuId}
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="border-t border-off-white/15 px-5 pt-2 pb-5 md:hidden"
        >
          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-off-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label="Close menu"
              onClick={() => closeMenu(true)}
            >
              <MenuIcon open />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-1">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={MOBILE_LINK_CLASS} onClick={() => closeMenu(false)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 border-t border-off-white/15 pt-4">
            <CTAButton
              size="nav"
              className="min-h-11 w-full"
              location="header"
              onClick={() => closeMenu(false)}
            />
          </div>
        </div>
      ) : null}
    </header>
  )
}
