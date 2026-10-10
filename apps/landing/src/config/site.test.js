import { afterEach, expect, it, vi } from 'vitest'
import {
  GOOGLE_FORM_PLACEHOLDER_URL,
  GOOGLE_FORM_URL_PRODUCTION_ERROR,
  GOOGLE_FORM_URL_WARNING,
  googleFormBuildGuard,
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

it('accepts only https form URLs and falls back otherwise', () => {
  const configured = 'https://example.com/coach-questionnaire'

  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: configured })).toBe(configured)
  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: `  ${configured}  ` })).toBe(
    configured,
  )
  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: 'http://example.com/form' })).toBe(
    GOOGLE_FORM_PLACEHOLDER_URL,
  )
  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: 'javascript:alert(1)' })).toBe(
    GOOGLE_FORM_PLACEHOLDER_URL,
  )
  expect(readGoogleFormUrl({ VITE_GOOGLE_FORM_URL: 'not a url' })).toBe(
    GOOGLE_FORM_PLACEHOLDER_URL,
  )
})

it('fails a production build when the form URL is blank and exits 0 otherwise', () => {
  const production = googleFormBuildGuard({ VERCEL_ENV: 'production' })
  const productionBlank = googleFormBuildGuard({
    VERCEL_ENV: 'production',
    VITE_GOOGLE_FORM_URL: '   ',
  })
  const preview = googleFormBuildGuard({ VERCEL_ENV: 'preview' })
  const unset = googleFormBuildGuard({})
  const development = googleFormBuildGuard({ VERCEL_ENV: 'development' })
  const productionReady = googleFormBuildGuard({
    VERCEL_ENV: 'production',
    VITE_GOOGLE_FORM_URL: 'https://example.com/coach-questionnaire',
  })

  expect(production.exitCode).not.toBe(0)
  expect(production.message).toBe(GOOGLE_FORM_URL_PRODUCTION_ERROR)
  expect(productionBlank.exitCode).not.toBe(0)

  expect(preview.exitCode).toBe(0)
  expect(preview.warning).toBe(GOOGLE_FORM_URL_WARNING)
  expect(unset.exitCode).toBe(0)
  expect(unset.warning).toBe(GOOGLE_FORM_URL_WARNING)
  expect(development.exitCode).toBe(0)
  expect(development.warning).toBe(GOOGLE_FORM_URL_WARNING)
  expect(productionReady.exitCode).toBe(0)
  expect(productionReady.warning).toBe(null)
  expect(
    googleFormBuildGuard({
      VERCEL_ENV: 'production',
      VITE_GOOGLE_FORM_URL: 'http://example.com/form',
    }).exitCode,
  ).toBe(0)
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
