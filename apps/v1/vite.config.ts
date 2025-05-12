import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
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
      '/auth': {
        target: 'http://api.plug-platform.com:8080',
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
