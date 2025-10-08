import Phaser from 'phaser';
import { GAME_SETTINGS } from '@config/gameSettings';
import { GameEvents } from '@config/eventKeys';
import { eventBus } from '@managers/EventBus';

export const MarioPowerState = Object.freeze({
	SMALL: 'small',
	SUPER: 'super',
	FIRE: 'fire'
});

export class Mario extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'mario-small');
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.scene = scene;
		this.speed = GAME_SETTINGS.player.moveSpeed;
		this.runSpeed = GAME_SETTINGS.player.runSpeed;
		this.jumpVelocity = GAME_SETTINGS.player.jumpVelocity;
		this.powerState = MarioPowerState.SMALL;
		this.isInvulnerable = false;
		this.initPhysics();
	}

	initPhysics() {
		this.setCollideWorldBounds(true);
		this.body.setMaxVelocity(this.runSpeed, 400);
		this.body.setSize(14, 16);
		this.body.setOffset(1, 0);
		this.setDragX(600);
	}

	update(cursors) {
		if (!cursors) {
			return;
		}

		this.handleMovement(cursors);
	}

	handleMovement({ left, right, up, shift }) {
		const isOnGround = this.body.blocked.down;
		const velocityX = shift?.isDown ? this.runSpeed : this.speed;

		if (left.isDown) {
			this.setVelocityX(-velocityX);
			this.setFlipX(true);
		} else if (right.isDown) {
			this.setVelocityX(velocityX);
			this.setFlipX(false);
		} else if (isOnGround) {
			this.setVelocityX(0);
		}

		if (isOnGround && Phaser.Input.Keyboard.JustDown(up)) {
			this.setVelocityY(this.jumpVelocity);
			this.scene.sound.play('sfx-jump');
		}
	}

	grow() {
		if (this.powerState !== MarioPowerState.SMALL) {
			return;
		}

		this.powerState = MarioPowerState.SUPER;
		this.setTexture('mario-grown');
		this.body.setSize(16, 32);
		this.body.setOffset(0, 0);
		eventBus.emit(GameEvents.POWERUP_OBTAINED, this.powerState);
	}

	enableFirePower() {
		this.powerState = MarioPowerState.FIRE;
		this.setTexture('mario-fire');
		eventBus.emit(GameEvents.POWERUP_OBTAINED, this.powerState);
	}

	shrink() {
		if (this.powerState === MarioPowerState.SMALL) {
			this.die();
			return;
		}

		this.powerState = MarioPowerState.SMALL;
		this.setTexture('mario-small');
		this.body.setSize(14, 16);
		this.body.setOffset(1, 0);
		this.startInvulnerability();
		eventBus.emit(GameEvents.POWERUP_LOST, this.powerState);
	}

	die() {
		this.setTint(0xff0000);
		eventBus.emit(GameEvents.LIFE_LOST);
	}

	startInvulnerability(duration = 1000) {
		this.isInvulnerable = true;
		this.scene.time.delayedCall(duration, () => {
			this.isInvulnerable = false;
			this.clearTint();
		});
	}
}
