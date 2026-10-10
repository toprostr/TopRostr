import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import App from './App.jsx'
import { googleFormUrl } from './config/site.js'

it('renders the six landing sections and points every CTA at the configured form', () => {
  render(<App />)

  expect(screen.getByRole('banner')).toHaveTextContent('Header')
  expect(document.querySelector('section#hero')).toHaveTextContent('Hero')
  expect(document.querySelector('section#founders')).toHaveTextContent('Founders')
  expect(document.querySelector('section#preview')).toHaveTextContent('Preview')
  expect(document.querySelector('section#join')).toHaveTextContent('Join the Rostr')
  expect(screen.getByRole('contentinfo')).toHaveTextContent('Footer')

  const ctaLinks = screen.getAllByRole('link')

  expect(ctaLinks.length).toBeGreaterThan(0)

  for (const link of ctaLinks) {
    expect(link).toHaveAttribute('href', googleFormUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
})
