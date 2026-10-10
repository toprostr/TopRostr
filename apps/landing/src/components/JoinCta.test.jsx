import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { googleFormUrl } from '../config/site.js'
import JoinCta from './JoinCta.jsx'

const eyebrow = '04 / COACHES WANTED'
const headline = "THIS TIME, WE'RE RECRUITING YOU."
const paragraph =
  "Behind every great program are coaches who give everything to their teams. We're bringing those coaches together to help create technology that supports the work they do every day."
const buttonText = 'JOIN THE ROSTR'
const communityLine =
  'Join our early community, share your perspective, and stay connected as we build TopRostr.'
const accessibleName =
  'Join the Rostr — opens coach questionnaire in a new tab'

afterEach(() => {
  cleanup()
})

function countOccurrences(text, phrase) {
  return text.replace(/\s+/g, ' ').split(phrase).length - 1
}

it('renders the final CTA copy from the landing PRD', () => {
  render(<JoinCta />)

  expect(screen.getByText(eyebrow)).toBeInTheDocument()
  expect(screen.getByRole('heading', { level: 2, name: headline })).toBeInTheDocument()
  expect(screen.getAllByText(paragraph)).toHaveLength(1)
  expect(screen.getByText(buttonText)).toBeInTheDocument()
  expect(screen.getByText(paragraph)).not.toHaveTextContent(communityLine)
})

it('shows the community line exactly once, directly below the button', () => {
  render(<JoinCta />)

  const section = document.getElementById('join')
  const link = screen.getByRole('link', { name: accessibleName })

  expect(countOccurrences(section.textContent, communityLine)).toBe(1)
  expect(screen.getAllByText(communityLine)).toHaveLength(1)
  expect(link.nextElementSibling).toHaveTextContent(communityLine)
  expect(link.compareDocumentPosition(screen.getByText(communityLine))).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  )
})

it('opens the single configured form URL in a new tab', () => {
  render(<JoinCta />)

  const section = document.getElementById('join')
  const links = screen.getAllByRole('link')

  expect(section).toHaveClass('bg-brand-gray')
  expect(links).toHaveLength(1)

  const link = links[0]

  expect(link).toHaveTextContent(buttonText)
  expect(link).toHaveAttribute('href', googleFormUrl)
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  expect(link).toHaveAttribute('aria-label', accessibleName)
  expect(link).toHaveClass('bg-gold', 'text-charcoal')
})
