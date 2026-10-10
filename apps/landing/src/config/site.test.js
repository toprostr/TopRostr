import { afterEach, expect, it, vi } from 'vitest'
import { readGoogleFormUrl } from './site.js'

const PLACEHOLDER_URL = 'https://example.com/toprostr-join-the-rostr-placeholder'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

it('uses the placeholder when VITE_GOOGLE_FORM_URL is missing or blank', () => {
  expect(readGoogleFormUrl({})).toBe(PLACEHOLDER_URL)
  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: '' })).toBe(PLACEHOLDER_URL)
  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: '   ' })).toBe(PLACEHOLDER_URL)
  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: 12 })).toBe(PLACEHOLDER_URL)
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

  expect(site.googleFormUrl).toBe(PLACEHOLDER_URL)
  expect(site.isGoogleFormPlaceholder).toBe(true)
})
