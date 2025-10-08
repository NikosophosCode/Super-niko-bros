import { getLevelConfig, TileSymbols, TILEMAP_DIMENSIONS } from '@config/levelConfig';
import { BlockType } from '@entities/Block';

const { tileWidth, tileHeight } = TILEMAP_DIMENSIONS;

const collectibleDefaults = {
  coin: {
    allowGravity: false,
    animationKey: 'coin-spin'
  },
  'super-mushroom': {
    allowGravity: true,
    velocityX: 20
  },
  'fire-flower': {
    allowGravity: false
  }
};

export class LevelManager {
  constructor(scene, factory) {
    this.scene = scene;
    this.factory = factory;
    this.levelConfig = null;
    this.groups = {
      blocks: null,
      enemies: null,
      collectibles: null
    };
    this.goalZone = null;
    this.playerSpawnPoint = { x: 0, y: 0 };
    this.worldBounds = { width: 0, height: TILEMAP_DIMENSIONS.height * tileHeight };
    this.goalTileFromMap = null;
    this.blockConfigMap = new Map();
  }

  build(levelKey, groups = {}) {
    this.levelConfig = getLevelConfig(levelKey);
    this.goalTileFromMap = null;
    this.prepareBlockConfigMap();

    this.groups.blocks = groups.blocks ?? this.scene.physics.add.staticGroup();
    this.groups.enemies = groups.enemies ?? this.scene.physics.add.group();
    this.groups.collectibles = groups.collectibles ?? this.scene.physics.add.group();

    this.clearLevel();

    const rows = this.levelConfig.tilemap ?? [];
    const columns = rows[0]?.length ?? 0;
    this.worldBounds.width = columns * tileWidth;

    rows.forEach((row, rowIndex) => {
      [...row].forEach((symbol, columnIndex) => {
        this.handleTileSymbol(symbol, columnIndex, rowIndex);
      });
    });

    this.spawnEnemies();
    this.spawnCollectibles();
    this.spawnGoal();

    this.playerSpawnPoint = this.tileToWorld(
      this.levelConfig.playerSpawn.tileX,
      this.levelConfig.playerSpawn.tileY,
      'center'
    );

    return {
      config: this.levelConfig,
      playerSpawn: this.playerSpawnPoint,
      goalZone: this.goalZone,
      groups: this.groups,
      worldBounds: this.worldBounds
    };
  }

  clearLevel() {
    Object.values(this.groups).forEach((group) => {
      if (!group || typeof group.clear !== 'function') {
        return;
      }

      const hasChildren = group.children && typeof group.children === 'object';

      if (!hasChildren) {
        return;
      }

      group.clear(true, true);
    });

    this.goalZone?.destroy();
    this.goalZone = null;
  }

  handleTileSymbol(symbol, columnIndex, rowIndex) {
    const textures = this.levelConfig.blockTextures ?? {};
    const groundTexture = textures.ground ?? 'overworld-floor';
    const solidTexture = textures.solid ?? groundTexture;
    const breakableTexture = textures.breakable ?? solidTexture;
    const questionTexture = textures.question ?? solidTexture;
    const emptyTexture = textures.empty ?? 'empty-block-overworld';

    const { texture, options } = this.buildBlockOptions(columnIndex, rowIndex, () => {
      switch (symbol) {
        case TileSymbols.GROUND:
          return {
            texture: groundTexture,
            options: { type: BlockType.SOLID }
          };
        case TileSymbols.SOLID_BLOCK:
          return {
            texture: breakableTexture,
            options: { type: BlockType.BREAKABLE }
          };
        case TileSymbols.QUESTION_BLOCK:
          return {
            texture: questionTexture,
            options: { type: BlockType.QUESTION, depletedTexture: emptyTexture }
          };
        default:
          return {
            texture: solidTexture,
            options: { type: BlockType.SOLID }
          };
      }
    });

    switch (symbol) {
      case TileSymbols.GROUND: {
        const position = this.tileToWorld(columnIndex, rowIndex, 'bottom');
        const block = this.factory.createBlock(position.x, position.y, texture, options);
        block.setDepth(1);
        this.groups.blocks?.add(block);
        block.refreshBody();
        break;
      }
      case TileSymbols.SOLID_BLOCK: {
        const position = this.tileToWorld(columnIndex, rowIndex, 'bottom');
        const block = this.factory.createBlock(position.x, position.y, texture, options);
        block.setDepth(2);
        this.groups.blocks?.add(block);
        block.refreshBody();
        break;
      }
      case TileSymbols.QUESTION_BLOCK: {
        const position = this.tileToWorld(columnIndex, rowIndex, 'bottom');
        const block = this.factory.createBlock(position.x, position.y, texture, options);
        block.setDepth(2);
        this.groups.blocks?.add(block);
        block.refreshBody();
        break;
      }
      case TileSymbols.FLAG: {
        this.goalTileFromMap = { columnIndex, rowIndex };
        break;
      }
      default:
        break;
    }
  }

  spawnEnemies() {
    this.levelConfig.enemySpawns?.forEach((spawn) => {
      const position = this.tileToWorld(spawn.tileX, spawn.tileY, 'bottom');
      let enemy = null;

      if (spawn.type === 'goomba') {
        enemy = this.factory.createGoomba(position.x, position.y, spawn.texture);
      } else if (spawn.type === 'koopa') {
        enemy = this.factory.createKoopa(position.x, position.y, spawn.texture);
      }

      if (enemy) {
        enemy.setDepth(3);
        this.groups.enemies?.add(enemy);
        
        // Inicializar física después de agregar al grupo
        if (enemy.initPhysics) {
          enemy.initPhysics();
        }
      }
    });
  }

  spawnCollectibles() {
    this.levelConfig.collectibleSpawns?.forEach((spawn) => {
      const defaults = collectibleDefaults[spawn.type] ?? {};
      const {
        tileX,
        tileY,
        type,
        texture = defaults.texture,
        animationKey = defaults.animationKey,
        align = spawn.type === 'coin' ? 'center' : 'bottom',
        ...rest
      } = { ...defaults, ...spawn };

      if (!texture) {
        return;
      }

      const position = this.tileToWorld(tileX, tileY, align);
      const collectible = this.factory.createCollectible(position.x, position.y, texture, {
        type: type ?? spawn.type,
        animationKey,
        ...rest
      });

      this.groups.collectibles?.add(collectible);
    });
  }

  spawnGoal() {
    const goalConfig = this.levelConfig.goal ?? this.goalTileFromMap;

    if (!goalConfig) {
      return null;
    }

    const tileX = goalConfig.tileX ?? goalConfig.columnIndex;
    const tileY = goalConfig.tileY ?? goalConfig.rowIndex;
    const position = this.tileToWorld(tileX, tileY, 'bottom');

    this.goalZone?.destroy();

    this.goalZone = this.factory.createGoalFlag(position.x, position.y, {
      width: goalConfig.width ?? tileWidth,
      height: goalConfig.height ?? tileHeight * 5,
      flagTexture: goalConfig.flagTexture ?? 'flag',
      mastTexture: goalConfig.mastTexture ?? 'flag-mast'
    });

    return this.goalZone;
  }

  tileToWorld(columnIndex, rowIndex, align = 'center') {
    const baseX = columnIndex * tileWidth;
    const baseY = rowIndex * tileHeight;

    switch (align) {
      case 'bottom':
        return {
          x: baseX + tileWidth / 2,
          y: baseY + tileHeight
        };
      case 'top':
        return {
          x: baseX + tileWidth / 2,
          y: baseY
        };
      case 'center':
      default:
        return {
          x: baseX + tileWidth / 2,
          y: baseY + tileHeight / 2
        };
    }
  }

  getPlayerSpawn() {
    return { ...this.playerSpawnPoint };
  }

  getWorldBounds() {
    return { ...this.worldBounds };
  }

  getGoalZone() {
    return this.goalZone;
  }

  getLevelConfig() {
    return this.levelConfig;
  }

  prepareBlockConfigMap() {
    this.blockConfigMap.clear();

    const blocks = this.levelConfig.blockContents ?? [];

    blocks.forEach((block) => {
      const key = `${block.tileX},${block.tileY}`;
      this.blockConfigMap.set(key, block);
    });
  }

  buildBlockOptions(tileX, tileY, defaultsFactory) {
    const defaults = defaultsFactory();
    const override = this.blockConfigMap.get(`${tileX},${tileY}`) ?? {};

    return {
      texture: override.texture ?? defaults.texture,
      options: {
        ...defaults.options,
        ...(override.type ? { type: override.type } : {}),
        ...(override.payload ? { payload: override.payload } : {}),
        ...(override.depletedTexture ? { depletedTexture: override.depletedTexture } : {}),
        ...(override.bounceOffset ? { bounceOffset: override.bounceOffset } : {})
      }
    };
  }
}
