import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

function focusableItems(container) {
  if (!container) {
    return []
  }

  return [...container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')]
}

export default function ImageLightbox({ open, label, onClose, children }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const opener = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const items = focusableItems(dialogRef.current)
      if (items.length === 0) {
        event.preventDefault()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const index = items.indexOf(document.activeElement)
      event.preventDefault()

      if (event.shiftKey) {
        const next = index <= 0 ? last : items[index - 1]
        next.focus()
        return
      }

      const next = index === -1 || index >= items.length - 1 ? first : items[index + 1]
      next.focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (opener instanceof HTMLElement && document.contains(opener)) {
        opener.focus()
      }
    }
  }, [open])

  if (!open) {
    return null
  }

  return createPortal(
    <div
      className="lightbox-backdrop fixed inset-0 z-50 overflow-y-auto bg-[#1c1c1e]/80"
      data-testid="lightbox-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative mx-auto my-8 w-[min(1100px,calc(100%-2rem))] outline-none"
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <p id={titleId} className="font-heading text-sm font-semibold text-off-white">
            {label}
          </p>
          <button
            type="button"
            ref={closeRef}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-off-white/20 bg-charcoal text-2xl leading-none text-off-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Close"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
