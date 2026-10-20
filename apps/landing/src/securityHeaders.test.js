import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, it } from 'vitest'

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const vercel = JSON.parse(readFileSync(resolve(appRoot, 'vercel.json'), 'utf8'))

function headersFor(source) {
  const rule = vercel.headers.find((entry) => entry.source === source)

  expect(rule).toBeTruthy()

  return Object.fromEntries(rule.headers.map((header) => [header.key, header.value]))
}

it('sends a strict policy on every route and immutable caching for hashed assets', () => {
  const documentHeaders = headersFor('/(.*)')
  const assetHeaders = headersFor('/assets/(.*)')
  const csp = documentHeaders['Content-Security-Policy']

  expect(csp).toContain("default-src 'self'")
  // Production Web Analytics loads /_vercel/insights/script.js and posts to
  // /_vercel/insights. Both are same-origin, so 'self' is enough.
  // va.vercel-scripts.com is only the local debug script.
  expect(csp).toContain("script-src 'self'")
  expect(csp).toContain("connect-src 'self'")
  expect(csp).not.toContain('va.vercel-scripts.com')
  expect(csp).not.toContain('vercel.live')
  expect(csp).toContain("script-src-attr 'none'")
  expect(csp).toContain("style-src-attr 'unsafe-inline'")
  expect(csp).not.toMatch(/script-src\s[^;]*unsafe-inline/)
  expect(csp).toContain('https://fonts.googleapis.com')
  expect(csp).toContain("img-src 'self' data:")
  expect(csp).toContain('https://fonts.gstatic.com')
  expect(csp).toContain('https://vitals.vercel-insights.com')
  expect(csp).toContain("frame-ancestors 'none'")
  expect(csp).toContain("object-src 'none'")
  expect(csp).toContain("base-uri 'self'")
  expect(csp).toContain("form-action 'self'")

  expect(documentHeaders['Strict-Transport-Security']).toBe(
    'max-age=63072000; includeSubDomains',
  )
  expect(documentHeaders['X-Content-Type-Options']).toBe('nosniff')
  expect(documentHeaders['X-Frame-Options']).toBe('DENY')
  expect(documentHeaders['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
  expect(documentHeaders['Permissions-Policy']).toContain('camera=()')
  expect(documentHeaders['Permissions-Policy']).toContain('geolocation=()')
  expect(documentHeaders['Permissions-Policy']).toContain('microphone=()')

  expect(assetHeaders['Cache-Control']).toBe('public, max-age=31536000, immutable')
})
