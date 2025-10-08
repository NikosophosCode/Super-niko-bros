import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const ASSETS_DIR = './assets';
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg'];

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  
  if (!SUPPORTED_FORMATS.includes(ext)) {
    return;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Solo optimizar si la imagen es mayor a 10KB
    if (metadata.size > 10240) {
      await image
        .png({ 
          quality: 90, 
          compressionLevel: 9,
          palette: true // Usar paleta para sprites
        })
        .toFile(filePath.replace(ext, '_optimized' + ext));
      
      console.log(`✓ Optimizada: ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error optimizando ${filePath}:`, error.message);
  }
}

async function walkDirectory(dir) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stats = await stat(filePath);
    
    if (stats.isDirectory()) {
      await walkDirectory(filePath);
    } else {
      await optimizeImage(filePath);
    }
  }
}

console.log('🎨 Iniciando optimización de imágenes...\n');
await walkDirectory(ASSETS_DIR);
console.log('\n✨ Optimización completada');
