import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import Hero from './Hero.jsx'

it('renders concise hero copy over a decorative full-bleed still', () => {
  const { container } = render(<Hero />)

  expect(screen.queryByText('TECHNOLOGY BUILT FOR THE SIDELINE.')).not.toBeInTheDocument()
  const heading = screen.getByRole('heading', { level: 1, name: 'EVERY ADVANTAGE MATTERS.' })
  expect(heading).toHaveClass('text-[clamp(2.25rem,7.2vw,6.5rem)]', 'max-w-full')
  expect(heading.querySelector('span.block')).toHaveTextContent('MATTERS.')
  expect(heading.textContent).toContain('EVERY ADVANTAGE MATTERS.')
  expect(
    screen.getByText(
      'An AI-powered recruiting workspace that gives coaches more time to focus on winning.',
    ),
  ).toBeInTheDocument()
  expect(screen.queryByText('01 — THE ADVANTAGE')).not.toBeInTheDocument()
  expect(container.querySelector('.h-px.w-12')).not.toBeInTheDocument()

  const picture = container.querySelector('picture')
  const sources = picture.querySelectorAll('source')
  const still = picture.querySelector('img')

  expect(sources[0]).toHaveAttribute('media', '(max-width: 1279px)')
  expect(sources[0]).toHaveAttribute('srcset', '/images/hero/hero-field-only-1440x900.webp')
  expect(sources[1]).toHaveAttribute('type', 'image/avif')
  expect(sources[1]).toHaveAttribute('srcset', '/images/hero/hero-ball-right-1440x900.avif')
  expect(sources[2]).toHaveAttribute('type', 'image/webp')
  expect(sources[2]).toHaveAttribute(
    'srcset',
    '/images/hero/hero-ball-right-1440x900.webp 1x, /images/hero/hero-ball-right-2880x1800.webp 2x',
  )
  expect(still).toHaveAttribute('alt', '')
  expect(still).toHaveAttribute('src', '/images/hero/hero-ball-right-1440x900.jpg')
  expect(still).toHaveAttribute('width', '1440')
  expect(still).toHaveAttribute('height', '900')
  expect(still).toHaveAttribute('fetchpriority', 'high')
  expect(still).toHaveClass('absolute', 'object-cover', 'object-right', 'lg:object-[75%_50%]')
  expect(still.className).not.toContain('border')
  expect(container.querySelector('#hero')).toHaveClass('bg-[#16171B]')
  expect(container.querySelector('[aria-hidden="true"].absolute').className).toContain('62%')
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
  expect(container.innerHTML).not.toContain('hero-placeholder')

  expect(screen.queryByRole('link')).not.toBeInTheDocument()
  expect(screen.queryByRole('button')).not.toBeInTheDocument()

  expect(container.querySelector('video')).not.toBeInTheDocument()
  expect(screen.getAllByRole('heading')).toHaveLength(1)
})
