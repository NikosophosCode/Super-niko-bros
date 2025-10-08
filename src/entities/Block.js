import Phaser from 'phaser';

export const BlockType = Object.freeze({
	SOLID: 'solid',
	BREAKABLE: 'breakable',
	QUESTION: 'question',
	HIDDEN: 'hidden',
	BOUNCY: 'bouncy'
});

export class Block extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, { type = BlockType.SOLID, payload = null } = {}) {
		super(scene, x, y, texture);
		scene.add.existing(this);
		scene.physics.add.existing(this, true);

		this.type = type;
		this.payload = payload;
		this.isActivated = false;
	}

	activate({ onSpawnPayload } = {}) {
		if (this.isActivated) {
			return;
		}

		this.isActivated = true;

		if (this.type === BlockType.BREAKABLE) {
			this.breakBlock();
			return;
		}

		if (this.payload && onSpawnPayload) {
			onSpawnPayload(this.payload, this.x, this.y - this.height);
		}

		if (this.type === BlockType.QUESTION) {
			this.setTexture('empty-block-overworld');
		}

		this.scene.sound.play('sfx-block-bump');
	}

	breakBlock() {
		this.disableBody(true, true);
		this.scene.sound.play('sfx-break-block');
	}
}
