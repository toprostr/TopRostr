// Set VITE_GOOGLE_FORM_URL in apps/landing/.env (see .env.example) or in the
// Vercel project environment. A public Google Form URL is not a secret.
// Until it is an https URL, every CTA uses the single fallback and does not
// submit anything. PLACEHOLDER is in that URL so QA can see it on the href.
// Do not add a second fallback. A non-https value is ignored.
// `npm run build` warns when the variable is unset or blank, and still
// succeeds, except when VERCEL_ENV is production. That build fails unless the
// value is https, and the client bundle omits the placeholder string.
// The client reads only VITE_GOOGLE_FORM_URL, not the rest of import.meta.env.
import {
  GOOGLE_FORM_PLACEHOLDER_URL,
  GOOGLE_FORM_URL_PRODUCTION_ERROR,
  GOOGLE_FORM_URL_WARNING,
  configuredFormUrl,
  googleFormBuildGuard,
} from './form-url.js'

export {
  GOOGLE_FORM_PLACEHOLDER_URL,
  GOOGLE_FORM_URL_PRODUCTION_ERROR,
  GOOGLE_FORM_URL_WARNING,
  googleFormBuildGuard,
}

function clientFormEnv() {
  return {
    VITE_GOOGLE_FORM_URL: import.meta.env.VITE_GOOGLE_FORM_URL,
  }
}

// vite.config.js inlines VITE_VERCEL_ENV from VERCEL_ENV. On a production
// build the comparison is constant-folded, so the placeholder string is not
// in the client bundle. Preview, local, and test builds keep the fallback.
export function readGoogleFormUrl(env = clientFormEnv()) {
  const configured = configuredFormUrl(env)

  if (configured) {
    return configured
  }

  if (import.meta.env.VITE_VERCEL_ENV === 'production') {
    return ''
  }

  return GOOGLE_FORM_PLACEHOLDER_URL
}

export const googleFormUrl = readGoogleFormUrl()

export const isGoogleFormPlaceholder =
  import.meta.env.VITE_VERCEL_ENV === 'production'
    ? false
    : googleFormUrl === GOOGLE_FORM_PLACEHOLDER_URL
