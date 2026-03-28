import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

/** 让 /presentation/ 指向 public 下的静态页，避免被 SPA 兜底成空白 */
function presentationStaticIndex() {
  const rewrite = (req, _res, next) => {
    const raw = req.url || ''
    const path = raw.split('?')[0]
    if (path === '/presentation' || path === '/presentation/') {
      req.url = '/presentation/index.html' + (raw.includes('?') ? '?' + raw.split('?').slice(1).join('?') : '')
    }
    next()
  }
  return {
    name: 'presentation-static-index',
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite)
    }
  }
}

export default defineConfig({
  plugins: [presentationStaticIndex(), vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
