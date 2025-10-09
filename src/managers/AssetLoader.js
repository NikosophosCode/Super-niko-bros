import {
  IMAGE_ASSETS,
  TILEBLOCK_ASSETS,
  SPRITESHEET_ASSETS,
  AUDIO_ASSETS,
  BITMAP_FONTS
} from '@config/assetManifest';

export class AssetLoader {
  constructor(scene) {
    this.scene = scene;
    this.loadedAssets = {
      critical: false,
      secondary: false,
      optional: false
    };
  }

  // Carga solo assets críticos para empezar rápido
  preloadCritical() {
    // Cargar solo assets necesarios para el menú principal
    
    criticalImages.forEach(({ key, url }) => {
      this.scene.load.image(key, url);
    });

    // Cargar solo la fuente bitmap crítica
    const criticalFont = BITMAP_FONTS[0];
    this.scene.load.bitmapFont(
      criticalFont.key,
      criticalFont.textureURL,
      criticalFont.dataURL
    );
  }

  // Carga assets del juego principal (sin audio)
  preloadGameAssets() {
    this.loadImages();
    this.loadTileBlocks();
    this.loadSpriteSheets();
  }

  // Carga audio en segundo plano
  preloadAudio() {
    AUDIO_ASSETS.music.forEach(({ key, url }) => {
      this.scene.load.audio(key, url);
    });

    AUDIO_ASSETS.sfx.forEach(({ key, url }) => {
      this.scene.load.audio(key, url);
    });
  }

  preload() {
    this.loadImages();
    this.loadTileBlocks();
    this.loadSpriteSheets();
    this.loadAudio();
    this.loadBitmapFonts();
  }

  loadImages() {
    IMAGE_ASSETS.forEach(({ key, url }) => {
      this.scene.load.image(key, url);
    });
  }

  loadTileBlocks() {
    TILEBLOCK_ASSETS.forEach(({ key, url }) => {
      this.scene.load.image(key, url);
    });
  }

  loadSpriteSheets() {
    SPRITESHEET_ASSETS.forEach(({ key, url, frameConfig }) => {
      this.scene.load.spritesheet(key, url, frameConfig);
    });
  }

  loadAudio() {
    AUDIO_ASSETS.music.forEach(({ key, url }) => {
      this.scene.load.audio(key, url);
    });

    AUDIO_ASSETS.sfx.forEach(({ key, url }) => {
      this.scene.load.audio(key, url);
    });
  }

  loadBitmapFonts() {
    BITMAP_FONTS.forEach(({ key, textureURL, dataURL }) => {
      this.scene.load.bitmapFont(key, textureURL, dataURL);
    });
  }
}
