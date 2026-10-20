import CTAButton from './CTAButton.jsx'

export default function JoinCta() {
  return (
    <section
      id="join"
      aria-labelledby="join-heading"
      className="flex min-h-svh items-center bg-brand-gray text-charcoal"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 md:py-20 lg:px-[75px] lg:py-[70px]">
        <h2
          id="join-heading"
          className="max-w-[1310px] font-heading text-[clamp(1.75rem,5.9vw,5.3125rem)] font-bold"
        >
          THIS TIME, WE'RE{' '}
          <span className="relative -left-[0.04em] block">RECRUITING YOU.</span>
        </h2>
        <p className="mt-6 max-w-[1150px] font-body text-[20px] leading-normal text-[#55565B]">
          Behind every great program are coaches who give everything to their
          teams. We're bringing those coaches together to help create technology
          that supports the work they do every day.
        </p>
        <CTAButton
          variant="gold-on-gray"
          location="join"
          className="mx-auto mt-10 flex h-[64px] w-full max-w-[300px] gap-3 px-6 text-[17px]"
        >
          JOIN THE ROSTR
        </CTAButton>
        <p className="mt-4 max-w-[1080px] font-body text-sm leading-normal text-[#55575D]">
          Join our early community, share your perspective, and stay connected
          as we build TopRostr.
        </p>
      </div>
    </section>
  )
}
