const DISCLAIMER =
  'TopRostr is in pre-launch. The workspace on this page is an illustrative concept, not a released product.'

export default function Footer() {
  return (
    <footer className="border-t border-off-white/20 bg-charcoal">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-5 py-10 md:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-16">
        <img
          src="/brand/svg/mark-offwhite.svg"
          alt="TopRostr"
          width="194"
          height="100"
          className="h-10 w-auto"
        />
        <p className="max-w-xl text-sm leading-relaxed text-brand-gray">{DISCLAIMER}</p>
        <p className="text-sm text-off-white">© 2026 TopRostr</p>
      </div>
    </footer>
  )
}
