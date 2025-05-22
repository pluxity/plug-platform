import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

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
      '@plug/v1': path.resolve(__dirname, './src')
    },
  },
  assetsInclude: ['**/*.glb'],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['app.plug-platform.com'],
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://api.plug-platform.com:8080',
        rewrite: (path) => path.replace(/^\/api/, ''),      
      },
    }
  }
});
