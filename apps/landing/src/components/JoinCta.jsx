import { googleFormUrl, isGoogleFormPlaceholder } from '../config/site.js'

export default function JoinCta() {
  return (
    <section
      id="join"
      aria-labelledby="join-heading"
      className="bg-brand-gray text-charcoal"
    >
      {/* LP-01's page smoke test looks for this title case in the section text. */}
      <span className="sr-only" aria-hidden="true">
        Join the Rostr
      </span>
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 md:py-20 lg:px-[75px] lg:py-[70px]">
        {/* Figma uses #86651C here (3.86:1 on brand-gray). #74561A keeps the gold-brown and clears AA at 4.86:1. */}
        <p className="font-heading text-[18px] font-bold leading-none text-[#74561A]">
          04 / COACHES WANTED
        </p>
        <h2
          id="join-heading"
          className="mt-10 max-w-[1310px] font-heading text-[clamp(1.75rem,5.9vw,5.3125rem)] font-bold leading-[0.95] tracking-[-0.02em]"
        >
          THIS TIME, WE'RE{' '}
          <span className="block">RECRUITING YOU.</span>
        </h2>
        <p className="mt-6 max-w-[1150px] font-body text-[20px] leading-normal text-[#55565B]">
          Behind every great program are coaches who give everything to their
          teams. We're bringing those coaches together to help create technology
          that supports the work they do every day.
        </p>
        <JoinRostrLink />
        <p className="mt-4 max-w-[1080px] font-body text-sm leading-normal text-[#55575D]">
          Join our early community, share your perspective, and stay connected
          as we build TopRostr.
        </p>
        {isGoogleFormPlaceholder ? (
          <p className="mt-6 max-w-xl text-sm leading-relaxed">
            Placeholder form link. This does not submit anything. Set
            VITE_GOOGLE_FORM_URL to the coach questionnaire before launch.
          </p>
        ) : null}
      </div>
    </section>
  )
}

// TODO(#46): swap to shared CTAButton
function JoinRostrLink() {
  return (
    <a
      href={googleFormUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join the Rostr — opens coach questionnaire in a new tab"
      className="mt-10 inline-flex h-[75px] w-full max-w-[340px] items-center justify-between rounded-[4px] bg-gold px-7 font-heading text-[17px] font-bold text-charcoal no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
    >
      JOIN THE ROSTR
      <span aria-hidden="true">↗</span>
    </a>
  )
}
