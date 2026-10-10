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
  const caption = document.querySelector('#preview figcaption')

  const label = screen.getByText('Illustrative product concept', hidden)
  const cue = screen.getByText(workspaceFixture.assistant.cue, hidden)

  const labels = screen.getAllByText('Illustrative product concept', hidden)
  const outsideTheCard = [...document.querySelectorAll('#preview *')].filter(
    (element) =>
      element.textContent === 'Illustrative product concept' &&
      !element.closest('[aria-hidden="true"]'),
  )

  expect(labels).toHaveLength(1)
  expect(mock).toContainElement(label)
  expect(outsideTheCard).toHaveLength(0)
  expect(screen.queryByText(/Coach-approved actions/i, hidden)).not.toBeInTheDocument()
  expect(mock).toContainElement(cue)
  expect(cue.closest('[data-preview-step="coach-approval"]')).toBeTruthy()
  expect(caption).toHaveTextContent('Lila Calder')
  expect(caption).toHaveTextContent('Jump to 1:42')
  expect(caption).toHaveTextContent('Draft a reply')
  expect(caption).toHaveTextContent('Pass / Review later / Interested')
  expect(caption).toHaveTextContent('Nothing is saved until the coach chooses')
})

it('uses TopRostr, the charcoal mark, and title-case fixtures', () => {
  const { mock } = renderMock()
  const nav = mock.querySelector('[data-preview-nav]')

  expect(screen.getByText('TopRostr', hidden)).toBeInTheDocument()
  expect(screen.getByText('TopRostr AI', hidden)).toBeInTheDocument()
  expect(screen.getByText(/first save at 1:42/i, hidden)).toBeInTheDocument()
  expect(mock.textContent).not.toMatch(/RostrAI/)
  expect(mock.textContent).not.toMatch(/saves start/)
  expect(mock.textContent).not.toMatch(/LILA CALDER|HARBOR & PINE FC/)
  expect(mock.querySelector('img[src="/brand/svg/mark-charcoal.svg"]')).toBeTruthy()
  expect(mock.querySelector('.opacity-50')).toBeNull()
  expect(nav.className).toContain('hidden')
  expect(nav.className).toContain('md:flex')
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
