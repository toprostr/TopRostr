import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import Header from './Header.jsx'

afterEach(() => {
  vi.unstubAllGlobals()
})

const CTA_NAME = 'Join the Rostr — opens coach questionnaire in a new tab'

it('links Mission and Platform to the scaffold sections and shows the wordmark', () => {
  render(<Header />)

  expect(screen.getByRole('link', { name: 'Mission' })).toHaveAttribute('href', '#founders')
  expect(screen.getByRole('link', { name: 'Platform' })).toHaveAttribute('href', '#preview')
  expect(screen.getByRole('link', { name: 'Mission' })).toHaveClass('focus-visible:outline-gold')

  const wordmark = screen.getByRole('img', { name: 'TopRostr' })
  expect(wordmark).toHaveAttribute('src', '/brand/svg/lockup-horizontal-toprostr-dark-bg.svg')
  expect(wordmark).toHaveAttribute('width', '675')
  expect(wordmark).toHaveAttribute('height', '124')
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
