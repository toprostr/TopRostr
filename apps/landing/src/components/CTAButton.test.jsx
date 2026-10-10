import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import CTAButton from './CTAButton.jsx'
import { googleFormUrl } from '../config/site.js'

const CTA_NAME = 'Join the Rostr — opens coach questionnaire in a new tab'

it('opens the configured form in a new tab with the questionnaire label', () => {
  render(<CTAButton />)

  const link = screen.getByRole('link', { name: CTA_NAME })

  expect(link).toHaveAttribute('href', googleFormUrl)
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  expect(link).toHaveAttribute('data-cta', 'join')
  expect(link).toHaveTextContent('JOIN THE ROSTR')
  expect(link).toHaveClass(
    'bg-gold',
    'rounded-[4px]',
    'focus-visible:outline-off-white',
    'focus-visible:outline-2',
  )
})

it('accepts a gold-on-gray variant and extra class names for the final CTA band', () => {
  render(<CTAButton variant="gold-on-gray" className="mt-6 w-full" />)

  const link = screen.getByRole('link', { name: CTA_NAME })

  expect(link).toHaveClass(
    'mt-6',
    'w-full',
    'bg-gold',
    'text-charcoal',
    'focus-visible:outline-charcoal',
  )
  expect(link.querySelector('[aria-hidden="true"]')).toHaveTextContent('↗')
})

it('hides the arrow from assistive tech and keeps the questionnaire name', () => {
  const { rerender } = render(<CTAButton />)

  const link = screen.getByRole('link', { name: CTA_NAME })
  const arrow = link.querySelector('[aria-hidden="true"]')

  expect(link).toHaveAttribute('aria-label', CTA_NAME)
  expect(link).toHaveTextContent('JOIN THE ROSTR')
  expect(arrow).toHaveTextContent('↗')
  expect(arrow).toHaveAttribute('aria-hidden', 'true')
  expect(link.className).not.toMatch(/justify-between/)
  expect(link).toHaveClass('gap-2', 'font-bold')

  rerender(<CTAButton size="nav" />)
  expect(screen.getByRole('link', { name: CTA_NAME })).toHaveClass(
    'h-[53px]',
    'min-w-[190px]',
    'text-[13px]',
  )

  rerender(<CTAButton size="hero" />)
  expect(screen.getByRole('link', { name: CTA_NAME })).toHaveClass(
    'h-[57px]',
    'w-[260px]',
    'text-[16px]',
  )
})
