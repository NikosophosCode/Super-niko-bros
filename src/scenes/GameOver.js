import { BaseScene } from './BaseScene';
import { SceneKeys } from '@config/sceneKeys';
import { GameEvents } from '@config/eventKeys';

export class GameOverScene extends BaseScene {
	constructor() {
		super(SceneKeys.GAME_OVER);
	}

	create({ reason = 'GAME OVER' } = {}) {
		const { width, height } = this.scale;

		this.add
			.bitmapText(width / 2, height / 2 - 40, 'carrier-command', reason, 16)
			.setOrigin(0.5);

		this.add
			.text(width / 2, height / 2 + 10, 'ENTER para reintentar', {
				fontFamily: 'Press Start 2P, SuperMario, monospace',
				fontSize: 12,
				color: '#ffffff'
			})
			.setOrigin(0.5);

		this.input.keyboard.once('keydown-ENTER', () => {
				this.gameState.reset();
			this.scene.stop(SceneKeys.UI);
			this.scene.stop(SceneKeys.GAME);
			this.scene.start(SceneKeys.GAME);
			this.scene.launch(SceneKeys.UI);
		});

		this.input.keyboard.once('keydown-ESC', () => {
				this.gameState.reset();
			this.scene.stop(SceneKeys.GAME);
			this.scene.stop(SceneKeys.UI);
			this.scene.start(SceneKeys.MAIN_MENU);
			this.eventBus.emit(GameEvents.READY);
		});
	}
}
