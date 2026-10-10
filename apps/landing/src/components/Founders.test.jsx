import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import Founders from './Founders.jsx'

const alejandroPlaying =
  'Played at NYCFC, Met Oval, and BW Gottschee before being recruited to play Division I soccer at Monmouth University in the CAA.'
const alejandroToday = 'Software Engineer at JPMorganChase.'
const jasonPlaying =
  'Played Division I soccer at Monmouth University before continuing his collegiate career at Colby College in the NESCAC.'
const jasonToday = 'Studied finance and economics at Monmouth and Colby.'

it('renders the PRD headline, both founders, and sized portraits', () => {
  render(<Founders />)

  const foundersHeading = screen.getByRole('heading', {
    level: 2,
    name: "WE KNOW THE GAME. WE KNOW WHAT'S NEXT.",
  })
  expect(foundersHeading.textContent).toContain("WE KNOW THE GAME. WE KNOW WHAT'S NEXT.")

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

  expect(screen.getAllByText(/We've lived the recruiting process/)).toHaveLength(1)

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
