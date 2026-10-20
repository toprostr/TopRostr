import WorkspacePreview from './preview/WorkspacePreview.jsx'
import { workspaceFixture } from './preview/fixtures.js'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import { workspaceConcepts } from './preview/concepts.js'
import ImageLightbox from './ImageLightbox.jsx'

const DESIGN_WIDTH = 1440

function EnlargeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="h-[18px] w-[18px]">
      <circle cx="7.5" cy="7.5" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11 L15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function useFitScale(element, active) {
  const [scale, setScale] = useState(0.42)

  useLayoutEffect(() => {
    if (!active || !element || typeof ResizeObserver === 'undefined') {
      return undefined
    }

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      if (width > 0) {
        setScale(width / DESIGN_WIDTH)
      }
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [active, element])

  return scale
}

export default function Preview() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [enlarged, setEnlarged] = useState(false)
  const slideId = useId()
  const cardRef = useRef(null)
  const frameRef = useRef(null)
  const [cardNode, setCardNode] = useState(null)
  const [frameNode, setFrameNode] = useState(null)
  const thumbnailScale = useFitScale(cardNode, true)
  const lightboxScale = useFitScale(frameNode, enlarged)

  useLayoutEffect(() => {
    setCardNode(cardRef.current)
  }, [slideIndex])

  useLayoutEffect(() => {
    setFrameNode(enlarged ? frameRef.current : null)
  }, [enlarged])

  const concept = workspaceConcepts[slideIndex]
  const { organization, recruit, decision } = workspaceFixture
  const choiceLabels = decision.choices.map((choice) => choice.label).join(' / ')
  const previewDescription = `Illustrative inbox for ${organization.program}. It shows the recruit ${recruit.name} and a highlight video thumbnail. The AI pane summarizes the player. The coach's choices are ${choiceLabels}. Nothing is saved until the coach chooses.`

  function moveSlide(direction) {
    setSlideIndex(current => (current + direction + workspaceConcepts.length) % workspaceConcepts.length)
  }

  function onControlKeyDown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      moveSlide(event.key === 'ArrowRight' ? 1 : -1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setSlideIndex(event.key === 'Home' ? 0 : workspaceConcepts.length - 1)
    }
  }

  return (
    <section
      id="preview"
      aria-label="TopRostr workspace preview"
      aria-roledescription="carousel"
      className="relative overflow-hidden bg-[#292B31] py-12 md:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1240px] px-4 md:px-6 lg:px-8">
        <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{concept.label}, slide {slideIndex + 1} of {workspaceConcepts.length}</p>
        <div role="group" aria-label="Choose a workspace view" onKeyDown={onControlKeyDown}>
          <div className="concept-controls">
            <button type="button" aria-label="Previous workspace view" aria-controls={slideId} onClick={() => moveSlide(-1)} className="concept-arrow">←</button>
            <p className="min-w-[130px] text-center text-base font-medium text-off-white">{concept.label} view</p>
            <button type="button" aria-label="Next workspace view" aria-controls={slideId} onClick={() => moveSlide(1)} className="concept-arrow">→</button>
          </div>
          <div className="concept-carousel" style={{ '--concept-scale': thumbnailScale }}>
          {[-1, 1].map(direction => {
            const neighbor = workspaceConcepts[(slideIndex + direction + workspaceConcepts.length) % workspaceConcepts.length]
            // Decorative copies: painted like the active card, but not readable text.
            return <div key={direction} inert={true} aria-hidden="true" className={`concept-card concept-card--${direction === -1 ? 'previous' : 'next'}`}>
              <div aria-hidden="true" className="concept-canvas"><WorkspacePreview fixture={workspaceFixture} view={neighbor.id} /></div>
            </div>
          })}
          <figure ref={cardRef} id={slideId} role="group" aria-roledescription="slide" aria-label={`${concept.label}, ${slideIndex + 1} of ${workspaceConcepts.length}`} className="concept-card concept-card--active workspace-slide" key={concept.id}>
            <figcaption className="sr-only">{concept.description ?? previewDescription}</figcaption>
            <div aria-hidden="true" className="concept-canvas"><WorkspacePreview fixture={workspaceFixture} view={concept.id} /></div>
            <button
              type="button"
              className="concept-shot"
              aria-label={`Enlarge ${concept.label} workspace`}
              aria-haspopup="dialog"
              aria-expanded={enlarged}
              onClick={() => setEnlarged(true)}
            >
              <span aria-hidden="true" className="concept-zoom"><EnlargeIcon /></span>
            </button>
          </figure>
          </div>
          <p className="mt-5 text-center text-sm tracking-wide text-off-white/60">Workspace concept · tap to enlarge</p>
        </div>
      </div>
      <ImageLightbox
        open={enlarged}
        label={`${concept.label} workspace`}
        onClose={() => setEnlarged(false)}
      >
        <div ref={frameRef} className="lightbox-frame" style={{ '--lightbox-scale': lightboxScale }}>
          <div aria-hidden="true" className="concept-canvas">
            <WorkspacePreview fixture={workspaceFixture} view={concept.id} />
          </div>
        </div>
      </ImageLightbox>
    </section>
  )
}
