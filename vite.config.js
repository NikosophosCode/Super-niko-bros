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
          'phaser': ['phaser'],
          'game-core': [
            './src/scenes/Game.js',
            './src/entities/Mario.js',
            './src/managers/LevelManager.js'
          ],
          'game-entities': [
            './src/entities/Goomba.js',
            './src/entities/Koopa.js',
            './src/entities/Block.js',
            './src/entities/Collectible.js'
          ]
        }
      }
    },
    // Optimizar assets
    assetsInlineLimit: 4096, // Inline assets < 4KB
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.logs en producción
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
