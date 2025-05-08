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
    port: 8080,
    proxy: {
      '/auth': {
        target: 'http://192.168.4.37:8080',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      },
      '/files': {
        target: 'http://192.168.4.37:8080',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      },
      '/users' : {
        target: 'http://192.168.4.37:8080',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      }
    }
  }
});
