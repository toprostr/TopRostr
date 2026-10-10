import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import Preview from '../Preview.jsx'
import { workspaceFixture } from './fixtures.js'
import WorkspacePreview from './WorkspacePreview.jsx'

afterEach(() => {
  cleanup()
})

it.each(['inbox', 'calendar', 'rostr', 'settings'])('places the AI chat after the main content in the %s view', (view) => {
  const { container } = render(<WorkspacePreview fixture={workspaceFixture} view={view} />)
  const ai = container.querySelector('[data-preview-pane="ai"]')
  expect(ai.parentElement.lastElementChild).toBe(ai)
  expect(ai.previousElementSibling).toBeTruthy()
  const topBar = container.querySelector('[data-preview-view]').firstElementChild
  expect(topBar).toHaveClass('h-[88px]')
  expect(topBar.querySelector('img[src="/brand/svg/mark-charcoal.svg"]')).toHaveAttribute('alt', 'TopRostr')
  expect(within(topBar).getByLabelText('Coach profile')).toHaveClass('bg-gold')
  expect(within(ai).getByText('@RostrAI')).toHaveClass('bg-gold')
  expect(within(ai).getByText('RostrAI')).toBeInTheDocument()
})

it('starts on Inbox and cycles through all four concepts with wraparound', () => {
  const { container } = render(<Preview />)
  const next = screen.getByRole('button', { name: 'Next workspace view' })
  const previous = screen.getByRole('button', { name: 'Previous workspace view' })
  expect(screen.getByRole('status')).toHaveTextContent('Inbox, slide 1 of 4')
  for (const [id, label] of [['calendar', 'Calendar'], ['rostr', 'Rostr'], ['settings', 'Settings'], ['inbox', 'Inbox']]) {
    fireEvent.click(next)
    expect(container.querySelector('figure [data-preview-view]')).toHaveAttribute('data-preview-view', id)
    expect(screen.getByRole('group', { name: `${label}, ${id === 'inbox' ? 1 : id === 'calendar' ? 2 : id === 'rostr' ? 3 : 4} of 4` })).toBeInTheDocument()
    expect(container.querySelectorAll('[data-preview-view]')).toHaveLength(3)
  }
  fireEvent.click(previous)
  expect(screen.getByRole('status')).toHaveTextContent('Settings, slide 4 of 4')
})

it.each([
  ['Calendar', 'October 5 – 11', 'Suggested · not added'],
  ['Rostr', '6 active', 'Filter to 2027 recruits'],
  ['Settings', 'Connected inbox', 'AI drafts replies — never sends'],
])('selects %s and renders its concept content without working product controls', (label, title, detail) => {
  const { container } = render(<Preview />)
  for (let i = 0; i < ['Inbox', 'Calendar', 'Rostr', 'Settings'].indexOf(label); i++) fireEvent.click(screen.getByRole('button', { name: 'Next workspace view' }))
  const mock = container.querySelector('figure [data-preview-view]')
  expect(within(mock).getByText(title)).toBeInTheDocument()
  expect(within(mock).getByText(detail)).toBeInTheDocument()
  expect(mock.querySelector('button, a, input, select, textarea')).toBeNull()
  expect(screen.getByRole('group', { name: new RegExp(`^${label},`) })).toBeInTheDocument()
  expect(mock.querySelector('[data-preview-nav]').textContent).toContain(label)
  if (label === 'Calendar') {
    expect(within(mock).getByText('Google Calendar · Connected')).toBeInTheDocument()
    expect(mock.querySelector('.calendar-event.bg-gold')).toBeTruthy()
  }
  expect(container.querySelector('#preview figcaption').textContent).toMatch(/Illustrative/)
})

it('supports keyboard selection and keeps focus on the slideshow controls', () => {
  render(<Preview />)
  const inbox = screen.getByRole('button', { name: 'Next workspace view' })
  inbox.focus()
  fireEvent.keyDown(inbox, { key: 'ArrowRight' })
  expect(screen.getByRole('status')).toHaveTextContent('Calendar, slide 2 of 4')
  expect(inbox).toHaveFocus()
  fireEvent.keyDown(inbox, { key: 'End' })
  expect(screen.getByRole('status')).toHaveTextContent('Settings, slide 4 of 4')
  fireEvent.keyDown(inbox, { key: 'Home' })
  expect(screen.getByRole('status')).toHaveTextContent('Inbox, slide 1 of 4')
  fireEvent.keyDown(inbox, { key: 'ArrowLeft' })
  expect(screen.getByRole('status')).toHaveTextContent('Settings, slide 4 of 4')
  fireEvent.keyDown(inbox, { key: 'Escape' })
  expect(screen.getByRole('status')).toHaveTextContent('Settings, slide 4 of 4')
})

const hidden = { hidden: true }

function renderMock() {
  const view = render(<Preview />)
  const mock = view.container.querySelector('figure [data-preview-step="workspace"]')

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

it('keeps the preview accessible without a visible headline or numbered section label', () => {
  render(<Preview />)

  expect(screen.queryByText('02 / THE TOPROSTR WORKSPACE')).not.toBeInTheDocument()
  expect(screen.queryByText(/Your staff's recruiting context/)).not.toBeInTheDocument()
  expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
  expect(screen.getByRole('region', { name: 'TopRostr workspace preview' })).toBeInTheDocument()
})

it('shows the illustrative label and the coach-review cue inside the mock', () => {
  const { mock } = renderMock()
  const caption = document.querySelector('#preview figcaption')

  const label = within(mock).getByText('Illustrative product concept', hidden)

  const labels = screen.getAllByText('Illustrative product concept', hidden)
  const outsideTheCard = [...document.querySelectorAll('#preview *')].filter(
    (element) =>
      element.textContent === 'Illustrative product concept' &&
      !element.closest('[aria-hidden="true"]'),
  )

  expect(labels).toHaveLength(3)
  expect(mock).toContainElement(label)
  expect(outsideTheCard).toHaveLength(0)
  expect(screen.queryByText(/Coach-approved actions/i, hidden)).not.toBeInTheDocument()
  expect(mock.querySelector('[data-preview-step="coach-approval"]')).toHaveTextContent('Invite to camp')
  expect(caption).toHaveTextContent('Alex Miller')
  expect(caption).toHaveTextContent('a highlight video thumbnail')
  expect(caption).toHaveTextContent('Pass / Review later / Interested')
  expect(caption).toHaveTextContent('Nothing is saved until the coach chooses')
})

it('uses TopRostr, the charcoal mark, and title-case fixtures', () => {
  const { mock } = renderMock()
  const topBar = mock.firstElementChild

  expect(within(mock).getByAltText('TopRostr')).toBeInTheDocument()
  expect(within(mock).getByText('RostrAI', hidden)).toBeInTheDocument()
  expect(within(mock).getByText(workspaceFixture.assistant.detail, hidden)).toBeInTheDocument()
  for (const section of workspaceFixture.assistant.summarySections) {
    expect(within(mock).getByText(section.title, hidden)).toBeInTheDocument()
    expect(within(mock).getByText(section.body, hidden)).toBeInTheDocument()
  }
  expect(within(mock).getByText('@RostrAI', hidden)).toHaveClass('bg-gold')
  expect(mock.textContent).not.toMatch(/saves start/)
  expect(mock.textContent).not.toMatch(/TESSA QUILLFEATHER|HARBOR & PINE FC/)
  expect(topBar.querySelector('img[src="/brand/svg/mark-charcoal.svg"]')).toHaveAttribute('alt', 'TopRostr')
  expect(mock.querySelector('.opacity-50')).toBeNull()
  expect(topBar.querySelector('[data-preview-nav]')).toHaveTextContent('InboxCalendarRostrSettings')
  expect(topBar.lastElementChild).toHaveClass('justify-end')
  expect(within(topBar.lastElementChild).getByLabelText('Coach profile')).toHaveTextContent(workspaceFixture.organization.coachInitials)
})

it('does not render buttons, links, or inputs inside the mock', () => {
  const { mock } = renderMock()

  expect(mock.querySelector('button, a, video, iframe, input, textarea, select')).toBeNull()
  expect(mock.querySelector('[role="button"]')).toBeNull()
  expect(mock.querySelector('[tabindex]')).toBeNull()

  for (const choice of workspaceFixture.decision.choices) {
    const match = screen.getByText(choice.label, hidden)

    expect(match.tagName).toBe('SPAN')
    expect(match.closest('button, a')).toBeNull()
    expect(match.closest('[data-preview-pane="ai"]')).toBeTruthy()
  }
})

it('renders a static highlight thumbnail and no video-service reference', () => {
  const { mock } = renderMock()
  const preview = mock.closest('#preview')
  const still = mock.querySelector('img[src="/images/hero/hero-1440x900.jpg"]')

  expect(still).toHaveAttribute('src', '/images/hero/hero-1440x900.jpg')
  expect(still).toHaveAttribute('alt', '')
  expect(still).toHaveAttribute('width', '1440')
  expect(still).toHaveAttribute('height', '900')
  expect(still).toHaveAttribute('loading', 'lazy')
  expect(still).toHaveAttribute('decoding', 'async')
  expect(still.className).toContain('object-cover')
  expect(still.closest('a, video, iframe')).toBeNull()
  expect(screen.getByText('Fall highlights · DEF', hidden)).toBeInTheDocument()
  expect(screen.getByText('4:12', hidden)).toBeInTheDocument()
  expect(within(mock).queryByText('Jump to 1:42', hidden)).not.toBeInTheDocument()
  expect(preview.innerHTML.toLowerCase()).not.toContain('youtube')
  expect(preview.innerHTML.toLowerCase()).not.toContain('youtu.be')
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
