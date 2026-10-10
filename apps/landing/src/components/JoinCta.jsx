import { isGoogleFormPlaceholder } from '../config/site.js'
import CTAButton from './CTAButton.jsx'

export default function JoinCta() {
  return (
    <section
      id="join"
      aria-labelledby="join-heading"
      className="bg-brand-gray text-charcoal"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 md:py-20 lg:px-[75px] lg:py-[70px]">
        {/* Figma uses #86651C here (3.86:1 on brand-gray). #74561A keeps the gold-brown and clears AA at 4.86:1. */}
        <p className="font-heading text-[18px] font-bold leading-none text-[#74561A]">
          04 / COACHES WANTED
        </p>
        <h2
          id="join-heading"
          className="mt-10 max-w-[1310px] font-heading text-[clamp(1.75rem,5.9vw,5.3125rem)] font-bold"
        >
          THIS TIME, WE'RE{' '}
          <span className="block">RECRUITING YOU.</span>
        </h2>
        <p className="mt-6 max-w-[1150px] font-body text-[20px] leading-normal text-[#55565B]">
          Behind every great program are coaches who give everything to their
          teams. We're bringing those coaches together to help create technology
          that supports the work they do every day.
        </p>
        <CTAButton
          variant="gold-on-gray"
          className="mt-10 h-[75px] w-full max-w-[340px] justify-start gap-[1ch] px-7 text-[17px]"
        >
          JOIN THE ROSTR
        </CTAButton>
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
