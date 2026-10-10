// TODO: Point this at the real coach questionnaire.
// Set VITE_GOOGLE_FORM_URL in apps/landing/.env (see .env.example) or in the
// Vercel project environment. A public Google Form URL is not a secret.
// Until it is set to an https URL, every CTA uses the single fallback below
// and does not submit anything. PLACEHOLDER is in that URL so QA can see it
// on the href. Do not add a second fallback. A non-https value is ignored.
// `npm run build` warns when the variable is unset or blank, and still
// succeeds, except when VERCEL_ENV is production — that build fails.
export const GOOGLE_FORM_PLACEHOLDER_URL =
  'https://example.com/toprostr-join-the-rostr-PLACEHOLDER'

export const GOOGLE_FORM_URL_WARNING =
  'WARNING: VITE_GOOGLE_FORM_URL is not set; CTAs point at the placeholder'

export const GOOGLE_FORM_URL_PRODUCTION_ERROR =
  'ERROR: VITE_GOOGLE_FORM_URL is not set; refusing a production build while CTAs would point at the placeholder'

function trimmedFormUrl(env) {
  const configured = env?.VITE_GOOGLE_FORM_URL

  if (typeof configured !== 'string') {
    return ''
  }

  return configured.trim()
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function configuredFormUrl(env) {
  const trimmed = trimmedFormUrl(env)

  if (trimmed === '' || !isHttpsUrl(trimmed)) {
    return null
  }

  return trimmed
}

// Exported so tests can exercise both branches. Vite reads the variable once
// at module load; passing an env object covers the configured-URL path
// without restarting the dev server.
export function readGoogleFormUrl(env = import.meta.env) {
  return configuredFormUrl(env) ?? GOOGLE_FORM_PLACEHOLDER_URL
}

// exitCode 1 only for a production build with a blank form URL. Every other
// case exits 0. A blank URL still returns the warning string so preview,
// development, and local builds can log it.
export function googleFormBuildGuard(env = {}) {
  if (trimmedFormUrl(env) !== '') {
    return { exitCode: 0, warning: null }
  }

  if (env.VERCEL_ENV === 'production') {
    return {
      exitCode: 1,
      warning: null,
      message: GOOGLE_FORM_URL_PRODUCTION_ERROR,
    }
  }

  return { exitCode: 0, warning: GOOGLE_FORM_URL_WARNING }
}

export const googleFormUrl = readGoogleFormUrl()

export const isGoogleFormPlaceholder = googleFormUrl === GOOGLE_FORM_PLACEHOLDER_URL
