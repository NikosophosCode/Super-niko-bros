import { BaseScene } from './BaseScene';
import { SceneKeys } from '@config/sceneKeys';
import { GameEvents } from '@config/eventKeys';
import { gameState } from '@state/GameState';

export class MainMenuScene extends BaseScene {
	constructor() {
		super(SceneKeys.MAIN_MENU);
	}

	create() {
		const { width, height } = this.scale;

		this.add
			.bitmapText(width / 2, height / 2 - 60, 'carrier-command', 'SUPER NIKO BROS', 16)
			.setOrigin(0.5);

		this.add
			.text(width / 2, height / 2 + 10, 'Pulsa ENTER para jugar', {
				fontFamily: 'Press Start 2P, SuperMario, monospace',
				fontSize: 12,
				color: '#ffffff'
			})
			.setOrigin(0.5);

		this.input.keyboard.once('keydown-ENTER', () => {
			gameState.reset();
			this.eventBus.emit(GameEvents.START);
			this.scene.start(SceneKeys.GAME);
			this.scene.launch(SceneKeys.UI);
		});
	}
}
