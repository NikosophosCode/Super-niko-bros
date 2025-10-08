import Phaser from 'phaser';

export const CollectibleType = Object.freeze({
  COIN: 'coin',
  SUPER_MUSHROOM: 'super-mushroom',
  FIRE_FLOWER: 'fire-flower'
});

export class Collectible extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene,
    x,
    y,
    texture,
    { type = CollectibleType.COIN, animationKey, velocityX = 0, allowGravity } = {}
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;
    this.collectibleType = type;

    this.setOrigin(0.5, 1);
    this.setDepth(5);

    if (animationKey) {
      this.play(animationKey, true);
    }

    const shouldUseGravity = allowGravity ?? type !== CollectibleType.COIN;

    this.body.setAllowGravity(shouldUseGravity);
    this.body.setSize(14, 14);
    this.body.setOffset(1, 2);

    if (shouldUseGravity) {
      this.body.setBounce(0.2, 0.1);
      if (velocityX !== 0) {
        this.setVelocityX(velocityX);
      }
    }
  }

  collect() {
    this.disableBody(true, true);
  }
}
