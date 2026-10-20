import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import tailwindConfig from '../../tailwind.config.js'
import Founders from './Founders.jsx'

const FOUNDER_CARD_BACKGROUND = '#EBEBED'

function channel(value) {
  const srgb = value / 255
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  const normalized = hex.replace('#', '')
  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background))
  const darker = Math.min(luminance(foreground), luminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

const alejandroPlaying =
  'Played at NYCFC, Met Oval, and BW Gottschee before being recruited to play Division I soccer at Monmouth University in the CAA.'
const alejandroToday = 'Software Engineer at JPMorganChase.'
const jasonPlaying =
  'Played Division I soccer at Monmouth University before continuing his collegiate career at Colby College in the NESCAC.'
const jasonToday = 'Studied finance and economics at Monmouth and Colby.'

it('renders the PRD headline, both founders, and sized portraits', () => {
  render(<Founders />)

  expect(screen.getByRole('region', { name: 'Our Rostr' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: 'TopRostr' })).toHaveAttribute('src', '/brand/svg/mark-offwhite.svg')

  const alejandro = screen.getByRole('heading', { level: 3, name: 'Alejandro Suarez' })
  expect(alejandro).toHaveTextContent('Alejandro Suarez')
  expect(alejandro.textContent).toBe('Alejandro Suarez')
  expect(alejandro).toHaveClass('uppercase')
  expect(screen.getByText(alejandroPlaying)).toBeInTheDocument()
  expect(screen.getByText(alejandroToday)).toBeInTheDocument()

  const jason = screen.getByRole('heading', { level: 3, name: 'Jason Wallack' })
  expect(jason).toHaveTextContent('Jason Wallack')
  expect(jason.textContent).toBe('Jason Wallack')
  expect(jason).toHaveClass('uppercase')
  expect(screen.getByText(jasonPlaying)).toBeInTheDocument()
  expect(screen.getByText(jasonToday)).toBeInTheDocument()

  const roles = screen.getAllByText('Co-Founder')
  expect(roles).toHaveLength(2)
  for (const role of roles) {
    expect(role.textContent).toBe('Co-Founder')
    expect(role).toHaveClass('uppercase')
  }

  expect(screen.queryByText('Founders')).not.toBeInTheDocument()

  expect(screen.getAllByText(/We've lived the game and the recruiting process/)).toHaveLength(1)

  for (const name of ['Alejandro Suarez', 'Jason Wallack']) {
    const portrait = screen.getByRole('img', { name: `${name}, co-founder` })

    expect(portrait).toHaveAttribute('width', '250')
    expect(portrait).toHaveAttribute('height', '332')
    expect(portrait).toHaveAttribute('loading', 'lazy')
  }

  const webpSources = document.querySelectorAll('source[type="image/webp"]')

  expect(webpSources).toHaveLength(2)
  expect(webpSources[0]).toHaveAttribute('srcset', '/images/founders/alejandro-suarez.webp')
  expect(webpSources[1]).toHaveAttribute('srcset', '/images/founders/jason-wallack.webp')
})

it('darkens Co-Founder gold on the light card without changing brand gold', () => {
  render(<Founders />)

  const colors = tailwindConfig.theme.extend.colors
  const labelColor = colors['gold-on-light']
  const ratio = contrastRatio(labelColor, FOUNDER_CARD_BACKGROUND)

  expect(colors.gold).toBe('#E8B931')
  expect(labelColor).toBe('#85660F')
  expect(contrastRatio(colors.gold, FOUNDER_CARD_BACKGROUND)).toBeCloseTo(1.545, 2)
  expect(ratio).toBeGreaterThanOrEqual(4.5)
  expect(ratio).toBeCloseTo(4.517, 2)

  const roles = screen.getAllByText('Co-Founder')
  expect(roles).toHaveLength(2)
  for (const role of roles) {
    expect(role).toHaveClass('text-gold-on-light')
    expect(role).not.toHaveClass('text-gold')
  }

  expect(screen.getByText('more time')).toHaveClass('text-gold')
  expect(screen.getByText('winning')).toHaveClass('text-gold')
})
