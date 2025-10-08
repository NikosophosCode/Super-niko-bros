import Phaser from 'phaser';
import { BaseScene } from './BaseScene';
import { SceneKeys } from '@config/sceneKeys';
import { GameEvents } from '@config/eventKeys';
import { GAME_SETTINGS, GAME_RESOLUTION } from '@config/gameSettings';
import { AudioManager } from '@managers/AudioManager';
import { EntityFactory } from '@entities/EntityFactory';
import { LevelManager } from '@managers/LevelManager';
import { CollectibleType } from '@entities/Collectible';
import { BlockType } from '@entities/Block';
import { MarioPowerState } from '@entities/Mario';
import { Goomba } from '@entities/Goomba';
import { Koopa } from '@entities/Koopa';
import { DEFAULT_LEVEL_KEY } from '@config/levelConfig';

const ENEMY_SCORE_VALUES = Object.freeze({
	goomba: 100,
	koopa: 200,
	shellCombo: 400,
	fireball: 200
});

const BLOCK_COIN_SCORE = 200;

export class GameScene extends BaseScene {
	constructor() {
		super(SceneKeys.GAME);
		this.audioManager = null;
		this.player = null;
		this.blocks = null;
		this.enemies = null;
		this.collectibles = null;
		this.fireballs = null;
		this.goalZone = null;
		this.cursors = null;
		this.fireKey = null;
		this.fireKeyAlt = null;
		this.factory = null;
		this.levelManager = null;
		this.levelData = null;
		this.levelCompleted = false;
		this.playerDying = false;
		this.timerAccumulator = 0;
		this.lowTimeTriggered = false;
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
		this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
		this.fireKeyAlt = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

		this.audioManager = new AudioManager(this);
		this.playLevelMusic();

		this.fadeIn(250);
		this.eventBus.emit(GameEvents.READY);
	}

	initializePhysicsGroups() {
		this.blocks = this.physics.add.staticGroup();
		this.enemies = this.physics.add.group();
		this.collectibles = this.physics.add.group();
		this.fireballs = this.physics.add.group({ runChildUpdate: true, maxSize: 4 });
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
		this.playerDying = false;
		this.fireballs?.clear(true, true);
		this.timerAccumulator = 0;
		this.lowTimeTriggered = false;

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
		this.eventBus.emit(GameEvents.TIMER_CHANGED, this.gameState.timeRemaining);
	}

	resetPlayer(spawnPoint) {
		const hasLivePlayer = this.player && this.player.body;

		if (!hasLivePlayer) {
			this.player?.destroy();
			this.player = this.factory.createMario(spawnPoint.x, spawnPoint.y);
			this.player.setDepth(10);
		} else {
			this.player.setPosition(spawnPoint.x, spawnPoint.y);
			this.player.setVelocity(0, 0);
			this.player.body.enable = true;
			this.player.setActive(true).setVisible(true);
		}

		this.player.lastFireballTime = 0;
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

		this.physicsHandlers.push(
			this.physics.add.collider(this.player, this.blocks, this.handleBlockCollision, null, this)
		);
		this.physicsHandlers.push(this.physics.add.collider(this.enemies, this.blocks));
		this.physicsHandlers.push(this.physics.add.collider(this.collectibles, this.blocks));
		this.physicsHandlers.push(
			this.physics.add.overlap(this.player, this.collectibles, this.handleCollectible, null, this)
		);
		this.physicsHandlers.push(
			this.physics.add.collider(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this)
		);
		this.physicsHandlers.push(
			this.physics.add.collider(this.enemies, this.enemies, this.handleEnemyVsEnemy, null, this)
		);
		this.physicsHandlers.push(
			this.physics.add.collider(
				this.fireballs,
				this.blocks,
				this.handleFireballBlockCollision,
				null,
				this
			)
		);
		this.physicsHandlers.push(
			this.physics.add.overlap(
				this.fireballs,
				this.enemies,
				this.handleFireballEnemyCollision,
				null,
				this
			)
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
		const hurryKey = this.levelData?.hurryMusicKey ?? null;
		this.audioManager.playMusic(musicKey, { hurryKey });
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

	handleBlockCollision(player, block) {
		if (!player?.body || !block?.body) {
			return;
		}

		const hittingFromBelow =
			(player.body.blocked.up || player.body.touching.up) && player.body.velocity.y <= 0;

		if (!hittingFromBelow) {
			return;
		}

		const allowBreak = player.powerState !== MarioPowerState.SMALL;

		block.activate({
			allowBreak,
			onSpawnPayload: (payload, spawnX, spawnY, targetBlock) =>
				this.spawnBlockPayload(payload, spawnX, spawnY, targetBlock)
		});

		if (block.type === BlockType.BREAKABLE && allowBreak) {
			this.awardScore(50);
		}
	}

	spawnBlockPayload(payload = {}, x, y, block) {
		if (!payload?.type) {
			return;
		}

		const spawnX = x + (payload.offsetX ?? 0);
		const spawnY = (block?.y ?? y) - (block?.height ?? 16) / 2;

		switch (payload.type) {
			case CollectibleType.COIN: {
				const previousLives = this.gameState.lives;
				const coins = this.gameState.addCoin(payload.amount ?? 1);
				this.awardScore(payload.score ?? BLOCK_COIN_SCORE);
				this.eventBus.emit(GameEvents.COIN_COLLECTED, coins);
				this.sound.play('sfx-coin');

				if (this.gameState.lives > previousLives) {
					this.eventBus.emit(GameEvents.LIFE_GAINED, this.gameState.lives);
					this.sound.play('sfx-life');
				}
				break;
			}
			case CollectibleType.SUPER_MUSHROOM:
			case CollectibleType.FIRE_FLOWER: {
				const isFireFlower = payload.type === CollectibleType.FIRE_FLOWER;
				const defaultTexture = isFireFlower
					? this.levelData.theme === 'underground'
						? 'fire-flower-underground'
						: 'fire-flower-overworld'
					: 'super-mushroom';
				const texture = payload.texture ?? defaultTexture;
				const collectible = this.factory.createCollectible(spawnX, spawnY, texture, {
					type: payload.type,
					animationKey: payload.animationKey,
					allowGravity: payload.allowGravity ?? !isFireFlower,
					velocityX: payload.velocityX ?? (isFireFlower ? 0 : 30)
				});
				collectible.setDepth(6);
				collectible.body.setAllowGravity(false);
				this.collectibles.add(collectible);
				this.tweens.add({
					targets: collectible,
					y: collectible.y - 16,
					duration: 200,
					ease: 'Sine.easeOut',
					onComplete: () => {
						collectible.body.setAllowGravity(payload.allowGravity ?? !isFireFlower);
						if (!isFireFlower) {
							collectible.setVelocityX(payload.velocityX ?? 30);
						}
					}
				});
				this.audioManager.playSfx('sfx-powerup-appear');
				break;
			}
			default:
				break;
		}
	}

	handlePlayerEnemyCollision(player, enemy) {
		if (!enemy?.body || this.playerDying) {
			return;
		}

		const playerBody = player.body;
		const enemyBody = enemy.body;
		const enemyTop = enemyBody?.top ?? enemy.y;
		const playerBottom = playerBody?.bottom ?? player.y;
		const isStomp =
			playerBody.velocity.y > 0 && playerBottom <= enemyTop + 8 && playerBody.bottom > enemyTop;

		if (isStomp) {
			this.bouncePlayer();
			this.sound.play('sfx-goomba-stomp');

			if (enemy instanceof Goomba) {
				enemy.stomp();
				this.awardScore(ENEMY_SCORE_VALUES.goomba);
				this.eventBus.emit(GameEvents.ENEMY_DEFEATED, {
					type: 'goomba',
					method: 'stomp'
				});
				return;
			}

			if (enemy instanceof Koopa) {
				const enteredShell = enemy.stomp();
				if (enteredShell) {
					this.awardScore(ENEMY_SCORE_VALUES.koopa);
				} else {
					this.awardScore(ENEMY_SCORE_VALUES.shellCombo);
				}
				return;
			}
		}

		if (enemy instanceof Koopa && enemy.isShell() && !enemy.isSpinning()) {
			const direction = player.x < enemy.x ? -1 : 1;
			enemy.kick(direction);
			this.audioManager.playSfx('sfx-kick');
			this.awardScore(ENEMY_SCORE_VALUES.shellCombo);
			return;
		}

		if (enemy instanceof Koopa && enemy.isSpinning()) {
			this.handlePlayerDamage();
			return;
		}

		this.handlePlayerDamage();
	}

	handleEnemyVsEnemy(enemyA, enemyB) {
		const spinningKoopa =
			enemyA instanceof Koopa && enemyA.isSpinning()
				? enemyA
				: enemyB instanceof Koopa && enemyB.isSpinning()
					? enemyB
					: null;

		if (!spinningKoopa) {
			return;
		}

		const target = spinningKoopa === enemyA ? enemyB : enemyA;

		if (target instanceof Goomba) {
			target.defeat();
		} else if (target instanceof Koopa) {
			target.defeat();
		} else {
			target.disableBody(true, true);
		}

		this.awardScore(ENEMY_SCORE_VALUES.shellCombo);
		this.audioManager.playSfx('sfx-kick');
		this.eventBus.emit(GameEvents.ENEMY_DEFEATED, {
			type: target.texture?.key ?? 'enemy',
			method: 'shell'
		});
	}

	handleFireballBlockCollision(fireball) {
		fireball?.explode?.();
	}

	handleFireballEnemyCollision(fireball, enemy) {
		if (!fireball?.active || !enemy?.active) {
			return;
		}

		fireball.explode();
		if (enemy instanceof Goomba || enemy instanceof Koopa) {
			enemy.defeat();
		} else {
			enemy.disableBody(true, true);
		}

		this.awardScore(ENEMY_SCORE_VALUES.fireball);
		this.eventBus.emit(GameEvents.ENEMY_DEFEATED, {
			type: enemy.texture?.key ?? 'enemy',
			method: 'fireball'
		});
	}

	handleFireballInput(time) {
		if (this.player.powerState !== MarioPowerState.FIRE) {
			return;
		}

		const fired =
			Phaser.Input.Keyboard.JustDown(this.fireKey) ||
			Phaser.Input.Keyboard.JustDown(this.fireKeyAlt);

		if (!fired || !this.player.canShootFireball(time)) {
			return;
		}

		let fireball = this.fireballs
			.getChildren()
			.find((child) => !child.active);

		if (!fireball) {
			if (this.fireballs.getLength() >= 4) {
				return;
			}
			fireball = this.factory.createFireball(this.player.x, this.player.y);
			this.fireballs.add(fireball);
		}

		const direction = this.player.getFacingDirection();
		const spawnX = this.player.x + direction * 10;
		const spawnY = this.player.y;

		fireball.launch(spawnX, spawnY, direction);
		this.player.recordFireballShot(time);
		this.audioManager.playSfx('sfx-fireball');
		this.eventBus.emit(GameEvents.FIREBALL_THROWN, { x: spawnX, y: spawnY, direction });
	}

	cleanupFireballs() {
		const cameraView = this.cameras.main.worldView;
		this.fireballs?.children?.each((fireball) => {
			if (!fireball.active) {
				return;
			}

			const outOfBounds =
				fireball.y > this.worldBounds.height + 32 ||
				fireball.y < -32 ||
				fireball.x < cameraView.x - 32 ||
				fireball.x > cameraView.x + cameraView.width + 32;

			if (outOfBounds) {
				fireball.explode();
			}
		});
	}

	updateTimer(delta) {
		if (!this.levelData?.timeLimit || this.levelCompleted || this.playerDying) {
			return;
		}

		this.timerAccumulator += delta;

		if (this.timerAccumulator < 1000) {
			return;
		}

		const secondsElapsed = Math.floor(this.timerAccumulator / 1000);
		this.timerAccumulator -= secondsElapsed * 1000;

		if (secondsElapsed <= 0) {
			return;
		}

		const previousTime = this.gameState.timeRemaining;
		const newTime = this.gameState.updateTime(secondsElapsed);

		if (newTime !== previousTime) {
			this.eventBus.emit(GameEvents.TIMER_CHANGED, newTime);
		}

		if (!this.lowTimeTriggered && newTime <= 100) {
			this.lowTimeTriggered = true;
			this.eventBus.emit(GameEvents.TIMER_ALMOST_OUT, newTime);
			this.audioManager?.enterHurryMode?.();
			this.audioManager?.playSfx('sfx-time-warning');
		}

		if (newTime <= 0) {
			this.onPlayerDeath('time');
		}
	}

	bouncePlayer(force = 240) {
		this.player.setVelocityY(-force);
	}

	awardScore(amount = 0) {
		if (!amount) {
			return;
		}

		this.gameState.addScore(amount);
		this.eventBus.emit(GameEvents.SCORE_CHANGED, this.gameState.score);
	}

	handlePlayerDamage() {
		if (this.playerDying) {
			return;
		}

		const died = this.player.takeDamage();

		if (died) {
			this.onPlayerDeath('enemy');
			return;
		}

		this.audioManager.playSfx('sfx-powerdown');
	}

	onPlayerDeath(reason = 'enemy') {
		if (this.playerDying || this.levelCompleted) {
			return;
		}

		this.playerDying = true;
		this.player.body.setVelocity(0, -260);
		this.player.body.checkCollision.none = true;
		this.player.anims.stop();
		this.audioManager.fadeOutMusic();
		this.audioManager.playSfx('sfx-powerdown');

		const remainingLives = this.gameState.loseLife();
		this.eventBus.emit(GameEvents.LIFE_LOST, remainingLives);

		const delay = 1200;

		if (remainingLives <= 0) {
			this.eventBus.emit(GameEvents.GAME_OVER, reason);
			this.time.delayedCall(delay, () => {
				this.scene.stop(SceneKeys.UI);
				this.scene.start(SceneKeys.GAME_OVER, { reason: 'GAME OVER' });
			});
			return;
		}

		this.time.delayedCall(delay, () => {
			this.scene.restart({ levelKey: this.levelData?.key ?? DEFAULT_LEVEL_KEY });
		});
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

		if (!this.playerDying) {
			this.player.update(this.cursors);
			this.handleFireballInput(time);
		}

		this.enemies?.children?.each((enemy) => {
			if (enemy.active) {
				enemy.update?.(time, delta);
			}
		});
		this.cleanupFireballs();
		this.updateTimer(delta);

		this.checkPlayerFalls();
	}

	checkPlayerFalls() {
		if (this.levelCompleted) {
			return;
		}

		if (this.player.y > this.worldBounds.height + 64) {
			this.onPlayerDeath('void');
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
