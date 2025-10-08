import Phaser from 'phaser';

export const BlockType = Object.freeze({
	SOLID: 'solid',
	BREAKABLE: 'breakable',
	QUESTION: 'question',
	HIDDEN: 'hidden',
	BOUNCY: 'bouncy'
});

export class Block extends Phaser.Physics.Arcade.Sprite {
	constructor(
		scene,
		x,
		y,
		texture,
		{ type = BlockType.SOLID, payload = null, depletedTexture = null, bounceOffset = 6 } = {}
	) {
		// Determinar si la textura es una clave de animación
		const isAnimation = scene.anims.exists(texture);
		const baseTexture = isAnimation ? texture.replace('-idle', '') : texture;
		
		super(scene, x, y, baseTexture, 0);
		scene.add.existing(this);
		scene.physics.add.existing(this, true);

		this.type = type;
		this.payload = payload;
		this.depletedTexture = depletedTexture;
		this.bounceOffset = bounceOffset;
		this.isActivated = false;
		this.isBumping = false;
		this.setOrigin(0.0, 0);
		this.refreshBody();

		// Reproducir animación si es un bloque de pregunta con animación
		if (this.type === BlockType.QUESTION && isAnimation) {
			this.play(texture);
		}
	}

	bump() {
		if (this.isBumping) {
			return;
		}

		this.isBumping = true;
		const originalY = this.y;

		this.scene.tweens.add({
			targets: this,
			y: originalY - this.bounceOffset,
			duration: 90,
			yoyo: true,
			ease: 'Quad.easeOut',
			onUpdate: () => {
				this.body?.updateFromGameObject?.();
			},
			onComplete: () => {
				this.y = originalY;
				this.body?.updateFromGameObject?.();
				this.isBumping = false;
			}
		});
	}

	activate({ onSpawnPayload, allowBreak = false } = {}) {
		if (this.type === BlockType.BREAKABLE) {
			this.bump();
			if (allowBreak && !this.isActivated) {
				this.breakBlock();
				return;
			}
			this.scene.sound.play('sfx-block-bump');
			return;
		}

		if (this.isActivated) {
			this.bump();
			this.scene.sound.play('sfx-block-bump');
			return;
		}

		this.isActivated = true;
		this.bump();

		if (this.payload && onSpawnPayload) {
			onSpawnPayload(this.payload, this.x, this.y - this.height / 2, this);
			this.payload = null;
		}

		if (this.type === BlockType.QUESTION && this.depletedTexture) {
			// Detener la animación antes de cambiar la textura
			if (this.anims && this.anims.isPlaying) {
				this.stop();
			}
			this.setTexture(this.depletedTexture);
		}

		this.scene.sound.play('sfx-block-bump');
	}

	breakBlock() {
		if (this.isActivated) {
			return;
		}

		this.isActivated = true;
		this.disableBody(true, true);
		this.scene.sound.play('sfx-break-block');
	}
}
