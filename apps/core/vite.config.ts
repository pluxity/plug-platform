import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    svgr({
      include: "**/*.svg",
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@plug/core': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    allowedHosts: ['app.plug-platform.com'],
    port: 4000,
    proxy: {
        '/api': {
            target: 'http://api.pluxity.com:8080',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api/, '')
        }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
