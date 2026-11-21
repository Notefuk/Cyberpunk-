import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const page = (p: string) => fileURLToPath(new URL(p, import.meta.url))

// Manifest de la extensión de Owlbear (plan 29). Owlbear no acepta rutas relativas en el manifest
// ("Invalid URL"): tienen que empezar con "/". La beta vive en /Cyberpunk-/ (GitHub Pages); dev y prod, en /. [Claude Code · 2026-11-20]
function owlbearManifest(mode: string): Plugin {
  const dir = mode === 'beta' ? '/Cyberpunk-/owlbear/' : '/owlbear/'
  const manifest = JSON.stringify({
    name: 'Coberturas Cyberpunk RED',
    version: '1.0.0',
    manifest_version: 1,
    description: 'Coberturas del Core p.182: el GM marca objetos del mapa como cobertura y todos ven y dañan sus HP.',
    author: 'CPR Omni-Deck',
    icon: `${dir}icon.svg`,
    background_url: `${dir}background.html`,
    action: { title: 'Coberturas CPR', icon: `${dir}icon.svg`, popover: `${dir}index.html`, width: 360, height: 480 },
  }, null, 2)
  return {
    name: 'owlbear-manifest',
    configureServer(server) {
      server.middlewares.use('/owlbear/manifest.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(manifest)
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'owlbear/manifest.json', source: manifest })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    owlbearManifest(mode),
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
}))
