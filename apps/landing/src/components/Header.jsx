import { useEffect, useId, useRef, useState } from 'react'
import CTAButton from './CTAButton.jsx'

const NAV_LINKS = [
  { href: '#founders', label: 'Mission' },
  { href: '#preview', label: 'Platform' },
]

const DESKTOP_LINK_CLASS =
  'font-heading text-[13px] font-semibold uppercase tracking-[0.16em] text-off-white underline-offset-4 hover:underline hover:decoration-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold'

const MOBILE_LINK_CLASS =
  'block py-3 font-heading text-sm font-semibold uppercase tracking-[0.16em] text-off-white underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold'

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

  // Dialog pattern: move focus in when the menu opens, cycle Tab inside it,
  // and return focus to the toggle when Escape closes it.
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

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="border-b border-off-white/20 bg-charcoal">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 px-5 py-3 md:px-8 md:py-5 lg:px-16">
        <a
          href="#hero"
          className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <img
            src="/brand/svg/lockup-horizontal-toprostr-dark-bg.svg"
            alt="TopRostr"
            width="675"
            height="124"
            className="h-8 w-auto sm:h-10 md:h-12"
          />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={DESKTOP_LINK_CLASS}>
              {link.label}
            </a>
          ))}
          <CTAButton />
        </nav>

        <button
          type="button"
          ref={toggleRef}
          className="inline-flex h-11 w-11 items-center justify-center text-off-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen ? (
        <div
          id={menuId}
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="border-t border-off-white/20 px-5 py-6 md:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={MOBILE_LINK_CLASS} onClick={closeMenu}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <CTAButton className="mt-6 w-full" onClick={closeMenu} />
        </div>
      ) : null}
    </header>
  )
}
