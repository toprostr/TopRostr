import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import Hero from './Hero.jsx'

const CTA_NAME = 'Join the Rostr — opens coach questionnaire in a new tab'

it('renders the PRD hero copy over a decorative full-bleed still', () => {
  const { container } = render(<Hero />)

  expect(screen.getByText('TECHNOLOGY BUILT FOR THE SIDELINE.')).toBeInTheDocument()
  const heading = screen.getByRole('heading', { level: 1, name: 'EVERY ADVANTAGE MATTERS.' })
  expect(heading).toHaveClass('text-[clamp(2.25rem,7.2vw,6.5rem)]', 'max-w-full')
  expect(
    screen.getByText(
      'Meet TopRostr. An AI-powered recruiting workspace built by former college players to help coaches spend less time managing recruiting and more time building winning programs.',
    ),
  ).toBeInTheDocument()
  expect(screen.getByText('01 — THE ADVANTAGE')).toBeInTheDocument()

  const still = container.querySelector('img')
  expect(still).not.toBeNull()
  expect(still).toHaveAttribute('alt', '')
  expect(still).toHaveAttribute('src', '/images/hero-placeholder.svg')
  expect(still).toHaveAttribute('width', '1440')
  expect(still).toHaveAttribute('height', '900')
  expect(still).toHaveAttribute('fetchpriority', 'high')
  expect(still).toHaveClass('absolute', 'object-cover')
  expect(still.className).not.toContain('border')
  expect(screen.queryByRole('img')).not.toBeInTheDocument()

  const cta = screen.getByRole('link', { name: CTA_NAME })
  expect(cta).toHaveAttribute('target', '_blank')
  expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
  expect(cta).toHaveTextContent('JOIN THE ROSTR')
  expect(cta).toHaveClass('rounded-[4px]')

  expect(container.querySelector('video')).not.toBeInTheDocument()
  expect(screen.getAllByRole('heading')).toHaveLength(1)
})
