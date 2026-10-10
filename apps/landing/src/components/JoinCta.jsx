import { googleFormUrl, isGoogleFormPlaceholder } from '../config/site.js'

export default function JoinCta() {
  return (
    <section id="join" className="bg-brand-gray px-5 py-16 text-charcoal">
      <p className="font-heading text-sm">TODO #49: Join the Rostr</p>
      <a
        href={googleFormUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join the Rostr — opens coach questionnaire in a new tab"
        className="mt-6 inline-flex bg-gold px-6 py-3 font-heading text-sm font-semibold tracking-wide text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
      >
        JOIN THE ROSTR
      </a>
      {isGoogleFormPlaceholder ? (
        <p className="mt-4 max-w-xl text-sm">
          Placeholder form link. This does not submit anything. Set
          VITE_GOOGLE_FORM_URL to the coach questionnaire before launch.
        </p>
      ) : null}
    </section>
  )
}
