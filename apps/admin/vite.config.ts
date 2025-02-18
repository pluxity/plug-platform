import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  envDir: './config',
  server: {
    open: true,
    host: '0.0.0.0',
    port: 3001,
  },
  build: {
    outDir: 'build'
  },
  assetsInclude: ['assets', 'libs', '**/*.FBX', '**/*.glb', '**/*.ifc'],
  esbuild: {
    loader: 'tsx'
  }
})
