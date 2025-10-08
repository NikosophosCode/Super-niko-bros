const repeatForever = -1;

export const AnimationKeys = Object.freeze({
  MARIO: {
    SMALL: {
      IDLE: 'mario-small-idle',
      RUN: 'mario-small-run',
      RUN_FAST: 'mario-small-run-fast',
      JUMP: 'mario-small-jump',
      TURN: 'mario-small-turn',
      CLIMB: 'mario-small-climb'
    },
    SUPER: {
      IDLE: 'mario-super-idle',
      RUN: 'mario-super-run',
      RUN_FAST: 'mario-super-run-fast',
      JUMP: 'mario-super-jump',
      CROUCH: 'mario-super-crouch',
      TURN: 'mario-super-turn',
      CLIMB: 'mario-super-climb'
    },
    FIRE: {
      IDLE: 'mario-fire-idle',
      RUN: 'mario-fire-run',
      RUN_FAST: 'mario-fire-run-fast',
      JUMP: 'mario-fire-jump',
      CROUCH: 'mario-fire-crouch',
      TURN: 'mario-fire-turn',
      CLIMB: 'mario-fire-climb',
      THROW: 'mario-fire-throw'
    }
  },
  ENEMIES: {
    GOOMBA: {
      OVERWORLD_WALK: 'goomba-overworld-walk',
      OVERWORLD_SQUASHED: 'goomba-overworld-squashed',
      UNDERGROUND_WALK: 'goomba-underground-walk',
      UNDERGROUND_SQUASHED: 'goomba-underground-squashed'
    },
    KOOPA: {
      WALK: 'koopa-walk',
      SHELL: 'koopa-shell',
      SHELL_SPIN: 'koopa-shell-spin'
    }
  },
  PROJECTILES: {
    FIREBALL: 'fireball-move',
    FIREBALL_EXPLODE: 'fireball-explode'
  },
  COLLECTIBLES: {
    COIN: 'coin-spin',
    GROUND_COIN: 'coin-ground-spin',
    SUPER_MUSHROOM: 'powerup-super-mushroom',
    ONE_UP: 'powerup-one-up',
    FIRE_FLOWER_OVERWORLD: 'powerup-fire-flower-overworld',
    FIRE_FLOWER_UNDERGROUND: 'powerup-fire-flower-underground'
  },
  FLAG: {
    POLE: 'flag-pole'
  }
});

const mapFrames = (texture, frames) =>
  frames.map((frame) =>
    typeof frame === 'number'
      ? { key: texture, frame }
      : { key: frame.texture ?? texture, frame: frame.frame }
  );

export const AnimationConfig = [
  // Mario pequeño
  {
    key: AnimationKeys.MARIO.SMALL.IDLE,
    frames: mapFrames('mario-small', [0]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.SMALL.RUN,
    frames: mapFrames('mario-small', [1, 2, 3]),
    frameRate: 12,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.SMALL.RUN_FAST,
    frames: mapFrames('mario-small', [1, 2, 3]),
    frameRate: 18,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.SMALL.JUMP,
    frames: mapFrames('mario-small', [5]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.SMALL.TURN,
    frames: mapFrames('mario-small', [4]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.SMALL.CLIMB,
    frames: mapFrames('mario-small', [1, 2]),
    frameRate: 6,
    repeat: repeatForever,
    yoyo: true
  },

  // Mario super
  {
    key: AnimationKeys.MARIO.SUPER.IDLE,
    frames: mapFrames('mario-grown', [0]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.SUPER.RUN,
    frames: mapFrames('mario-grown', [1, 2, 3]),
    frameRate: 12,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.SUPER.RUN_FAST,
    frames: mapFrames('mario-grown', [1, 2, 3]),
    frameRate: 18,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.SUPER.JUMP,
    frames: mapFrames('mario-grown', [4]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.SUPER.CROUCH,
    frames: mapFrames('mario-grown', [5]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.SUPER.TURN,
    frames: mapFrames('mario-grown', [4]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.SUPER.CLIMB,
    frames: mapFrames('mario-grown', [1, 2]),
    frameRate: 6,
    repeat: repeatForever,
    yoyo: true
  },

  // Mario fuego
  {
    key: AnimationKeys.MARIO.FIRE.IDLE,
    frames: mapFrames('mario-fire', [0]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.FIRE.RUN,
    frames: mapFrames('mario-fire', [1, 2, 3]),
    frameRate: 12,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.FIRE.RUN_FAST,
    frames: mapFrames('mario-fire', [1, 2, 3]),
    frameRate: 18,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.FIRE.JUMP,
    frames: mapFrames('mario-fire', [4]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.FIRE.CROUCH,
    frames: mapFrames('mario-fire', [5]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.FIRE.TURN,
    frames: mapFrames('mario-fire', [4]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.MARIO.FIRE.CLIMB,
    frames: mapFrames('mario-fire', [1, 2]),
    frameRate: 6,
    repeat: repeatForever,
    yoyo: true
  },
  {
    key: AnimationKeys.MARIO.FIRE.THROW,
    frames: mapFrames('mario-fire', [6, 0]),
    frameRate: 12,
    repeat: 0
  },

  // Enemigos: Goomba overworld
  {
    key: AnimationKeys.ENEMIES.GOOMBA.OVERWORLD_WALK,
    frames: mapFrames('goomba-overworld', [0, 1]),
    frameRate: 8,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.ENEMIES.GOOMBA.OVERWORLD_SQUASHED,
    frames: mapFrames('goomba-overworld', [2]),
    frameRate: 1,
    repeat: 0
  },

  // Enemigos: Goomba underground
  {
    key: AnimationKeys.ENEMIES.GOOMBA.UNDERGROUND_WALK,
    frames: mapFrames('goomba-underground', [0, 1]),
    frameRate: 8,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.ENEMIES.GOOMBA.UNDERGROUND_SQUASHED,
    frames: mapFrames('goomba-underground', [2]),
    frameRate: 1,
    repeat: 0
  },

  // Enemigos: Koopa
  {
    key: AnimationKeys.ENEMIES.KOOPA.WALK,
    frames: mapFrames('koopa', [0, 1]),
    frameRate: 8,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.ENEMIES.KOOPA.SHELL,
    frames: mapFrames('shell', [0]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.ENEMIES.KOOPA.SHELL_SPIN,
    frames: mapFrames('shell', [0, 1]),
    frameRate: 14,
    repeat: repeatForever
  },

  // Proyectiles
  {
    key: AnimationKeys.PROJECTILES.FIREBALL,
    frames: mapFrames('fireball', [0, 1, 2, 3]),
    frameRate: 18,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.PROJECTILES.FIREBALL_EXPLODE,
    frames: mapFrames('fireball-explosion', [0, 1, 2]),
    frameRate: 16,
    repeat: 0,
    hideOnComplete: true
  },

  // Coleccionables
  {
    key: AnimationKeys.COLLECTIBLES.COIN,
    frames: mapFrames('coin-spin', [0, 1, 2, 3]),
    frameRate: 12,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.COLLECTIBLES.GROUND_COIN,
    frames: mapFrames('ground-coin', [0, 1]),
    frameRate: 6,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.COLLECTIBLES.SUPER_MUSHROOM,
    frames: mapFrames('super-mushroom', [0]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.COLLECTIBLES.ONE_UP,
    frames: mapFrames('live-mushroom', [0]),
    frameRate: 1,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.COLLECTIBLES.FIRE_FLOWER_OVERWORLD,
    frames: mapFrames('fire-flower-overworld', [0, 1, 2, 3]),
    frameRate: 6,
    repeat: repeatForever
  },
  {
    key: AnimationKeys.COLLECTIBLES.FIRE_FLOWER_UNDERGROUND,
    frames: mapFrames('fire-flower-underground', [0, 1, 2, 3]),
    frameRate: 6,
    repeat: repeatForever
  }
];

export function registerAnimations(scene) {
  AnimationConfig.forEach(({ key, frames, frameRate, repeat = repeatForever, repeatDelay, yoyo, duration, hideOnComplete, showOnStart }) => {
    if (scene.anims.exists(key)) {
      return;
    }

    scene.anims.create({
      key,
      frames,
      frameRate,
      repeat,
      repeatDelay,
      yoyo,
      duration,
      showOnStart,
      hideOnComplete
    });
  });
}
