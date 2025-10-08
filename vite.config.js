import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const pathFromRoot = (relativePath) => fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  root: '.',
  base: '/',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // Desactivar sourcemaps en producción
    rollupOptions: {
      output: {
        manualChunks: {
          'phaser': ['phaser']
        }
      }
    },
    // Optimizar assets
    assetsInlineLimit: 4096, // Inline assets < 4KB
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Mantener console.logs para debugging
        drop_debugger: true
      }
    }
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
