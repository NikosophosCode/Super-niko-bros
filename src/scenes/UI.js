import Phaser from 'phaser';
import { BaseScene } from './BaseScene';
import { SceneKeys } from '@config/sceneKeys';
import { GameEvents } from '@config/eventKeys';
import { GAME_SETTINGS } from '@config/gameSettings';

export class UIScene extends BaseScene {
	constructor() {
		super(SceneKeys.UI);
		this.labels = {};
	}

	create() {
		this.scene.bringToTop();
		this.setupHud();
		this.registerEvents();
	}

	setupHud() {
		const { fontFamily, fontSize, padding } = GAME_SETTINGS.hud;

		this.labels.score = this.add.text(padding.x, padding.y, 'MARIO 000000', {
			fontFamily,
			fontSize,
			color: '#ffffff'
		});

		this.labels.coins = this.add.text(padding.x + 160, padding.y, 'x00', {
			fontFamily,
			fontSize,
			color: '#ffff00'
		});

		this.labels.world = this.add.text(padding.x + 240, padding.y, 'MUNDO 1-1', {
			fontFamily,
			fontSize,
			color: '#ffffff'
		});

		this.labels.time = this.add.text(padding.x + 320, padding.y, 'TIEMPO 400', {
			fontFamily,
			fontSize,
			color: '#ffffff'
		});
	}

	registerEvents() {
		this.eventBus.on(GameEvents.SCORE_CHANGED, this.updateScore, this);
		this.eventBus.on(GameEvents.COIN_COLLECTED, this.updateCoins, this);
		this.eventBus.on(GameEvents.LIFE_LOST, this.updateLives, this);
		this.eventBus.on(GameEvents.LIFE_GAINED, this.updateLives, this);
		this.eventBus.on(GameEvents.TIMER_ALMOST_OUT, this.warnTimer, this);

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			this.eventBus.off(GameEvents.SCORE_CHANGED, this.updateScore, this);
			this.eventBus.off(GameEvents.COIN_COLLECTED, this.updateCoins, this);
			this.eventBus.off(GameEvents.LIFE_LOST, this.updateLives, this);
			this.eventBus.off(GameEvents.LIFE_GAINED, this.updateLives, this);
			this.eventBus.off(GameEvents.TIMER_ALMOST_OUT, this.warnTimer, this);
		});
	}

	updateScore(score) {
		this.labels.score?.setText(`MARIO ${score.toString().padStart(6, '0')}`);
	}

	updateCoins(coins) {
		this.labels.coins?.setText(`x${coins.toString().padStart(2, '0')}`);
	}

	updateLives(lives) {
		this.labels.world?.setText(`VIDAS ${lives}`);
	}

	warnTimer(time) {
		this.labels.time?.setText(`TIEMPO ${Math.ceil(time)}`);
		this.labels.time?.setColor('#ff5555');
	}

	update(time, delta) {
		super.update?.(time, delta);
	}
}
