import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import Hero from './Hero.jsx'

const CTA_NAME = 'Join the Rostr — opens coach questionnaire in a new tab'

it('renders the PRD hero copy, a single h1, and a sized placeholder still', () => {
  const { container } = render(<Hero />)

  expect(screen.getByText('TECHNOLOGY BUILT FOR THE SIDELINE.')).toBeInTheDocument()
  expect(
    screen.getByRole('heading', { level: 1, name: 'EVERY ADVANTAGE MATTERS.' }),
  ).toBeInTheDocument()
  expect(
    screen.getByText(
      'Meet TopRostr. An AI-powered recruiting workspace built by former college players to help coaches spend less time managing recruiting and more time building winning programs.',
    ),
  ).toBeInTheDocument()

  const still = screen.getByRole('img', {
    name: 'Placeholder hero still. A photograph has not been supplied yet.',
  })
  expect(still).toHaveAttribute('src', '/images/hero-placeholder.svg')
  expect(still).toHaveAttribute('width', '1440')
  expect(still).toHaveAttribute('height', '900')

  const cta = screen.getByRole('link', { name: CTA_NAME })
  expect(cta).toHaveAttribute('target', '_blank')
  expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
  expect(cta).toHaveTextContent('JOIN THE ROSTR')

  expect(container.querySelector('video')).not.toBeInTheDocument()
  expect(screen.getAllByRole('heading')).toHaveLength(1)
})
