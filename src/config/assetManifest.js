export const IMAGE_ASSETS = [
  { key: 'ui-arrows', url: 'controls/arrows.png' },
  { key: 'flag', url: 'scenery/final-flag.png' },
  { key: 'flag-mast', url: 'scenery/flag-mast.png' },
  { key: 'castle', url: 'scenery/castle.png' },
  { key: 'sign', url: 'scenery/sign.png' },
  { key: 'pipe-small', url: 'scenery/vertical-small-tube.png' },
  { key: 'pipe-medium', url: 'scenery/vertical-medium-tube.png' },
  { key: 'pipe-large', url: 'scenery/vertical-large-tube.png' },
  { key: 'pipe-horizontal', url: 'scenery/horizontal-tube.png' },
  { key: 'pipe-horizontal-final', url: 'scenery/horizontal-final-tube.png' },
  { key: 'overworld-floor', url: 'scenery/overworld/floorbricks.png' },
  { key: 'underground-floor', url: 'scenery/underground/floorbricks.png' },
  { key: 'overworld-bush1', url: 'scenery/overworld/bush1.png' },
  { key: 'overworld-bush2', url: 'scenery/overworld/bush2.png' },
  { key: 'overworld-cloud1', url: 'scenery/overworld/cloud1.png' },
  { key: 'overworld-cloud2', url: 'scenery/overworld/cloud2.png' },
  { key: 'overworld-mountain1', url: 'scenery/overworld/mountain1.png' },
  { key: 'overworld-mountain2', url: 'scenery/overworld/mountain2.png' },
  { key: 'overworld-fence', url: 'scenery/overworld/fence.png' }
];

export const TILEBLOCK_ASSETS = [
  { key: 'block-overworld', url: 'blocks/overworld/block.png' },
  { key: 'brick-debris-overworld', url: 'blocks/overworld/brick-debris.png' },
  { key: 'mystery-block-overworld', url: 'blocks/overworld/misteryBlock.png' },
  { key: 'custom-block-overworld', url: 'blocks/overworld/customBlock.png' },
  { key: 'immovable-block-overworld', url: 'blocks/overworld/immovableBlock.png' },
  { key: 'empty-block-overworld', url: 'blocks/overworld/emptyBlock.png' },
  { key: 'block-underground', url: 'blocks/underground/block.png' },
  { key: 'block2-underground', url: 'blocks/underground/block2.png' },
  { key: 'brick-debris-underground', url: 'blocks/underground/brick-debris.png' },
  { key: 'mystery-block-underground', url: 'blocks/underground/misteryBlock.png' },
  { key: 'immovable-block-underground', url: 'blocks/underground/immovableBlock.png' },
  { key: 'empty-block-underground', url: 'blocks/underground/emptyBlock.png' }
];

export const SPRITESHEET_ASSETS = [
  {
    key: 'mario-small',
    url: 'entities/mario.png',
    frameConfig: { frameWidth: 16, frameHeight: 16 }
  },
  {
    key: 'mario-grown',
    url: 'entities/mario-grown.png',
    frameConfig: { frameWidth: 16, frameHeight: 32 }
  },
  {
    key: 'mario-fire',
    url: 'entities/mario-fire.png',
    frameConfig: { frameWidth: 16, frameHeight: 32 }
  },
  {
    key: 'goomba-overworld',
    url: 'entities/overworld/goomba.png',
    frameConfig: { frameWidth: 16, frameHeight: 16 }
  },
  {
    key: 'goomba-underground',
    url: 'entities/underground/goomba.png',
    frameConfig: { frameWidth: 16, frameHeight: 16 }
  },
  {
    key: 'koopa',
    url: 'entities/koopa.png',
    frameConfig: { frameWidth: 16, frameHeight: 24 }
  },
  {
    key: 'shell',
    url: 'entities/shell.png',
    frameConfig: { frameWidth: 16, frameHeight: 16 }
  },
  {
    key: 'fireball',
    url: 'entities/fireball.png',
    frameConfig: { frameWidth: 16, frameHeight: 16 }
  },
  {
    key: 'fireball-explosion',
    url: 'entities/fireball-explosion.png',
    frameConfig: { frameWidth: 32, frameHeight: 32 }
  },
  {
    key: 'coin-spin',
    url: 'collectibles/coin.png',
    frameConfig: { frameWidth: 16, frameHeight: 16 }
  },
  {
    key: 'ground-coin',
    url: 'collectibles/underground/ground-coin.png',
    frameConfig: { frameWidth: 16, frameHeight: 16 }
  },
  {
    key: 'super-mushroom',
    url: 'collectibles/super-mushroom.png',
    frameConfig: { frameWidth: 16, frameHeight: 16 }
  },
  {
    key: 'live-mushroom',
    url: 'collectibles/live-mushroom.png',
    frameConfig: { frameWidth: 16, frameHeight: 16 }
  },
  {
    key: 'fire-flower-overworld',
    url: 'collectibles/overworld/fire-flower.png',
    frameConfig: { frameWidth: 16, frameHeight: 16 }
  },
  {
    key: 'fire-flower-underground',
    url: 'collectibles/underground/fire-flower.png',
    frameConfig: { frameWidth: 16, frameHeight: 16 }
  }
];

export const AUDIO_ASSETS = {
  music: [
    { key: 'music-overworld-theme', url: 'sound/music/overworld/theme.mp3' },
    { key: 'music-overworld-hurry', url: 'sound/music/overworld/hurry-up-theme.mp3' },
    { key: 'music-underground-theme', url: 'sound/music/underground/theme.mp3' },
    { key: 'music-underground-hurry', url: 'sound/music/underground/hurry-up-theme.mp3' },
    { key: 'music-win', url: 'sound/music/win.wav' },
    { key: 'music-gameover', url: 'sound/music/gameover.mp3' }
  ],
  sfx: [
    { key: 'sfx-coin', url: 'sound/effects/coin.mp3' },
    { key: 'sfx-jump', url: 'sound/effects/jump.mp3' },
    { key: 'sfx-goomba-stomp', url: 'sound/effects/goomba-stomp.wav' },
    { key: 'sfx-block-bump', url: 'sound/effects/block-bump.wav' },
    { key: 'sfx-break-block', url: 'sound/effects/break-block.wav' },
    { key: 'sfx-fireball', url: 'sound/effects/fireball.mp3' },
    { key: 'sfx-powerup', url: 'sound/effects/consume-powerup.mp3' },
    { key: 'sfx-powerup-appear', url: 'sound/effects/powerup-appears.mp3' },
    { key: 'sfx-powerdown', url: 'sound/effects/powerdown.mp3' },
    { key: 'sfx-life', url: 'sound/effects/here-we-go.mp3' },
    { key: 'sfx-life-alt', url: 'sound/effects/cursed-here-we-go.mp3' },
    { key: 'sfx-flagpole', url: 'sound/effects/flagpole.mp3' },
    { key: 'sfx-kick', url: 'sound/effects/kick.mp3' },
    { key: 'sfx-pause', url: 'sound/effects/pause.wav' },
    { key: 'sfx-time-warning', url: 'sound/effects/time-warning.mp3' }
  ]
};

export const BITMAP_FONTS = [
  {
    key: 'carrier-command',
    textureURL: 'fonts/carrier_command.png',
    dataURL: 'fonts/carrier_command.xml'
  }
];
