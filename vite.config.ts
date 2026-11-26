import react from '@vitejs/plugin-react'
import { execFileSync } from 'node:child_process'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

function getBuildInfo() {
  const builtAt = new Date().toISOString()
  let commit = process.env.GITHUB_SHA ?? 'local'
  try {
    if (commit === 'local') {
      commit = execFileSync('git', ['rev-parse', 'HEAD'], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim()
    }
  } catch {
    // A source archive may not contain Git metadata. The timestamp still makes
    // the generated build identifiable without requiring local configuration.
  }

  return {
    id: process.env.EARLY_READING_BUILD_ID ?? `${commit.slice(0, 12)}-${builtAt}`,
    commit,
    builtAt,
  }
}

// https://vite.dev/config/
export default defineConfig(() => {
  const build = getBuildInfo()

  return {
    base: '/early-reading/',
    define: {
      __APP_BUILD__: JSON.stringify(build),
    },
    plugins: [
      react(),
      {
        name: 'early-reading-build-info',
        apply: 'build',
        generateBundle() {
          this.emitFile({
            type: 'asset',
            fileName: 'build-info.json',
            source: JSON.stringify(build),
          })
        },
      },
      VitePWA({
        registerType: 'prompt',
        injectRegister: false,
        scope: '/early-reading/',
        includeManifestIcons: false,
        manifest: {
          name: 'Reading',
          short_name: 'Reading',
          description: 'Early reading lessons for beginning readers.',
          start_url: '/early-reading/',
          scope: '/early-reading/',
          display: 'standalone',
          background_color: '#fffdfb',
          theme_color: '#fffdfb',
          icons: [
            {
              src: 'icons/reading-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'icons/reading-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,svg,wav}'],
          cleanupOutdatedCaches: true,
          navigateFallback: 'index.html',
          // Diagnostics must always reach the deployment server.
          navigateFallbackDenylist: [/^\/early-reading\/build-info\.json(?:\?|$)/],
        },
      }),
    ],
  }
})
