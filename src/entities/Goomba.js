import Phaser from 'phaser';

export class Goomba extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture = 'goomba-overworld') {
		super(scene, x, y, texture);
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.scene = scene;
		this.speed = 30;
		this.alive = true;
		this.setCollideWorldBounds(true);
		this.body.setSize(14, 14);
		this.body.setOffset(1, 2);
		this.setVelocityX(-this.speed);
		this.setBounceX(1);
	}

	update() {
		if (!this.alive) {
			return;
		}

		if (this.body.blocked.right) {
			this.setVelocityX(-this.speed);
			this.setFlipX(true);
		} else if (this.body.blocked.left) {
			this.setVelocityX(this.speed);
			this.setFlipX(false);
		}
	}

	stomp() {
		this.alive = false;
		this.setVelocity(0, 0);
		this.play({ key: 'goomba-squashed', repeat: 0, hideOnComplete: true });
	}
}
