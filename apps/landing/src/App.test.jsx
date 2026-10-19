import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { track } from '@vercel/analytics'
import App from './App.jsx'
import { googleFormUrl } from './config/site.js'

const CTA_NAME = 'Join the Rostr — opens coach questionnaire in a new tab'

// Scaffold section ids. Header, main, and footer are landmarks and have no id.
const SECTION_IDS = ['hero', 'preview', 'founders', 'join']

it('renders the six sections by id or landmark and points only join CTAs at the form', () => {
  render(<App />)

  const header = screen.getByRole('banner')
  const main = screen.getByRole('main')
  const footer = screen.getByRole('contentinfo')

  expect([...main.children].map((section) => section.id)).toEqual(SECTION_IDS)

  expect(main).not.toContainElement(header)
  expect(main).not.toContainElement(footer)

  for (const id of SECTION_IDS) {
    const section = document.getElementById(id)
    expect(section).toBeInTheDocument()
    expect(main).toContainElement(section)
  }

  expect(
    screen.getByRole('heading', { level: 1, name: 'EVERY ADVANTAGE MATTERS.' }),
  ).toBeInTheDocument()

  const mission = screen.getByRole('link', { name: 'Mission' })
  expect(mission).toHaveAttribute('href', '#founders')
  expect(mission).not.toHaveAttribute('target', '_blank')

  const ctaLinks = screen.getAllByRole('link', { name: CTA_NAME })

  expect(ctaLinks.length).toBeGreaterThan(0)

  for (const link of ctaLinks) {
    expect(link).toHaveAttribute('href', googleFormUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
})

it('opens the header, hero, join, and mobile menu CTAs in a new tab', () => {
  render(<App />)

  const links = [
    within(screen.getByRole('banner')).getByRole('link', { name: CTA_NAME }),
    within(document.getElementById('hero')).getByRole('link', { name: CTA_NAME }),
    within(document.getElementById('join')).getByRole('link', { name: CTA_NAME }),
  ]

  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
  links.push(
    within(screen.getByRole('dialog', { name: 'Menu' })).getByRole('link', { name: CTA_NAME }),
  )

  expect(links).toHaveLength(4)

  for (const link of links) {
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
})

it('tracks each Join the Rostr click with its location and still opens the form', () => {
  track.mockClear()
  render(<App />)

  const headerCta = within(screen.getByRole('banner')).getByRole('link', { name: CTA_NAME })
  const heroCta = within(document.getElementById('hero')).getByRole('link', { name: CTA_NAME })
  const joinCta = within(document.getElementById('join')).getByRole('link', { name: CTA_NAME })

  fireEvent.click(headerCta)
  fireEvent.click(heroCta)
  fireEvent.click(joinCta)

  expect(track).toHaveBeenNthCalledWith(1, 'cta_click', { location: 'header' })
  expect(track).toHaveBeenNthCalledWith(2, 'cta_click', { location: 'hero' })
  expect(track).toHaveBeenNthCalledWith(3, 'cta_click', { location: 'join' })

  for (const link of [headerCta, heroCta, joinCta]) {
    expect(link).toHaveAttribute('href', googleFormUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }

  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
  const mobileCta = within(screen.getByRole('dialog', { name: 'Menu' })).getByRole('link', {
    name: CTA_NAME,
  })

  expect(mobileCta).toHaveAttribute('href', googleFormUrl)
  expect(mobileCta).toHaveAttribute('target', '_blank')
  fireEvent.click(mobileCta)
  expect(track).toHaveBeenNthCalledWith(4, 'cta_click', { location: 'header' })
})
