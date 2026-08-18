import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

/**
 * Builds the whole demo into one self-contained HTML file (fonts included as
 * data URIs) so it can be published as a Claude artifact, where a strict CSP
 * blocks every external request.
 */
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist-artifact',
    assetsInlineLimit: 2 * 1024 * 1024,
    rollupOptions: { input: 'artifact.html' },
  },
})
