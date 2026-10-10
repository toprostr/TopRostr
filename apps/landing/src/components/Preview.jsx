import WorkspacePreview from './preview/WorkspacePreview.jsx'
import { workspaceFixture } from './preview/fixtures.js'

const sectionBody =
  'Your staff\'s recruiting context in one place, with AI working alongside you\u2014not making decisions for you.'

export default function Preview() {
  const { organization, recruit } = workspaceFixture
  const previewDescription = `Preview of a fictional program workspace for ${organization.program}. It shows ${recruit.name}'s recruit context, with film and notes, and an AI suggestion. The coach chooses to use the draft or set it aside. Nothing is sent or saved.`

  return (
    <section
      id="preview"
      aria-labelledby="preview-heading"
      className="relative px-5 py-16 md:px-8 md:py-28 lg:px-16 lg:py-36"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <p className="flex items-center gap-3 font-heading text-xs font-medium tracking-[0.18em] text-brand-gray">
          <span className="h-px w-8 bg-gold" aria-hidden="true" />
          03 / THE TOPROSTR WORKSPACE
        </p>
        <h2
          id="preview-heading"
          className="mt-4 max-w-5xl font-heading text-[clamp(1.75rem,4vw_+_1rem,3.25rem)] font-bold leading-[1.05] tracking-tight text-off-white"
        >
          ONE PROGRAM. ONE CONNECTED WORKSPACE.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-off-white md:text-lg">
          {sectionBody}
        </p>
        <p className="mt-6 inline-flex max-w-full items-center gap-2 rounded-full border border-off-white/20 px-3 py-1 text-xs text-brand-gray">
          <span className="size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
          Illustrative product concept
        </p>
        <figure className="mt-8 md:mt-12">
          <figcaption className="sr-only">{previewDescription}</figcaption>
          <div aria-hidden="true">
            <WorkspacePreview fixture={workspaceFixture} />
          </div>
        </figure>
      </div>
    </section>
  )
}
