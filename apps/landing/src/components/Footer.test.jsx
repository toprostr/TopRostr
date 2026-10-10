import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import Footer from './Footer.jsx'

it('shows the compact mark, pre-launch disclaimer, and copyright, with no links', () => {
  render(<Footer />)

  const footer = screen.getByRole('contentinfo')
  const mark = screen.getByRole('img', { name: 'TopRostr' })

  expect(mark).toHaveAttribute('src', '/brand/svg/mark-offwhite.svg')
  expect(mark).toHaveAttribute('width', '194')
  expect(mark).toHaveAttribute('height', '100')
  expect(footer).toHaveTextContent(
    'TopRostr is in pre-launch. The workspace on this page is an illustrative concept, not a released product.',
  )
  expect(footer).toHaveTextContent('© 2026 TopRostr')
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
})
