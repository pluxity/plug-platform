import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr'
import cesium from 'vite-plugin-cesium'

export default defineConfig(({ mode }) => {
  const base = mode === 'development' ? '/' : './'

  return {
    base,
    plugins: [
      react(), 
      tailwindcss(),
      svgr({
        include: "**/*.svg",
      }),
      cesium(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@plug/core': path.resolve(__dirname, './src')
      }
    },
    server: {
      host: true,
      port: 4000,
      proxy: {
          '/api': {
              target: 'http://192.168.10.181:8209',
              changeOrigin: true,
              secure: false,
              rewrite: (path) => path.replace(/^\/api/, '')
          }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true
      },
  }
})
