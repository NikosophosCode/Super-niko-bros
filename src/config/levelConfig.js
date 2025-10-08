import { BlockType } from '@entities/Block';

const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;
const LEVEL_WIDTH_TILES = 60;
const LEVEL_HEIGHT_TILES = 15;

const createRow = (fill = '.', placements = []) => {
  const row = Array.from({ length: LEVEL_WIDTH_TILES }, () => fill);
  placements.forEach(({ index, symbol }) => {
    if (index < 0 || index >= LEVEL_WIDTH_TILES) {
      return;
    }

    row[index] = symbol;
  });
  return row.join('');
};

const fillRow = (symbol) => symbol.repeat(LEVEL_WIDTH_TILES);

const level1Tilemap = [
  createRow(),
  createRow(),
  createRow(),
  createRow('.', [{ index: 30, symbol: 'B' }]),
  createRow('.', [
    { index: 22, symbol: 'B' },
    { index: 23, symbol: '?' },
    { index: 24, symbol: 'B' }
  ]),
  createRow('.', [{ index: 18, symbol: '?' }]),
  createRow('.', [{ index: 35, symbol: 'B' }]),
  createRow('.', [
    { index: 12, symbol: 'B' },
    { index: 13, symbol: '?' },
    { index: 14, symbol: 'B' }
  ]),
  createRow(),
  createRow('.', [
    { index: 9, symbol: 'B' },
    { index: 10, symbol: '?' },
    { index: 11, symbol: 'B' },
    { index: 55, symbol: 'F' }
  ]),
  createRow(),
  createRow('.', [{ index: 27, symbol: '?' }]),
  createRow('X', [
    { index: 24, symbol: '.' },
    { index: 25, symbol: '.' },
    { index: 26, symbol: '.' }
  ]),
  fillRow('X'),
  fillRow('X')
];

const level2Tilemap = [
  createRow(),
  createRow(),
  createRow('.', [
    { index: 10, symbol: 'B' },
    { index: 11, symbol: 'B' },
    { index: 12, symbol: 'B' }
  ]),
  createRow('.', [{ index: 36, symbol: '?' }]),
  createRow('.', [
    { index: 20, symbol: 'B' },
    { index: 21, symbol: '?' },
    { index: 22, symbol: 'B' },
    { index: 40, symbol: 'B' }
  ]),
  createRow('.', [{ index: 40, symbol: '?' }]),
  createRow('.', [
    { index: 5, symbol: 'B' },
    { index: 6, symbol: '?' },
    { index: 7, symbol: 'B' }
  ]),
  createRow(),
  createRow('.', [{ index: 15, symbol: '?' }]),
  createRow('.', [
    { index: 50, symbol: 'B' },
    { index: 51, symbol: '?' },
    { index: 52, symbol: 'B' },
    { index: 57, symbol: 'F' }
  ]),
  createRow(),
  createRow('.', [{ index: 33, symbol: '?' }]),
  createRow('X', [
    { index: 18, symbol: '.' },
    { index: 19, symbol: '.' }
  ]),
  fillRow('X'),
  fillRow('X')
];

export const TileSymbols = Object.freeze({
  EMPTY: '.',
  GROUND: 'X',
  SOLID_BLOCK: 'B',
  QUESTION_BLOCK: '?',
  FLAG: 'F'
});

export const LEVEL_DEFINITIONS = {
  '1-1': {
    key: '1-1',
    theme: 'overworld',
    backgroundColor: '#5C94FC',
    musicKey: 'music-overworld-theme',
    nextLevel: '1-2',
    timeLimit: 400,
    tilemap: level1Tilemap,
    playerSpawn: { tileX: 2, tileY: 12 },
    enemySpawns: [
      { type: 'goomba', texture: 'goomba-overworld', tileX: 12, tileY: 12 },
      { type: 'goomba', texture: 'goomba-overworld', tileX: 28, tileY: 12 },
      { type: 'koopa', texture: 'koopa', tileX: 46, tileY: 12 }
    ],
    collectibleSpawns: [
      { type: 'coin', texture: 'coin-spin', animationKey: 'coin-spin', tileX: 23, tileY: 6 },
      { type: 'coin', texture: 'coin-spin', animationKey: 'coin-spin', tileX: 10, tileY: 8 },
      { type: 'super-mushroom', texture: 'super-mushroom', tileX: 35, tileY: 11 }
    ],
    goal: { tileX: 55, tileY: 12 },
    blockTextures: {
      ground: 'overworld-floor',
      solid: 'block-overworld',
      question: 'mystery-block-overworld'
    }
  },
  '1-2': {
    key: '1-2',
    theme: 'underground',
    backgroundColor: '#1A1C2C',
    musicKey: 'music-underground-theme',
    nextLevel: null,
    timeLimit: 300,
    tilemap: level2Tilemap,
    playerSpawn: { tileX: 2, tileY: 12 },
    enemySpawns: [
      { type: 'goomba', texture: 'goomba-underground', tileX: 16, tileY: 12 },
      { type: 'goomba', texture: 'goomba-underground', tileX: 30, tileY: 12 },
      { type: 'koopa', texture: 'koopa', tileX: 48, tileY: 12 }
    ],
    collectibleSpawns: [
      { type: 'coin', texture: 'coin-spin', animationKey: 'coin-spin', tileX: 21, tileY: 7 },
      { type: 'coin', texture: 'ground-coin', animationKey: 'coin-ground-spin', tileX: 41, tileY: 9 },
      { type: 'fire-flower', texture: 'fire-flower-underground', tileX: 6, tileY: 11 }
    ],
    goal: { tileX: 57, tileY: 12 },
    blockTextures: {
      ground: 'underground-floor',
      solid: 'block-underground',
      question: 'mystery-block-underground'
    }
  }
};

export const DEFAULT_LEVEL_KEY = '1-1';

export function getLevelConfig(levelKey = DEFAULT_LEVEL_KEY) {
  return LEVEL_DEFINITIONS[levelKey] ?? LEVEL_DEFINITIONS[DEFAULT_LEVEL_KEY];
}

export const TILEMAP_DIMENSIONS = Object.freeze({
  width: LEVEL_WIDTH_TILES,
  height: LEVEL_HEIGHT_TILES,
  tileWidth: TILE_WIDTH,
  tileHeight: TILE_HEIGHT
});
