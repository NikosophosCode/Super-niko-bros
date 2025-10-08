import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    port: 5173,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src',
      '@config': '/src/config',
      '@scenes': '/src/scenes',
      '@entities': '/src/entities',
      '@managers': '/src/managers',
      '@state': '/src/state',
      '@utils': '/src/utils'
    }
  }
});
