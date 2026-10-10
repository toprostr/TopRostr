import { afterEach, expect, it, vi } from 'vitest'
import {
  GOOGLE_FORM_PLACEHOLDER_URL,
  GOOGLE_FORM_URL_WARNING,
  googleFormUrlBuildWarning,
  readGoogleFormUrl,
} from './site.js'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

it('uses the single PLACEHOLDER url only when VITE_GOOGLE_FORM_URL is missing or blank', () => {
  expect(GOOGLE_FORM_PLACEHOLDER_URL).toContain('PLACEHOLDER')

  expect(readGoogleFormUrl({})).toBe(GOOGLE_FORM_PLACEHOLDER_URL)
  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: '' })).toBe(
    GOOGLE_FORM_PLACEHOLDER_URL,
  )
  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: '   ' })).toBe(
    GOOGLE_FORM_PLACEHOLDER_URL,
  )
  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: 12 })).toBe(
    GOOGLE_FORM_PLACEHOLDER_URL,
  )

  const configured = 'https://example.com/coach-questionnaire'

  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: configured })).toBe(configured)
  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: configured })).not.toBe(
    GOOGLE_FORM_PLACEHOLDER_URL,
  )
})

it('warns on build only when the form URL is unset or empty', () => {
  expect(googleFormUrlBuildWarning({})).toBe(GOOGLE_FORM_URL_WARNING)
  expect(googleFormUrlBuildWarning({ VITE_GOOGLE_FORM_URL: '' })).toBe(
    GOOGLE_FORM_URL_WARNING,
  )
  expect(googleFormUrlBuildWarning({ VITE_GOOGLE_FORM_URL: '   ' })).toBe(
    GOOGLE_FORM_URL_WARNING,
  )
  expect(
    googleFormUrlBuildWarning({
      VITE_GOOGLE_FORM_URL: 'https://example.com/coach-questionnaire',
    }),
  ).toBe(null)
})

it('uses VITE_GOOGLE_FORM_URL when it is set', async () => {
  const configured = 'https://example.com/coach-questionnaire'

  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: `  ${configured}  ` })).toBe(configured)

  vi.stubEnv('VITE_GOOGLE_FORM_URL', `  ${configured}  `)
  vi.resetModules()

  const site = await import('./site.js')

  expect(site.googleFormUrl).toBe(configured)
  expect(site.isGoogleFormPlaceholder).toBe(false)
  expect(site.readGoogleFormUrl()).toBe(configured)
})

it('reports the placeholder branch from the loaded module when the variable is unset', async () => {
  vi.stubEnv('VITE_GOOGLE_FORM_URL', '')
  vi.resetModules()

  const site = await import('./site.js')

  expect(site.googleFormUrl).toBe(GOOGLE_FORM_PLACEHOLDER_URL)
  expect(site.isGoogleFormPlaceholder).toBe(true)
})
