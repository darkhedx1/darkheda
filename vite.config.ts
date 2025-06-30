import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // ULTRA GÜÇLÜ BUILD AYARLARI
    sourcemap: false,
    minify: 'terser',
    target: 'es2015',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  server: {
    // ULTRA GÜÇLÜ SERVER AYARLARI - SPA ROUTING
    historyApiFallback: true,
    host: true,
    port: 5173,
    strictPort: false,
    cors: true,
    headers: {
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  },
  preview: {
    // ULTRA GÜÇLÜ PREVIEW AYARLARI - SPA ROUTING
    historyApiFallback: true,
    host: true,
    port: 4173,
    strictPort: false,
    cors: true,
    headers: {
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  },
  // ULTRA GÜÇLÜ BASE AYARLARI
  base: '/',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});