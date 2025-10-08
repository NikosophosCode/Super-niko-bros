import Phaser from 'phaser';
import { BaseScene } from './BaseScene';
import { SceneKeys } from '@config/sceneKeys';
import { GameEvents } from '@config/eventKeys';
import { GAME_SETTINGS, GAME_RESOLUTION } from '@config/gameSettings';
import { AudioManager } from '@managers/AudioManager';
import { EntityFactory } from '@entities/EntityFactory';
import { LevelManager } from '@managers/LevelManager';
import { CollectibleType } from '@entities/Collectible';
import { DEFAULT_LEVEL_KEY } from '@config/levelConfig';

export class GameScene extends BaseScene {
	constructor() {
		super(SceneKeys.GAME);
		this.audioManager = null;
		this.player = null;
		this.blocks = null;
		this.enemies = null;
		this.collectibles = null;
		this.goalZone = null;
		this.cursors = null;
		this.factory = null;
		this.levelManager = null;
		this.levelData = null;
		this.levelCompleted = false;
		this.worldBounds = { width: GAME_RESOLUTION.width, height: GAME_RESOLUTION.height };
		this.physicsHandlers = [];
	}

	create(data = {}) {
		this.factory = new EntityFactory(this);
		this.levelManager = new LevelManager(this, this.factory);

		this.initializePhysicsGroups();

		const levelKey = data.levelKey ?? this.gameState.level ?? DEFAULT_LEVEL_KEY;
		this.startLevel(levelKey);

		this.registerEventListeners();

		this.cursors = this.input.keyboard.createCursorKeys();

		this.audioManager = new AudioManager(this);
		this.playLevelMusic();

		this.fadeIn(250);
		this.eventBus.emit(GameEvents.READY);
	}

	initializePhysicsGroups() {
		this.blocks = this.physics.add.staticGroup();
		this.enemies = this.physics.add.group();
		this.collectibles = this.physics.add.group();
	}

	startLevel(levelKey) {
		const { config, playerSpawn, goalZone, worldBounds } = this.levelManager.build(levelKey, {
			blocks: this.blocks,
			enemies: this.enemies,
			collectibles: this.collectibles
		});

		this.levelData = config;
		this.goalZone = goalZone;
		this.worldBounds = worldBounds;
		this.levelCompleted = false;

		this.gameState.level = config.key;
		if (config.timeLimit) {
			this.gameState.timeRemaining = config.timeLimit;
		}

		this.resetPlayer(playerSpawn);
		this.setupWorldBounds();
		this.setupCamera();
		this.refreshPhysicsInteractions();

		this.cameras.main.setBackgroundColor(config.backgroundColor ?? GAME_SETTINGS.backgroundColor);

		this.eventBus.emit(GameEvents.SCORE_CHANGED, this.gameState.score);
		this.eventBus.emit(GameEvents.COIN_COLLECTED, this.gameState.coins);
		this.eventBus.emit(GameEvents.LIFE_GAINED, this.gameState.lives);
	}

	resetPlayer(spawnPoint) {
		const hasLivePlayer = this.player && this.player.body;

		if (!hasLivePlayer) {
			this.player?.destroy();
			this.player = this.factory.createMario(spawnPoint.x, spawnPoint.y);
			this.player.setDepth(10);
			return;
		}

		this.player.setPosition(spawnPoint.x, spawnPoint.y);
		this.player.setVelocity(0, 0);
		this.player.body.enable = true;
		this.player.setActive(true).setVisible(true);
	}

	setupWorldBounds() {
		this.physics.world.setBounds(0, 0, this.worldBounds.width, this.worldBounds.height);
	}

	setupCamera() {
		this.cameras.main.setBounds(0, 0, this.worldBounds.width, this.worldBounds.height);
		this.cameras.main.startFollow(this.player, true, GAME_SETTINGS.camera.lerp, 0.1, -80, 0);
	}

	refreshPhysicsInteractions() {
		this.clearPhysicsHandlers();

		this.physicsHandlers.push(this.physics.add.collider(this.player, this.blocks));
		this.physicsHandlers.push(this.physics.add.collider(this.enemies, this.blocks));
		this.physicsHandlers.push(this.physics.add.collider(this.collectibles, this.blocks));
		this.physicsHandlers.push(
			this.physics.add.overlap(this.player, this.collectibles, this.handleCollectible, null, this)
		);

		if (this.goalZone) {
			this.physicsHandlers.push(
				this.physics.add.overlap(this.player, this.goalZone, this.handleLevelComplete, null, this)
			);
		}
	}

	clearPhysicsHandlers() {
		this.physicsHandlers.forEach((handler) => handler.destroy());
		this.physicsHandlers = [];
	}

	playLevelMusic() {
		const musicKey = this.levelData?.musicKey ?? 'music-overworld-theme';
		this.audioManager.playMusic(musicKey);
	}

	handleCollectible(_player, collectible) {
		if (!collectible.active) {
			return;
		}

		collectible.collect();

		switch (collectible.collectibleType) {
			case CollectibleType.COIN: {
				const previousLives = this.gameState.lives;
				const coins = this.gameState.addCoin();
				this.gameState.addScore(100);
				this.eventBus.emit(GameEvents.COIN_COLLECTED, coins);
				this.eventBus.emit(GameEvents.SCORE_CHANGED, this.gameState.score);
				this.sound.play('sfx-coin');
				if (this.gameState.lives > previousLives) {
					this.eventBus.emit(GameEvents.LIFE_GAINED, this.gameState.lives);
					this.sound.play('sfx-life');
				}
				break;
			}
			case CollectibleType.SUPER_MUSHROOM: {
				this.player.grow();
				this.gameState.addScore(1000);
				this.eventBus.emit(GameEvents.SCORE_CHANGED, this.gameState.score);
				this.sound.play('sfx-powerup');
				break;
			}
			case CollectibleType.FIRE_FLOWER: {
				this.player.enableFirePower();
				this.gameState.addScore(1000);
				this.eventBus.emit(GameEvents.SCORE_CHANGED, this.gameState.score);
				this.sound.play('sfx-powerup');
				break;
			}
			default:
				break;
		}
	}

	handleLevelComplete() {
		if (this.levelCompleted) {
			return;
		}

		this.levelCompleted = true;
		this.audioManager.playSfx('sfx-flagpole');
		this.eventBus.emit(GameEvents.LEVEL_COMPLETE, this.levelData.key);

		const nextLevel = this.levelData.nextLevel;

		if (!nextLevel) {
			this.time.delayedCall(1500, () => {
				this.audioManager.playMusic('music-win', { loop: false, volume: 0.7 });
				this.scene.stop(SceneKeys.UI);
				this.scene.start(SceneKeys.GAME_OVER, { reason: '¡HAS GANADO!' });
			});
			return;
		}

		this.time.delayedCall(1200, () => {
			this.scene.restart({ levelKey: nextLevel });
		});
	}

	update(time, delta) {
		super.update?.(time, delta);

		if (!this.player) {
			return;
		}

		this.player.update(this.cursors);
		this.enemies?.children?.each((enemy) => enemy.update?.(time, delta));

		this.checkPlayerFalls();
	}

	checkPlayerFalls() {
		if (this.levelCompleted) {
			return;
		}

		if (this.player.y > this.worldBounds.height + 64) {
			this.scene.restart({ levelKey: this.levelData?.key ?? DEFAULT_LEVEL_KEY });
		}
	}

	registerEventListeners() {
		this.eventBus.on(GameEvents.PAUSE, () => this.handlePause(), this);
		this.eventBus.on(GameEvents.RESUME, () => this.handleResume(), this);
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.onShutdown());
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
		this.clearPhysicsHandlers();
		this.levelManager?.clearLevel();
		this.audioManager?.destroy();
	}
}
