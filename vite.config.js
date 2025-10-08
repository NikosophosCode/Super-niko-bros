import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const pathFromRoot = (relativePath) => fileURLToPath(new URL(relativePath, import.meta.url));

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
      '@': pathFromRoot('./src'),
      '@config': pathFromRoot('./src/config'),
      '@scenes': pathFromRoot('./src/scenes'),
      '@entities': pathFromRoot('./src/entities'),
      '@managers': pathFromRoot('./src/managers'),
      '@state': pathFromRoot('./src/state'),
      '@utils': pathFromRoot('./src/utils')
    }
  },
  test: {
    environment: 'node',
    globals: true,
    alias: {
      '@': pathFromRoot('./src'),
      '@config': pathFromRoot('./src/config'),
      '@scenes': pathFromRoot('./src/scenes'),
      '@entities': pathFromRoot('./src/entities'),
      '@managers': pathFromRoot('./src/managers'),
      '@state': pathFromRoot('./src/state'),
      '@utils': pathFromRoot('./src/utils')
    }
  }
});
