import WorkspacePreview from './preview/WorkspacePreview.jsx'
import { workspaceFixture } from './preview/fixtures.js'
import { useId, useLayoutEffect, useRef, useState } from 'react'
import { workspaceConcepts } from './preview/concepts.js'

export default function Preview() {
  const [slideIndex, setSlideIndex] = useState(0)
  const slideId = useId()
  const stageRef = useRef(null)
  const [scale, setScale] = useState(0.6)

  useLayoutEffect(() => {
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width * 0.84 / 1440))
    observer.observe(stageRef.current)
    return () => observer.disconnect()
  }, [])
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
        <p className="mb-5 text-center text-sm tracking-wide text-off-white/60">Workspace concepts</p>
        <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{concept.label}, slide {slideIndex + 1} of {workspaceConcepts.length}</p>
        <div role="group" aria-label="Choose a workspace view" onKeyDown={onControlKeyDown}>
          <div ref={stageRef} className="concept-carousel" style={{ '--concept-scale': scale }}>
          {[-1, 1].map(direction => {
            const neighbor = workspaceConcepts[(slideIndex + direction + workspaceConcepts.length) % workspaceConcepts.length]
            return <div key={direction} aria-hidden="true" className={`concept-card concept-card--${direction === -1 ? 'previous' : 'next'}`}>
              <div className="concept-canvas"><WorkspacePreview fixture={workspaceFixture} view={neighbor.id} /></div>
            </div>
          })}
          <figure id={slideId} role="group" aria-roledescription="slide" aria-label={`${concept.label}, ${slideIndex + 1} of ${workspaceConcepts.length}`} className="concept-card concept-card--active workspace-slide" key={concept.id}>
            <figcaption className="sr-only">{concept.description ?? previewDescription}</figcaption>
            <div aria-hidden="true" className="concept-canvas"><WorkspacePreview fixture={workspaceFixture} view={concept.id} /></div>
          </figure>
          </div>
          <div className="concept-controls">
            <button type="button" aria-label="Previous workspace view" aria-controls={slideId} onClick={() => moveSlide(-1)} className="concept-arrow">←</button>
            <button type="button" aria-label="Next workspace view" aria-controls={slideId} onClick={() => moveSlide(1)} className="concept-arrow">→</button>
          </div>
        </div>
      </div>
    </section>
  )
}
