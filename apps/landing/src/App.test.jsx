import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import App from './App.jsx'
import { googleFormUrl } from './config/site.js'

const CTA_NAME = 'Join the Rostr — opens coach questionnaire in a new tab'

// Scaffold section ids. Header, main, and footer are landmarks and have no id.
const SECTION_IDS = ['hero', 'founders', 'preview', 'join']

it('renders the six sections by id or landmark and points only join CTAs at the form', () => {
  render(<App />)

  const header = screen.getByRole('banner')
  const main = screen.getByRole('main')
  const footer = screen.getByRole('contentinfo')

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
