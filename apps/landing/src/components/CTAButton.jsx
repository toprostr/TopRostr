import { googleFormUrl } from '../config/site.js'

const JOIN_LABEL = 'Join the Rostr — opens coach questionnaire in a new tab'

const BASE_CLASS =
  'inline-flex min-h-12 items-center justify-center rounded px-6 font-heading text-sm font-semibold tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2'

// "gold-on-gray" is the final CTA band (#D9DADD): same gold button, with a
// charcoal focus ring that stays visible on that lighter background.
const VARIANT_CLASS = {
  default: 'bg-gold text-charcoal focus-visible:outline-off-white',
  'gold-on-gray': 'bg-gold text-charcoal focus-visible:outline-charcoal',
}

export default function CTAButton({
  className = '',
  variant = 'default',
  children = 'JOIN THE ROSTR',
  onClick,
}) {
  const variantClass = VARIANT_CLASS[variant] ?? VARIANT_CLASS.default

  return (
    <a
      href={googleFormUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={JOIN_LABEL}
      data-cta="join"
      onClick={onClick}
      className={`${BASE_CLASS} ${variantClass} ${className}`.trim()}
    >
      {children}
    </a>
  )
}
