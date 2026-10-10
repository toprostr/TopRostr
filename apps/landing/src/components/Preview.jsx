import WorkspacePreview from './preview/WorkspacePreview.jsx'
import { workspaceFixture } from './preview/fixtures.js'

const sectionBody =
  'Your staff\'s recruiting context in one place, with AI working alongside you\u2014not making decisions for you.'

export default function Preview() {
  const { organization, recruit, assistant, decision } = workspaceFixture
  const suggestionLabels = assistant.suggestions.map((suggestion) => suggestion.label).join('" and "')
  const choiceLabels = decision.choices.map((choice) => choice.label).join(' / ')
  const previewDescription = `Illustrative inbox for ${organization.program}. It shows the recruit ${recruit.name} and a highlight video thumbnail. The AI pane suggests "${suggestionLabels}". The coach's choices are ${choiceLabels}. Nothing is saved until the coach chooses.`

  return (
    <section
      id="preview"
      aria-labelledby="preview-heading"
      className="relative bg-[#292B31] px-5 py-16 md:px-8 md:py-28 lg:px-16 lg:py-36"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <p className="font-heading text-[17px] font-bold text-gold">
          03 / THE TOPROSTR WORKSPACE
        </p>
        <h2
          id="preview-heading"
          className="mt-4 max-w-5xl font-heading text-[clamp(1.75rem,4vw_+_1rem,4.125rem)] font-bold leading-[1.05] tracking-tight text-off-white"
        >
          ONE PROGRAM.
          {/* Inline display matches the block class so the accessible name keeps its space in jsdom. */}
          {' '}
          <span className="block" style={{ display: 'block' }}>
            ONE CONNECTED WORKSPACE.
          </span>
        </h2>
        <p className="mt-4 max-w-3xl text-[21px] leading-relaxed text-[#CFD1D4]">
          {sectionBody}
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
