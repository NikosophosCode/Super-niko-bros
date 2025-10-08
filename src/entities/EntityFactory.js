import { Mario } from './Mario';
import { Goomba } from './Goomba';
import { Koopa } from './Koopa';
import { Block } from './Block';
import { Collectible } from './Collectible';
import { GoalFlag } from './GoalFlag';
import { Fireball } from './Fireball';

export class EntityFactory {
  constructor(scene) {
    this.scene = scene;
  }

  createMario(x, y) {
    return new Mario(this.scene, x, y);
  }

  createGoomba(x, y, texture) {
    return new Goomba(this.scene, x, y, texture);
  }

  createKoopa(x, y, texture) {
    return new Koopa(this.scene, x, y, texture);
  }

  createBlock(x, y, texture, config) {
    return new Block(this.scene, x, y, texture, config);
  }

  createCollectible(x, y, texture, config) {
    return new Collectible(this.scene, x, y, texture, config);
  }

  createGoalFlag(x, y, config) {
    return new GoalFlag(this.scene, x, y, config);
  }

  createFireball(x, y) {
    return new Fireball(this.scene, x, y);
  }
}
