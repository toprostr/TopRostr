const founders = [
  {
    name: 'Alejandro Suarez',
    fileBase: 'alejandro-suarez',
    playing:
      'Played at NYCFC, Met Oval, and BW Gottschee before being recruited to play Division I soccer at Monmouth University in the CAA.',
    today: 'Software Engineer at JPMorganChase.',
  },
  {
    name: 'Jason Wallack',
    fileBase: 'jason-wallack',
    playing:
      'Played Division I soccer at Monmouth University before continuing his collegiate career at Colby College in the NESCAC.',
    today: 'Studied finance and economics at Monmouth and Colby.',
  },
]

// Figma portraits are 250×332. Source files are larger (Jason 300×400,
// Alejandro 600×800), so this slot scales them down rather than up.
const PORTRAIT_WIDTH = 250
const PORTRAIT_HEIGHT = 332

function FounderPortrait({ name, fileBase }) {
  const basePath = `/images/founders/${fileBase}`

  return (
    <picture className="block w-full max-w-[250px] shrink-0">
      <source srcSet={`${basePath}.webp`} type="image/webp" />
      <img
        src={`${basePath}.jpg`}
        alt={`${name}, co-founder`}
        width={PORTRAIT_WIDTH}
        height={PORTRAIT_HEIGHT}
        loading="lazy"
        className="aspect-[250/332] h-auto w-full rounded-lg object-cover"
      />
    </picture>
  )
}

function FounderProfile({ founder }) {
  return (
    <article className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,250px)_minmax(0,1fr)] xl:gap-8">
      <FounderPortrait name={founder.name} fileBase={founder.fileBase} />
      <div className="min-w-0">
        <h3 className="font-heading text-[1.5625rem] font-bold uppercase leading-tight text-off-white">
          {founder.name}
        </h3>
        <p className="mt-2 font-heading text-sm font-bold uppercase tracking-wide text-gold">
          Co-Founder
        </p>
        <div className="mt-4 space-y-4 font-body text-base leading-normal text-[#CDD0D2]">
          <p>{founder.playing}</p>
          <p>{founder.today}</p>
        </div>
      </div>
    </article>
  )
}

export default function Founders() {
  return (
    <section id="founders" className="bg-[#14151A] text-off-white">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-32">
        <p className="font-heading text-[17px] font-bold text-gold">
          02 / THE PLAYERS BEHIND TOPROSTR
        </p>
        <h2 className="mt-6 font-heading text-[clamp(1.75rem,4vw+0.6rem,3.8125rem)] leading-[1.05] font-bold text-off-white">
          WE KNOW THE GAME.
          {/* Inline display matches the block class so the accessible name keeps its space in jsdom. */}
          {' '}
          <span className="block" style={{ display: 'block' }}>
            WE KNOW WHAT'S NEXT.
          </span>
        </h2>
        <p className="mt-8 max-w-3xl font-body text-xl leading-normal text-[#CFD1D4]">
          We've lived the recruiting process and understand how today's athletes use technology. We're building TopRostr to take work off coaches' plates so they can focus on what matters: winning.
        </p>
        <div className="mt-14 grid grid-cols-1 gap-14 lg:mt-20 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
          {founders.map((founder) => (
            <FounderProfile key={founder.name} founder={founder} />
          ))}
        </div>
      </div>
    </section>
  )
}
