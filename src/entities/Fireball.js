import Phaser from 'phaser';
import { AnimationKeys } from '@config/animationConfig';

const FIREBALL_SPEED = 220;
const FIREBALL_BOUNCE_VELOCITY = -140;
const FIREBALL_LIFETIME = 3000;

export class Fireball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'fireball');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.speed = FIREBALL_SPEED;
    this.body.setSize(8, 8);
    this.body.setOffset(0, 0);
    this.body.setAllowGravity(true);
    this.body.setBounce(1, 0.6);
    this.setDepth(8);
    this.setActive(false);
    this.setVisible(false);
    this.play(AnimationKeys.PROJECTILES.FIREBALL);

    this.lifeTimer = null;
  }

  launch(x, y, direction = 1) {
    this.enableBody(true, x, y, true, true);
    this.setVelocity(direction * this.speed, FIREBALL_BOUNCE_VELOCITY);
    this.setFlipX(direction < 0);
    this.setActive(true);
    this.setVisible(true);

    this.lifeTimer?.remove(false);
    this.lifeTimer = this.scene.time.delayedCall(FIREBALL_LIFETIME, () => this.explode());
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.active) {
      return;
    }

    if (this.body.blocked.down) {
      this.setVelocityY(FIREBALL_BOUNCE_VELOCITY);
    }

    if (this.body.blocked.left || this.body.blocked.right) {
      this.explode();
    }
  }

  explode() {
    if (!this.active) {
      return;
    }

    this.setVelocity(0, 0);
    this.play(AnimationKeys.PROJECTILES.FIREBALL_EXPLODE, true);
    this.lifeTimer?.remove(false);

    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.disableBody(true, true);
      this.setActive(false);
      this.setVisible(false);
    });
  }
}
