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
    <picture className="block w-full max-w-[280px] shrink-0">
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
    <article className="flex min-w-0 flex-col rounded-2xl border border-[#dedee1] bg-[#ebebed] p-6 text-charcoal sm:p-8">
      <div className="flex justify-center">
        <FounderPortrait name={founder.name} fileBase={founder.fileBase} />
      </div>
      <div className="mt-8 min-w-0">
        <h3 className="font-heading text-[1.75rem] font-bold uppercase leading-tight text-charcoal md:text-[2rem]">
          {founder.name}
        </h3>
        <p className="mt-3 font-heading text-base font-bold uppercase tracking-wide text-gold">
          Co-Founder
        </p>
        <div className="mt-5 space-y-5 font-body text-lg leading-relaxed text-[#55565B]">
          <p>{founder.playing}</p>
          <p>{founder.today}</p>
        </div>
      </div>
    </article>
  )
}

export default function Founders() {
  return (
    <section id="founders" aria-label="Our Rostr" className="flex min-h-svh items-center bg-[#14151A] text-off-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-32">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
          <img
          src="/brand/svg/mark-offwhite.svg"
          alt="TopRostr"
          width={194}
          height={100}
          className="h-12 w-auto self-start shrink-0 md:h-16 md:self-auto"
        />
          <p className="max-w-3xl font-body text-xl leading-normal text-[#CFD1D4]">
            We've lived the game and the recruiting process. We're building TopRostr to give coaches <span className="text-gold">more time</span> to develop their players, prepare their teams, and focus on <span className="text-gold">winning</span>.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-20 lg:gap-8">
          {founders.map((founder) => (
            <FounderProfile key={founder.name} founder={founder} />
          ))}
        </div>
      </div>
    </section>
  )
}
