import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, it } from 'vitest'

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const html = readFileSync(resolve(appRoot, 'index.html'), 'utf8')

it('points the canonical url and og:image at toprostr.com', () => {
  expect(html).toContain('<link rel="canonical" href="https://toprostr.com/"')
  expect(html).toContain('property="og:image" content="https://toprostr.com/og-image.png"')

  const image = readFileSync(resolve(appRoot, 'public/og-image.png'))
  const width = image.readUInt32BE(16)
  const height = image.readUInt32BE(20)

  expect(image.subarray(12, 16).toString('ascii')).toBe('IHDR')
  expect(width).toBe(1200)
  expect(height).toBe(630)
  expect(image.length).toBeLessThan(300 * 1024)
})
