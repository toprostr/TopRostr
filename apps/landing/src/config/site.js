// TODO: Point this at the real coach questionnaire.
// Set VITE_GOOGLE_FORM_URL in apps/landing/.env (see .env.example) or in the
// Vercel project environment. A public Google Form URL is not a secret.
// Until it is set, every CTA uses the single fallback below and does not
// submit anything. PLACEHOLDER is in that URL so QA can see it on the href.
// Do not add a second fallback. `npm run build` warns when the variable is
// unset or empty, and the build still succeeds.
export const GOOGLE_FORM_PLACEHOLDER_URL =
  'https://example.com/toprostr-join-the-rostr-PLACEHOLDER'

export const GOOGLE_FORM_URL_WARNING =
  'WARNING: VITE_GOOGLE_FORM_URL is not set; CTAs point at the placeholder'

function configuredFormUrl(env) {
  const configured = env?.VITE_GOOGLE_FORM_URL

  if (typeof configured === 'string' && configured.trim() !== '') {
    return configured.trim()
  }

  return null
}

// Exported so tests can exercise both branches. Vite reads the variable once
// at module load; passing an env object covers the configured-URL path
// without restarting the dev server.
export function readGoogleFormUrl(env = import.meta.env) {
  return configuredFormUrl(env) ?? GOOGLE_FORM_PLACEHOLDER_URL
}

// Null when the variable is set. The build logs the string and still succeeds.
export function googleFormUrlBuildWarning(env = {}) {
  if (configuredFormUrl(env) !== null) {
    return null
  }

  return GOOGLE_FORM_URL_WARNING
}

export const googleFormUrl = readGoogleFormUrl()

export const isGoogleFormPlaceholder = googleFormUrl === GOOGLE_FORM_PLACEHOLDER_URL
