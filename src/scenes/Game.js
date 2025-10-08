import Phaser from 'phaser';
import { BaseScene } from './BaseScene';
import { SceneKeys } from '@config/sceneKeys';
import { GameEvents } from '@config/eventKeys';
import { GAME_SETTINGS, GAME_RESOLUTION } from '@config/gameSettings';
import { AudioManager } from '@managers/AudioManager';
import { EntityFactory } from '@entities/EntityFactory';

export class GameScene extends BaseScene {
	constructor() {
		super(SceneKeys.GAME);
		this.audioManager = null;
		this.player = null;
		this.enemies = null;
		this.blocks = null;
		this.collectibles = null;
		this.hazardLayer = null;
		this.uiSceneKey = SceneKeys.UI;
			this.cursors = null;
		this.factory = null;
			this.worldWidth = GAME_RESOLUTION.width;
	}

	create() {
		this.factory = new EntityFactory(this);
		this.setupWorld();
		this.setupCamera();
		this.registerColliders();
		this.registerEventListeners();
			this.cursors = this.input.keyboard.createCursorKeys();

		this.audioManager = new AudioManager(this);
		this.audioManager.playMusic('music-overworld-theme');

		this.fadeIn(250);
		this.eventBus.emit(GameEvents.READY);
	}

	setupWorld() {
			const worldWidth = GAME_RESOLUTION.width * 16;
			this.worldWidth = worldWidth;
			this.physics.world.setBounds(0, 0, worldWidth, this.scale.height);

			this.blocks = this.physics.add.staticGroup();
		this.enemies = this.physics.add.group();
		this.collectibles = this.physics.add.group();

			const tileWidth = 16;
			const tilesNeeded = Math.ceil(worldWidth / tileWidth);
			for (let i = 0; i < tilesNeeded; i += 1) {
				const tile = this.blocks.create(i * tileWidth, this.scale.height - tileWidth, 'overworld-floor');
				tile.setOrigin(0, 0);
				tile.refreshBody();
			}

		this.spawnPlayer();
	}

	setupCamera() {
			this.cameras.main.setBounds(0, 0, this.worldWidth, this.scale.height);
		this.cameras.main.setBackgroundColor(GAME_SETTINGS.backgroundColor);
		this.cameras.main.startFollow(this.player, true, GAME_SETTINGS.camera.lerp, 0.1, -80, 0);
	}

	registerColliders() {
		this.physics.add.collider(this.player, this.blocks);
		this.physics.add.collider(this.enemies, this.blocks);
		this.physics.add.collider(this.collectibles, this.blocks);
	}

	registerEventListeners() {
		this.eventBus.on(GameEvents.PAUSE, () => this.handlePause(), this);
		this.eventBus.on(GameEvents.RESUME, () => this.handleResume(), this);
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.onShutdown());
	}

	spawnPlayer() {
		this.player = this.factory.createMario(32, this.scale.height - 64);
		this.player.setDepth(10);
	}

	update(time, delta) {
		super.update?.(time, delta);
			this.player?.update(this.cursors);
	}

	handlePause() {
		this.scene.pause();
	}

	handleResume() {
		this.scene.resume();
	}

	onShutdown() {
		this.eventBus.off(GameEvents.PAUSE, this.handlePause, this);
		this.eventBus.off(GameEvents.RESUME, this.handleResume, this);
		this.audioManager?.destroy();
	}
}
