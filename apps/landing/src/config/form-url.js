// Pure form-URL checks. This module does not read import.meta.env, so
// vite.config.js can import the build guard without pulling client env
// into the config bundle.

export const GOOGLE_FORM_PLACEHOLDER_URL =
  'https://example.com/toprostr-join-the-rostr-PLACEHOLDER'

export const GOOGLE_FORM_URL_WARNING =
  'WARNING: VITE_GOOGLE_FORM_URL is not set; CTAs point at the placeholder'

export const GOOGLE_FORM_URL_PRODUCTION_ERROR =
  'ERROR: VITE_GOOGLE_FORM_URL must be an https URL; refusing a production build while CTAs would point at the placeholder'

export function trimmedFormUrl(env) {
  const configured = env?.VITE_GOOGLE_FORM_URL

  if (typeof configured !== 'string') {
    return ''
  }

  return configured.trim()
}

export function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function configuredFormUrl(env) {
  const trimmed = trimmedFormUrl(env)

  if (trimmed === '' || !isHttpsUrl(trimmed)) {
    return null
  }

  return trimmed
}

// exitCode 1 only for a production build that would use the placeholder
// (blank or not https). Every other case exits 0. A blank URL still returns
// the warning string so preview, development, and local builds can log it.
export function googleFormBuildGuard(env = {}) {
  const trimmed = trimmedFormUrl(env)

  if (trimmed !== '' && isHttpsUrl(trimmed)) {
    return { exitCode: 0, warning: null }
  }

  if (env.VERCEL_ENV === 'production') {
    return {
      exitCode: 1,
      warning: null,
      message: GOOGLE_FORM_URL_PRODUCTION_ERROR,
    }
  }

  if (trimmed === '') {
    return { exitCode: 0, warning: GOOGLE_FORM_URL_WARNING }
  }

  return { exitCode: 0, warning: null }
}
