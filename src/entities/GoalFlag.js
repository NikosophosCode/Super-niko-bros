import Phaser from 'phaser';

export class GoalFlag extends Phaser.GameObjects.Zone {
  constructor(scene, baseX, baseY, { width = 16, height = 96, flagTexture = 'flag', mastTexture = 'flag-mast' } = {}) {
    super(scene, baseX, baseY - height / 2, width, height);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;

    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
  this.body.setSize(width, height);
    this.body.setOffset(-width / 2, -height / 2);

    this.mast = scene.add.image(baseX, baseY, mastTexture).setOrigin(0.5, 1);
    this.flag = scene.add.image(baseX - width / 2, baseY - height / 3, flagTexture).setOrigin(0.5, 1);

    this.setDepth(2);
    this.mast.setDepth(1);
    this.flag.setDepth(3);
  }

  destroy(fromScene) {
    this.mast.destroy(fromScene);
    this.flag.destroy(fromScene);
    super.destroy(fromScene);
  }
}
