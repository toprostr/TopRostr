// TODO: Point this at the real coach questionnaire.
// Set VITE_GOOGLE_FORM_URL in apps/landing/.env (see .env.example) or in the
// Vercel project environment. A public Google Form URL is not a secret.
// Until it is set, the CTA uses the labeled placeholder below and does not
// submit anything.
const GOOGLE_FORM_PLACEHOLDER_URL =
  'https://example.com/toprostr-join-the-rostr-placeholder'

// Exported so tests can exercise both branches. Vite reads the variable once
// at module load; passing an env object covers the configured-URL path
// without restarting the dev server.
export function readGoogleFormUrl(env = import.meta.env) {
  const configured = env?.VITE_GOOGLE_FORM_URL

  if (typeof configured === 'string' && configured.trim() !== '') {
    return configured.trim()
  }

  return GOOGLE_FORM_PLACEHOLDER_URL
}

export const googleFormUrl = readGoogleFormUrl()

export const isGoogleFormPlaceholder = googleFormUrl === GOOGLE_FORM_PLACEHOLDER_URL
