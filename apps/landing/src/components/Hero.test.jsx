import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import Hero from './Hero.jsx'

const CTA_NAME = 'Join the Rostr — opens coach questionnaire in a new tab'

it('renders the PRD hero copy over a decorative full-bleed still', () => {
  const { container } = render(<Hero />)

  const kicker = screen.getByText('TECHNOLOGY BUILT FOR THE SIDELINE.')
  expect(kicker).toHaveClass('text-[15px]', 'font-bold')
  expect(kicker.className).not.toMatch(/tracking-/)
  const heading = screen.getByRole('heading', { level: 1, name: 'EVERY ADVANTAGE MATTERS.' })
  expect(heading).toHaveClass('text-[clamp(2.25rem,7.2vw,6.5rem)]', 'max-w-full')
  expect(heading.querySelector('span.block')).toHaveTextContent('MATTERS.')
  expect(heading.textContent).toContain('EVERY ADVANTAGE MATTERS.')
  expect(
    screen.getByText(
      'Meet TopRostr. An AI-powered recruiting workspace built by former college players to help coaches spend less time managing recruiting and more time building winning programs.',
    ),
  ).toBeInTheDocument()
  const index = screen.getByText('01 — THE ADVANTAGE')
  expect(index).toHaveClass('text-[14px]', 'font-bold')
  expect(index.className).not.toMatch(/tracking-/)
  expect(container.querySelector('.max-w-\\[950px\\]')).toBeTruthy()
  expect(container.querySelector('.h-px.w-12')).not.toBeInTheDocument()

  const picture = container.querySelector('picture')
  const sources = picture.querySelectorAll('source')
  const still = picture.querySelector('img')

  expect(sources[0]).toHaveAttribute('type', 'image/avif')
  expect(sources[0]).toHaveAttribute('srcset', '/images/hero/hero-1440x900.avif')
  expect(sources[1]).toHaveAttribute('type', 'image/webp')
  expect(sources[1]).toHaveAttribute(
    'srcset',
    '/images/hero/hero-1440x900.webp 1x, /images/hero/hero-2880x1800.webp 2x',
  )
  expect(still).toHaveAttribute('alt', '')
  expect(still).toHaveAttribute('src', '/images/hero/hero-1440x900.jpg')
  expect(still).toHaveAttribute('width', '1440')
  expect(still).toHaveAttribute('height', '900')
  expect(still).toHaveAttribute('fetchpriority', 'high')
  expect(still).toHaveClass('absolute', 'object-cover', 'object-[75%_50%]')
  expect(still.className).not.toContain('border')
  expect(container.querySelector('#hero')).toHaveClass('bg-[#16171B]')
  expect(container.querySelector('[aria-hidden="true"].absolute').className).toContain('62%')
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
  expect(container.innerHTML).not.toContain('hero-placeholder')

  const cta = screen.getByRole('link', { name: CTA_NAME })
  expect(cta).toHaveAttribute('target', '_blank')
  expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
  expect(cta).toHaveTextContent('JOIN THE ROSTR')
  expect(cta).toHaveClass('rounded-[4px]')

  expect(container.querySelector('video')).not.toBeInTheDocument()
  expect(screen.getAllByRole('heading')).toHaveLength(1)
})
