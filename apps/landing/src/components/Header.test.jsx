import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { track } from '@vercel/analytics'
import Header from './Header.jsx'

afterEach(() => {
  vi.unstubAllGlobals()
})

const CTA_NAME = 'Join the Rostr — opens coach questionnaire in a new tab'

it('links Mission and Platform to the scaffold sections and shows the final TR mark', () => {
  render(<Header />)

  expect(screen.getByRole('link', { name: 'Mission' })).toHaveAttribute('href', '#founders')
  expect(screen.getByRole('link', { name: 'Platform' })).toHaveAttribute('href', '#preview')
  expect(screen.getByRole('link', { name: 'Mission' })).toHaveClass('focus-visible:outline-gold')

  const wordmark = screen.getByRole('img', { name: 'TopRostr' })
  expect(wordmark).toHaveAttribute('src', '/brand/svg/mark-offwhite.svg')
  expect(wordmark).toHaveAttribute('width', '194')
  expect(wordmark).toHaveAttribute('height', '100')
  expect(wordmark.closest('a')).toHaveAttribute('href', '#hero')
  expect(wordmark.closest('a')).toHaveClass('focus-visible:outline-gold')

  const cta = screen.getByRole('link', { name: CTA_NAME })
  expect(cta).toHaveAttribute('target', '_blank')
  expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
  expect(cta).toHaveClass('focus-visible:outline-2')

  const toggle = screen.getByRole('button', { name: 'Open menu' })
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(toggle).toHaveClass('focus-visible:outline-gold')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('centers the desktop brand and navigation and provides hover and focus underlines', () => {
  render(<Header />)

  const logo = screen.getByRole('link', { name: 'TopRostr' })
  expect(logo.parentElement).toHaveClass('md:justify-center')
  expect(logo).toHaveClass('hover:after:opacity-100', 'focus-visible:after:opacity-100', 'after:bg-gold')
  for (const name of ['Mission', 'Platform']) {
    expect(screen.getByRole('link', { name })).toHaveClass('hover:underline', 'focus-visible:underline')
  }

  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
  const mobile = within(screen.getByRole('navigation', { name: 'Mobile' }))
  for (const name of ['Mission', 'Platform']) {
    expect(mobile.getByRole('link', { name })).toHaveClass('hover:underline', 'focus-visible:underline')
  }
})

it('traps focus inside the dialog, including Close, and returns focus to the toggle', () => {
  render(<Header />)

  const toggle = screen.getByRole('button', { name: 'Open menu' })
  toggle.focus()
  fireEvent.click(toggle)

  const dialog = screen.getByRole('dialog', { name: 'Menu' })
  const menu = within(dialog)
  const close = menu.getByRole('button', { name: 'Close menu' })
  const mission = menu.getByRole('link', { name: 'Mission' })
  const platform = menu.getByRole('link', { name: 'Platform' })
  const cta = menu.getByRole('link', { name: CTA_NAME })

  expect(dialog).toHaveAttribute('aria-modal', 'true')
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(mission).toHaveAttribute('href', '#founders')
  expect(platform).toHaveAttribute('href', '#preview')
  expect(close).toHaveFocus()
  expect(close).toHaveClass('focus-visible:outline-gold')

  fireEvent.keyDown(document, { key: 'a' })
  expect(dialog).toBeInTheDocument()

  cta.focus()
  fireEvent.keyDown(document, { key: 'Tab' })
  expect(close).toHaveFocus()

  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
  expect(cta).toHaveFocus()

  fireEvent.keyDown(document, { key: 'Escape' })

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(toggle).toHaveFocus()
  expect(toggle).toHaveAttribute('aria-expanded', 'false')

  fireEvent.click(toggle)
  const closeAgain = within(screen.getByRole('dialog', { name: 'Menu' })).getByRole('button', {
    name: 'Close menu',
  })
  fireEvent.click(closeAgain)

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(toggle).toHaveFocus()
  expect(screen.getByRole('button', { name: 'Open menu' })).toBe(toggle)
})

it('closes the mobile menu from a section link or the toggle', () => {
  render(<Header />)

  const toggle = screen.getByRole('button', { name: 'Open menu' })
  fireEvent.click(toggle)

  const dialog = screen.getByRole('dialog', { name: 'Menu' })
  fireEvent.click(within(dialog).getByRole('link', { name: 'Mission' }))

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  fireEvent.click(toggle)
  expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument()

  fireEvent.click(toggle)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('closes the open mobile menu when the viewport crosses the desktop breakpoint', () => {
  let onChange
  const media = {
    matches: false,
    addEventListener(_event, listener) {
      onChange = listener
    },
    removeEventListener() {},
  }
  vi.stubGlobal('matchMedia', () => media)

  render(<Header />)
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
  expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument()

  act(() => {
    onChange()
  })
  expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument()

  media.matches = true
  act(() => {
    onChange()
  })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('gives every mobile menu control a 44px target, tracks the header CTA, and opens the form in a new tab', () => {
  track.mockClear()
  render(<Header />)

  const toggle = screen.getByRole('button', { name: 'Open menu' })
  expect(toggle).toHaveClass('h-11', 'w-11')
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(toggle).toHaveAttribute('aria-controls', expect.any(String))
  expect(toggle).toHaveAttribute('aria-label', 'Open menu')

  fireEvent.click(toggle)

  const dialog = screen.getByRole('dialog', { name: 'Menu' })
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  expect(toggle).toHaveAttribute('aria-controls', dialog.id)
  expect(within(dialog).getByRole('button', { name: 'Close menu' })).toHaveClass('h-11', 'w-11')

  for (const name of ['Mission', 'Platform']) {
    const link = within(dialog).getByRole('link', { name })
    expect(link).toHaveClass('min-h-11', 'w-full')
  }

  const cta = within(dialog).getByRole('link', { name: CTA_NAME })
  expect(cta).toHaveClass('min-h-11', 'h-[53px]')
  expect(cta).toHaveAttribute('target', '_blank')
  expect(cta).toHaveAttribute('rel', 'noopener noreferrer')

  fireEvent.click(cta)
  expect(track).toHaveBeenCalledWith('cta_click', { location: 'header' })
})
