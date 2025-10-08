import Phaser from 'phaser';
import { GAME_SETTINGS } from '@config/gameSettings';
import { GameEvents } from '@config/eventKeys';
import { eventBus } from '@managers/EventBus';
import { AnimationKeys } from '@config/animationConfig';

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
		this.fireballCooldown = GAME_SETTINGS.player.fireballCooldown;
		this.lastFireballTime = 0;
		this.powerState = MarioPowerState.SMALL;
		this.isInvulnerable = false;
		this.initPhysics();
		this.play(AnimationKeys.MARIO.SMALL.IDLE);
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
		this.updateAnimation(cursors);
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
			this.scene.sound.play('sfx-jump', { volume: 0.3 });
		}
	}

	updateAnimation(cursors) {
		const isOnGround = this.body.blocked.down;
		const absVelocityX = Math.abs(this.body.velocity.x);
		const animationSet = this.getAnimationSet();

		if (!isOnGround) {
			this.safePlay(animationSet.JUMP);
			return;
		}

		if (cursors.down?.isDown && animationSet.CROUCH) {
			this.safePlay(animationSet.CROUCH);
			return;
		}

		if (absVelocityX > 10) {
			const isRunning = absVelocityX >= this.runSpeed - 10;
			const key = isRunning && animationSet.RUN_FAST ? animationSet.RUN_FAST : animationSet.RUN;
			this.safePlay(key);
			return;
		}

		this.safePlay(animationSet.IDLE);
	}

	getAnimationSet() {
		switch (this.powerState) {
			case MarioPowerState.SUPER:
				return AnimationKeys.MARIO.SUPER;
			case MarioPowerState.FIRE:
				return AnimationKeys.MARIO.FIRE;
			case MarioPowerState.SMALL:
			default:
				return AnimationKeys.MARIO.SMALL;
		}
	}

	safePlay(key) {
		if (!key) {
			return;
		}

		if (this.anims.currentAnim?.key === key) {
			return;
		}

		this.play(key, true);
	}

	grow() {
		if (this.powerState !== MarioPowerState.SMALL) {
			return;
		}

		this.powerState = MarioPowerState.SUPER;
		this.setTexture('mario-grown');
		this.body.setSize(16, 32);
		this.body.setOffset(0, 0);
		this.safePlay(AnimationKeys.MARIO.SUPER.IDLE);
		eventBus.emit(GameEvents.POWERUP_OBTAINED, this.powerState);
	}

	enableFirePower() {
		this.powerState = MarioPowerState.FIRE;
		this.setTexture('mario-fire');
		this.body.setSize(16, 32);
		this.body.setOffset(0, 0);
		this.safePlay(AnimationKeys.MARIO.FIRE.IDLE);
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
		this.safePlay(AnimationKeys.MARIO.SMALL.IDLE);
		eventBus.emit(GameEvents.POWERUP_LOST, this.powerState);
	}

	die() {
		this.setTint(0xff0000);
	}

	startInvulnerability(duration = 1000) {
		this.isInvulnerable = true;
		this.scene.time.delayedCall(duration, () => {
			this.isInvulnerable = false;
			this.clearTint();
			this.safePlay(this.getAnimationSet().IDLE);
		});
	}

	getFacingDirection() {
		return this.flipX ? -1 : 1;
	}

	canShootFireball(currentTime = 0) {
		if (this.powerState !== MarioPowerState.FIRE) {
			return false;
		}

		return currentTime - this.lastFireballTime >= this.fireballCooldown;
	}

	recordFireballShot(currentTime = 0) {
		this.lastFireballTime = currentTime;
		const animationSet = this.getAnimationSet();
		if (animationSet.THROW) {
			this.play(animationSet.THROW, true);
		}
	}

	takeDamage() {
		if (this.isInvulnerable) {
			return false;
		}

		if (this.powerState === MarioPowerState.SMALL) {
			this.die();
			return true;
		}

		this.shrink();
		return false;
	}
}
