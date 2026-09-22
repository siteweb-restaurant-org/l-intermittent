import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// <!-- @include header --> → contenu de partials/header.html
const partials = () => ({
  name: 'partials',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) =>
      html.replace(/<!--\s*@include\s+([\w-]+)\s*-->/g, (_, name) =>
        readFileSync(resolve(__dirname, 'partials', `${name}.html`), 'utf8'),
      ),
  },
})

export default defineConfig({
  plugins: [partials()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        carte: resolve(__dirname, 'carte.html'),
        reserver: resolve(__dirname, 'reserver.html'),
      },
    },
  },
})
