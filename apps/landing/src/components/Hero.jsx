import CTAButton from './CTAButton.jsx'

// LP-06: replace this path with the neutral still (WebP or AVIF).
// Keep the width and height so the box does not shift. Do not use video.
const HERO_STILL_SRC = '/images/hero-placeholder.svg'
const HERO_STILL_WIDTH = 1440
const HERO_STILL_HEIGHT = 900

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-charcoal">
      <img
        src={HERO_STILL_SRC}
        alt=""
        width={HERO_STILL_WIDTH}
        height={HERO_STILL_HEIGHT}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Opaque #16171B under the copy, then a fade to the still. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#16171B_0%,#16171B_92%,transparent_100%)] lg:bg-[linear-gradient(to_right,#16171B_0%,#16171B_65%,transparent_100%)]"
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 pt-16 pb-24 md:px-8 md:pt-28 md:pb-28 lg:px-16 lg:pt-32 lg:pb-32">
        <div className="max-w-full lg:max-w-[42rem]">
          <span className="mb-6 block h-px w-12 bg-gold" aria-hidden="true" />
          <p className="font-heading text-sm font-semibold tracking-[0.16em] text-gold">
            TECHNOLOGY BUILT FOR THE SIDELINE.
          </p>
          <h1 className="mt-6 max-w-full font-heading text-[clamp(2.25rem,7.2vw,6.5rem)] font-bold leading-[0.92] tracking-tight text-balance text-off-white">
            EVERY ADVANTAGE MATTERS.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-off-white md:text-[1.375rem] md:leading-normal">
            Meet TopRostr. An AI-powered recruiting workspace built by former college players to
            help coaches spend less time managing recruiting and more time building winning
            programs.
          </p>
          <div className="mt-10">
            <CTAButton />
          </div>
        </div>

        <p className="absolute right-5 bottom-6 font-heading text-[13px] font-semibold tracking-[0.14em] text-off-white md:right-8 md:bottom-8 lg:right-16">
          01 — THE ADVANTAGE
        </p>
      </div>
    </section>
  )
}
