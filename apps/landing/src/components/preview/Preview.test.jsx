import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import Preview from '../Preview.jsx'
import { workspaceFixture } from './fixtures.js'

afterEach(() => {
  cleanup()
})

const hidden = { hidden: true }

function renderMock() {
  const view = render(<Preview />)
  const mock = view.container.querySelector('[data-preview-step="workspace"]')

  expect(mock).toBeTruthy()
  expect(mock.parentElement).toHaveAttribute('aria-hidden', 'true')

  return { ...view, mock }
}

it('renders the fictional program, recruit, club, and other names', () => {
  renderMock()

  const names = [
    workspaceFixture.organization.program,
    workspaceFixture.recruit.name,
    workspaceFixture.recruit.club,
    ...workspaceFixture.inbox.messages.map((message) => message.name),
    ...workspaceFixture.navigation.map((item) => item.label),
  ]

  for (const name of names) {
    expect(name.length).toBeGreaterThan(0)
    expect(screen.getAllByText(name, hidden).length).toBeGreaterThan(0)
  }
})

it('shows the illustrative label and the coach-review cue inside the mock', () => {
  const { mock } = renderMock()

  const label = screen.getByText(workspaceFixture.label, hidden)
  const cue = screen.getByText(workspaceFixture.assistant.cue, hidden)

  expect(mock).toContainElement(label)
  expect(mock).toContainElement(cue)
  expect(cue.closest('[data-preview-step="coach-approval"]')).toBeTruthy()
})

it('does not render buttons, links, or inputs inside the mock', () => {
  const { mock } = renderMock()

  expect(mock.querySelector('button, a, input, textarea, select')).toBeNull()
  expect(mock.querySelector('[role="button"]')).toBeNull()
  expect(mock.querySelector('[tabindex]')).toBeNull()

  for (const choice of workspaceFixture.decision.choices) {
    const match = screen.getByText(choice.label, hidden)

    expect(match.tagName).toBe('SPAN')
    expect(match.closest('button, a')).toBeNull()
  }
})

it('keeps four distinct static preview steps', () => {
  const { mock } = renderMock()
  const steps = ['workspace', 'recruit-highlight', 'ai-suggestion', 'coach-approval']
  const root = mock.parentElement

  for (const step of steps) {
    const element = root.querySelector(`[data-preview-step="${step}"]`)

    expect(element).toBeTruthy()
    expect(element.classList.contains('preview-step')).toBe(true)
  }

  expect(root.querySelectorAll('[data-preview-step]')).toHaveLength(steps.length)
})
