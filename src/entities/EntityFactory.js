import { Mario } from './Mario';
import { Goomba } from './Goomba';
import { Koopa } from './Koopa';
import { Block } from './Block';

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
}
