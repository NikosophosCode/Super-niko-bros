import Phaser from 'phaser';

export const GAME_RESOLUTION = {
  width: 400,
  height: 240
};

export const SCALE_CONFIG = {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  max: {
    width: GAME_RESOLUTION.width * 2,
    height: GAME_RESOLUTION.height * 2
  }
};

export const PHYSICS_CONFIG = {
  default: 'arcade',
  arcade: {
    gravity: { y: 900 },
    debug: false,
    tileBias: 32
  }
};

export const GAME_SETTINGS = {
  title: 'Super Niko Bros',
  backgroundColor: '#5C94FC',
  pixelArt: true,
  roundPixels: true,
  render: {
    antialias: false,
    pixelArt: true
  },
  camera: {
    lerp: 0.12
  },
  hud: {
    fontFamily: 'Press Start 2P, SuperMario, monospace',
    fontSize: 12,
    padding: { x: 8, y: 4 }
  },
  player: {
    moveSpeed: 120,
    runSpeed: 160,
    jumpVelocity: -350,
    fireballCooldown: 250
  },
  world: {
    timeLimitSeconds: 400
  }
};
