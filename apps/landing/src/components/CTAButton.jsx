import { googleFormUrl } from '../config/site.js'

const JOIN_LABEL = 'Join the Rostr — opens coach questionnaire in a new tab'

// The arrow sits in the label group (justify-center + gap), not at the far edge.
const BASE_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-[4px] font-heading font-bold focus-visible:outline-2 focus-visible:outline-offset-2'

// Figma frame: nav control 190×53 / 13px, hero control 260×57 / 16px.
// No size: the caller sets the box (the final band passes its own classes).
const SIZE_CLASS = {
  nav: 'h-[53px] min-w-[190px] px-4 text-[13px]',
  hero: 'h-[57px] w-[260px] px-6 text-[16px]',
}

const UNSIZED_CLASS = 'min-h-12 px-6 text-sm'

// "gold-on-gray" is the final CTA band (#D9DADD): same gold button, with a
// charcoal focus ring that stays visible on that lighter background.
const VARIANT_CLASS = {
  default: 'bg-gold text-charcoal focus-visible:outline-off-white',
  'gold-on-gray': 'bg-gold text-charcoal focus-visible:outline-charcoal',
}

export default function CTAButton({
  className = '',
  variant = 'default',
  size,
  children = 'JOIN THE ROSTR',
  onClick,
}) {
  const variantClass = VARIANT_CLASS[variant] ?? VARIANT_CLASS.default
  const sizeClass = SIZE_CLASS[size] ?? UNSIZED_CLASS

  return (
    <a
      href={googleFormUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={JOIN_LABEL}
      data-cta="join"
      onClick={onClick}
      className={`${BASE_CLASS} ${sizeClass} ${variantClass} ${className}`.trim()}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  )
}
