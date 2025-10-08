import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('phaser', () => {
  class MockSprite {}
  class MockZone {}
  class MockScene {}
  class EventEmitter {}

  return {
    __esModule: true,
    default: {
      Physics: { Arcade: { Sprite: MockSprite } },
      GameObjects: { Zone: MockZone },
      Scenes: { Events: { SHUTDOWN: 'shutdown' } },
      Scene: MockScene
    },
    Physics: { Arcade: { Sprite: MockSprite } },
    GameObjects: { Zone: MockZone },
    Scenes: { Events: { SHUTDOWN: 'shutdown' } },
    Events: { EventEmitter },
    Scene: MockScene
  };
});
import { LevelManager } from '@managers/LevelManager';
import { BlockType } from '@entities/Block';
import { TILEMAP_DIMENSIONS } from '@config/levelConfig';

class FakeGroup {
  constructor() {
    this.items = [];
    this.children = this.items;
  }

  add(item) {
    this.items.push(item);
  }

  clear() {
    this.items.length = 0;
  }
}

const createSceneStub = () => {
  const factory = () => new FakeGroup();

  return {
    physics: {
      add: {
        staticGroup: factory,
        group: factory
      }
    }
  };
};

const createFactoryStub = () => ({
  createBlock(x, y, texture, options) {
    return {
      x,
      y,
      texture,
      options,
      type: options.type,
      payload: options.payload,
      setDepth() {},
      refreshBody() {}
    };
  },
  createGoomba(x, y, texture) {
    return {
      x,
      y,
      texture,
      setDepth() {}
    };
  },
  createKoopa(x, y, texture) {
    return {
      x,
      y,
      texture,
      setDepth() {}
    };
  },
  createCollectible(x, y, texture, options) {
    return {
      x,
      y,
      texture,
      options,
      setDepth() {}
    };
  },
  createGoalFlag(x, y, config) {
    return {
      x,
      y,
      config,
      destroy() {}
    };
  }
});

describe('LevelManager', () => {
  let scene;
  let factory;
  let manager;

  beforeEach(() => {
    scene = createSceneStub();
    factory = createFactoryStub();
    manager = new LevelManager(scene, factory);
  });

  it('returns player spawn and world bounds for a level', () => {
    const result = manager.build('1-1');

  expect(result.playerSpawn).toEqual({ x: 40, y: 200 });
    expect(result.worldBounds.width).toBe(TILEMAP_DIMENSIONS.width * TILEMAP_DIMENSIONS.tileWidth);
    expect(result.goalZone).toBeDefined();
  });

  it('marks brick blocks as breakable and applies payloads to question blocks', () => {
    const { groups } = manager.build('1-1');
    const blocks = groups.blocks.items;

    const breakableBlocks = blocks.filter((block) => block.type === BlockType.BREAKABLE);
    const questionBlocks = blocks.filter((block) => block.type === BlockType.QUESTION);

    expect(breakableBlocks.length).toBeGreaterThan(0);
    expect(questionBlocks.length).toBeGreaterThan(0);

    const payloadTypes = questionBlocks.map((block) => block.payload?.type);
    expect(payloadTypes).toContain('coin');
    expect(payloadTypes).toContain('super-mushroom');
  });

  it('spawns configured enemies and collectibles', () => {
    const { groups } = manager.build('1-1');

    expect(groups.enemies.items.length).toBeGreaterThan(0);
    expect(groups.collectibles.items.length).toBeGreaterThan(0);
  });
});
