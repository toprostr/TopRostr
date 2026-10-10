import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import Preview from '../Preview.jsx'
import { workspaceFixture } from './fixtures.js'

afterEach(() => {
  cleanup()
})

const eyebrow = '03 / THE TOPROSTR WORKSPACE'
const headline = 'ONE PROGRAM. ONE CONNECTED WORKSPACE.'
const body =
  'Your staff\'s recruiting context in one place, with AI working alongside you\u2014not making decisions for you.'

it('shows the illustrative label and the approved section copy', () => {
  render(<Preview />)

  expect(screen.getByText('Illustrative product concept')).toBeInTheDocument()
  expect(screen.getByText(eyebrow)).toBeInTheDocument()
  const headingEl = screen.getByRole('heading', { level: 2, name: headline })
  expect(headingEl.textContent).toContain('ONE PROGRAM. ONE CONNECTED WORKSPACE.')
  expect(screen.getByText(body)).toBeInTheDocument()
})

it('renders the fictional fixture names', () => {
  render(<Preview />)

  const names = [
    workspaceFixture.organization.program,
    workspaceFixture.organization.staff[0].name,
    workspaceFixture.organization.staff[1].name,
    workspaceFixture.recruit.name,
    workspaceFixture.recruit.school,
    workspaceFixture.recruit.club,
    ...workspaceFixture.navigation.map((item) => item.label),
  ]

  for (const name of names) {
    expect(name.length).toBeGreaterThan(0)
    // The mockup is hidden from the accessibility tree. The names are still rendered.
    expect(screen.getAllByText(name, { hidden: true }).length).toBeGreaterThan(0)
  }
})

it('does not render buttons inside the preview', () => {
  const { container } = render(<Preview />)
  const preview = within(container)

  expect(container.querySelector('button')).toBeNull()
  expect(container.querySelector('[role="button"]')).toBeNull()
  expect(container.querySelector('a')).toBeNull()

  for (const choice of workspaceFixture.suggestion.choices) {
    const matches = preview.getAllByText(choice, { hidden: true })

    expect(matches.length).toBeGreaterThan(0)

    for (const match of matches) {
      expect(match.tagName).not.toBe('BUTTON')
    }
  }
})

it('keeps each animation step as its own visible element', () => {
  const { container } = render(<Preview />)

  for (const step of ['workspace', 'recruit-highlight', 'ai-suggestion', 'coach-approval']) {
    const element = container.querySelector(`[data-preview-step="${step}"]`)

    expect(element).toBeTruthy()
    expect(element.classList.contains('preview-step')).toBe(true)
  }
})
