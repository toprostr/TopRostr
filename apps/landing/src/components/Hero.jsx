import CTAButton from './CTAButton.jsx'

// TODO: Replace /images/hero-placeholder.svg with the supplied hero still
// (WebP or AVIF) once a photograph exists. Keep width and height set so the
// layout does not shift. Do not use video.
const HERO_IMAGE = {
  src: '/images/hero-placeholder.svg',
  width: 1440,
  height: 900,
  alt: 'Placeholder hero still. A photograph has not been supplied yet.',
}

export default function Hero() {
  return (
    <section id="hero" className="bg-charcoal">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 py-16 md:px-8 md:py-28 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:px-16 lg:py-32">
        <div className="max-w-3xl">
          <span className="mb-6 block h-px w-12 bg-gold" aria-hidden="true" />
          <p className="font-heading text-sm font-semibold tracking-[0.16em] text-gold">
            TECHNOLOGY BUILT FOR THE SIDELINE.
          </p>
          <h1 className="mt-6 text-balance font-heading text-[clamp(2.5rem,8vw,6.5rem)] font-bold leading-[0.92] tracking-tight text-off-white">
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

        <img
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          width={HERO_IMAGE.width}
          height={HERO_IMAGE.height}
          fetchPriority="high"
          className="aspect-[1440/900] h-auto w-full border border-gold/40 object-cover"
        />
      </div>
    </section>
  )
}
