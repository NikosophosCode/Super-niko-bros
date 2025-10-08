import Phaser from 'phaser';

import { BootScene } from '@scenes/Boot';
import { PreloaderScene } from '@scenes/Preloader';
import { MainMenuScene } from '@scenes/MainMenu';
import { GameScene } from '@scenes/Game';
import { UIScene } from '@scenes/UI';
import { GameOverScene } from '@scenes/GameOver';
import { GAME_RESOLUTION, SCALE_CONFIG, PHYSICS_CONFIG, GAME_SETTINGS } from '@config/gameSettings';

const gameConfig = {
	type: Phaser.AUTO,
	parent: 'game-container',
	width: GAME_RESOLUTION.width,
	height: GAME_RESOLUTION.height,
	backgroundColor: GAME_SETTINGS.backgroundColor,
	pixelArt: GAME_SETTINGS.pixelArt,
	roundPixels: GAME_SETTINGS.roundPixels,
	physics: PHYSICS_CONFIG,
	scale: SCALE_CONFIG,
	scene: [BootScene, PreloaderScene, MainMenuScene, GameScene, UIScene, GameOverScene]
};

window.addEventListener('load', () => {
	// eslint-disable-next-line no-new
	new Phaser.Game(gameConfig);
});
