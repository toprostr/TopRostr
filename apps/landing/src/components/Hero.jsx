import CTAButton from './CTAButton.jsx'

const HERO_STILL_WIDTH = 1440
const HERO_STILL_HEIGHT = 900
const HERO_AVIF = '/images/hero/hero-ball-right-1440x900.avif'
const HERO_WEBP_1X = '/images/hero/hero-ball-right-1440x900.webp'
const HERO_WEBP_2X = '/images/hero/hero-ball-right-2880x1800.webp'
const HERO_JPG = '/images/hero/hero-ball-right-1440x900.jpg'

export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[calc(100svh-69px)] items-center overflow-hidden bg-[#16171B] md:min-h-[calc(100svh-94px)]">
      <picture className="pointer-events-none absolute inset-0">
        <source media="(max-width: 1279px)" type="image/webp" srcSet="/images/hero/hero-field-only-1440x900.webp" />
        <source type="image/avif" srcSet={HERO_AVIF} />
        <source type="image/webp" srcSet={`${HERO_WEBP_1X} 1x, ${HERO_WEBP_2X} 2x`} />
        <img
          src={HERO_JPG}
          alt=""
          width={HERO_STILL_WIDTH}
          height={HERO_STILL_HEIGHT}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-right lg:object-[75%_50%]"
        />
      </picture>
      {/* Left wash: solid #16171B fading to transparent by about 62% of the width. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#16171B_0%,rgba(22,23,27,0.85)_30%,rgba(22,23,27,0)_62%)]"
      />

      <div className="hero-content relative mx-auto w-full max-w-[1440px] px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20">
        <div className="max-w-full">
          <h1 className="max-w-full font-heading text-[clamp(2.25rem,7.2vw,6.5rem)] font-bold leading-[0.92] tracking-tight text-balance text-off-white">
            EVERY ADVANTAGE
            {/* Inline display matches the block class so the accessible name keeps its space in jsdom. */}
            {' '}
            <span className="block" style={{ display: 'block' }}>
              MATTERS.
            </span>
          </h1>
          <p className="mt-8 max-w-[680px] text-lg leading-relaxed text-gold md:text-[1.375rem] md:leading-normal">
            An AI-powered recruiting workspace that gives coaches more time to focus on winning.
          </p>
          <div className="mt-10">
            <CTAButton size="hero" location="hero" />
          </div>
        </div>
      </div>
    </section>
  )
}
