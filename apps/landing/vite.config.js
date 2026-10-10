import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { googleFormUrlBuildWarning } from './src/config/site.js'

const appRoot = fileURLToPath(new URL('.', import.meta.url))

// Warns during `vite build` when the form URL is missing. Does not fail the build.
function warnIfGoogleFormUrlMissing() {
  return {
    name: 'warn-missing-google-form-url',
    config(_config, { mode, command }) {
      if (command !== 'build') {
        return
      }

      const warning = googleFormUrlBuildWarning(loadEnv(mode, appRoot, ''))

      if (warning) {
        console.warn(warning)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), warnIfGoogleFormUrlMissing()],
})
