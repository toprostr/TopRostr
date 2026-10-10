import CTAButton from './CTAButton.jsx'

const HERO_STILL_WIDTH = 1440
const HERO_STILL_HEIGHT = 900
const HERO_AVIF = '/images/hero/hero-1440x900.avif'
const HERO_WEBP_1X = '/images/hero/hero-1440x900.webp'
const HERO_WEBP_2X = '/images/hero/hero-2880x1800.webp'
const HERO_JPG = '/images/hero/hero-1440x900.jpg'

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#16171B]">
      <picture className="pointer-events-none absolute inset-0">
        <source type="image/avif" srcSet={HERO_AVIF} />
        <source type="image/webp" srcSet={`${HERO_WEBP_1X} 1x, ${HERO_WEBP_2X} 2x`} />
        <img
          src={HERO_JPG}
          alt=""
          width={HERO_STILL_WIDTH}
          height={HERO_STILL_HEIGHT}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[75%_50%]"
        />
      </picture>
      {/* Left wash: solid #16171B fading to transparent by about 62% of the width. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#16171B_0%,rgba(22,23,27,0.85)_30%,rgba(22,23,27,0)_62%)]"
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 pt-16 pb-24 md:px-8 md:pt-28 md:pb-28 lg:px-16 lg:pt-32 lg:pb-32">
        <div className="max-w-full">
          <p className="font-heading text-[15px] font-bold text-gold">
            TECHNOLOGY BUILT FOR THE SIDELINE.
          </p>
          <h1 className="mt-6 max-w-full font-heading text-[clamp(2.25rem,7.2vw,6.5rem)] font-bold leading-[0.92] tracking-tight text-balance text-off-white">
            EVERY ADVANTAGE
            {/* Inline display matches the block class so the accessible name keeps its space in jsdom. */}
            <span className="block" style={{ display: 'block' }}>
              MATTERS.
            </span>
          </h1>
          <p className="mt-8 max-w-[950px] text-lg leading-relaxed text-off-white md:text-[1.375rem] md:leading-normal">
            Meet TopRostr. An AI-powered recruiting workspace built by former college players to
            help coaches spend less time managing recruiting and more time building winning
            programs.
          </p>
          <div className="mt-10">
            <CTAButton size="hero" />
          </div>
        </div>

        <p className="absolute right-5 bottom-6 font-heading text-[14px] font-bold text-off-white md:right-8 md:bottom-8 lg:right-16">
          01 — THE ADVANTAGE
        </p>
      </div>
    </section>
  )
}
