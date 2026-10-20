import { createElement } from 'react'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => createElement('span', { 'data-testid': 'vercel-analytics', hidden: true }),
}))

vi.mock('@vercel/speed-insights/react', () => ({
  SpeedInsights: () => null,
}))

afterEach(() => {
  cleanup()
})
