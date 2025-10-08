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
