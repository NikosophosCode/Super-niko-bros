import Phaser from 'phaser';
import { AnimationKeys } from '@config/animationConfig';

export const KoopaState = Object.freeze({
	WALKING: 'walking',
	SHELL: 'shell',
	SHELL_SPIN: 'shell-spin'
});

export class Koopa extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture = 'koopa') {
		super(scene, x, y, texture);
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.scene = scene;
		this.speed = 40;
		this.state = KoopaState.WALKING;
		this.direction = -1;
		this.alive = true;

		this.initPhysics();
		this.play(AnimationKeys.ENEMIES.KOOPA.WALK);
	}

	initPhysics() {
		this.setCollideWorldBounds(true);
		this.body.setSize(14, 24);
		this.body.setOffset(1, 8);
		this.setVelocityX(this.speed * this.direction);
	}

	update() {
		if (!this.alive) {
			return;
		}

		if (this.state === KoopaState.WALKING) {
			this.updateWalking();
		} else if (this.state === KoopaState.SHELL_SPIN) {
			this.setVelocityX(180 * this.direction);
			if (this.body.blocked.left || this.body.blocked.right) {
				this.direction *= -1;
				this.setVelocityX(180 * this.direction);
				this.setFlipX(this.direction > 0);
			}
		}
	}

	updateWalking() {
		if (this.body.blocked.left || this.body.blocked.right) {
			this.direction *= -1;
			this.setVelocityX(this.speed * this.direction);
			this.setFlipX(this.direction > 0);
		}
	}

	enterShell() {
		this.state = KoopaState.SHELL;
		this.setTexture('shell');
		this.body.setSize(14, 16);
		this.body.setOffset(1, 8);
		this.setVelocityX(0);
		this.play(AnimationKeys.ENEMIES.KOOPA.SHELL, true);
	}

	kick(direction = 1) {
		this.state = KoopaState.SHELL_SPIN;
		this.direction = direction;
		this.setVelocityX(180 * direction);
		this.play(AnimationKeys.ENEMIES.KOOPA.SHELL_SPIN, true);
	}

	stopShell() {
		this.state = KoopaState.SHELL;
		this.setVelocityX(0);
		this.play(AnimationKeys.ENEMIES.KOOPA.SHELL, true);
	}

	stomp() {
		if (this.state === KoopaState.WALKING) {
			this.enterShell();
			return true;
		}

		if (this.state === KoopaState.SHELL_SPIN) {
			this.stopShell();
			return false;
		}

		return false;
	}

	isShell() {
		return this.state === KoopaState.SHELL;
	}

	isSpinning() {
		return this.state === KoopaState.SHELL_SPIN;
	}

	isDangerous() {
		return this.state === KoopaState.WALKING || this.state === KoopaState.SHELL_SPIN;
	}

	defeat() {
		if (!this.alive) {
			return;
		}

		this.alive = false;
		this.disableBody(true, true);
	}
}
