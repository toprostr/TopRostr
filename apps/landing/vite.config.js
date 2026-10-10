/* global process */
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { googleFormBuildGuard } from './src/config/site.js'

const appRoot = fileURLToPath(new URL('.', import.meta.url))

// VERCEL_ENV is not a VITE_ variable, so it is read from process.env (Vercel
// sets it on the build) or from loadEnv with an empty prefix. import.meta.env
// does not include it.
function formUrlEnv(mode) {
  const fromFiles = loadEnv(mode, appRoot, '')

  return {
    VITE_GOOGLE_FORM_URL:
      process.env.VITE_GOOGLE_FORM_URL ?? fromFiles.VITE_GOOGLE_FORM_URL,
    VERCEL_ENV: process.env.VERCEL_ENV ?? fromFiles.VERCEL_ENV,
  }
}

// Warns during `vite build` when the form URL is missing. A production
// Vercel build fails instead. Preview and development still exit 0.
function warnIfGoogleFormUrlMissing() {
  return {
    name: 'warn-missing-google-form-url',
    config(_config, { mode, command }) {
      if (command !== 'build') {
        return
      }

      const guard = googleFormBuildGuard(formUrlEnv(mode))

      if (guard.exitCode !== 0) {
        throw new Error(guard.message)
      }

      if (guard.warning) {
        console.warn(guard.warning)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), warnIfGoogleFormUrlMissing()],
})
