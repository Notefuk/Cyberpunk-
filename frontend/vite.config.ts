import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const page = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      // La app y las páginas de la extensión de Owlbear (plan 29), que salen en dist/owlbear/. [Claude Code · 2026-11-20]
      input: {
        main: page('./index.html'),
        owlbearBackground: page('./owlbear/background.html'),
        owlbearCover: page('./owlbear/cover.html'),
        owlbearPanel: page('./owlbear/index.html'),
      },
    },
  },
})
