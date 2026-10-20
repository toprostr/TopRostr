import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import ImageLightbox from './ImageLightbox.jsx'

afterEach(() => {
  document.body.style.overflow = ''
})

function Harness() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open preview
      </button>
      <ImageLightbox open={open} label="Inbox workspace" onClose={() => setOpen(false)}>
        <a href="#detail">Workspace detail</a>
      </ImageLightbox>
    </>
  )
}

function openLightbox() {
  const opener = screen.getByRole('button', { name: 'Open preview' })
  opener.focus()
  fireEvent.click(opener)
  return opener
}

it('opens a labeled modal and locks body scroll', () => {
  document.body.style.overflow = 'scroll'
  render(<Harness />)

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  openLightbox()

  const dialog = screen.getByRole('dialog', { name: 'Inbox workspace' })
  expect(dialog).toHaveAttribute('aria-modal', 'true')
  expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
  expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('h-11', 'w-11')
  expect(document.body.style.overflow).toBe('hidden')
})

it('closes from Escape, the close button, and the backdrop, then returns focus and scroll', () => {
  document.body.style.overflow = 'scroll'
  render(<Harness />)
  const opener = openLightbox()

  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(opener).toHaveFocus()
  expect(document.body.style.overflow).toBe('scroll')

  openLightbox()
  fireEvent.click(screen.getByRole('button', { name: 'Close' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(opener).toHaveFocus()
  expect(document.body.style.overflow).toBe('scroll')

  openLightbox()
  fireEvent.click(screen.getByRole('dialog', { name: 'Inbox workspace' }))
  expect(screen.getByRole('dialog', { name: 'Inbox workspace' })).toBeInTheDocument()

  fireEvent.click(screen.getByTestId('lightbox-backdrop'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(opener).toHaveFocus()
  expect(document.body.style.overflow).toBe('scroll')
})

it('traps tab and shift-tab inside the dialog', () => {
  render(<Harness />)
  openLightbox()

  const close = screen.getByRole('button', { name: 'Close' })
  const detail = screen.getByRole('link', { name: 'Workspace detail' })

  expect(close).toHaveFocus()
  fireEvent.keyDown(document, { key: 'Tab' })
  expect(detail).toHaveFocus()
  fireEvent.keyDown(document, { key: 'Tab' })
  expect(close).toHaveFocus()
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
  expect(detail).toHaveFocus()
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
  expect(close).toHaveFocus()
  fireEvent.keyDown(document, { key: 'a' })
  expect(screen.getByRole('dialog', { name: 'Inbox workspace' })).toBeInTheDocument()
})
