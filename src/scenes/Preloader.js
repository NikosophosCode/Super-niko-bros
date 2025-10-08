import { BaseScene } from './BaseScene';
import { SceneKeys } from '@config/sceneKeys';
import { AssetLoader } from '@managers/AssetLoader';
import { registerAnimations } from '@config/animationConfig';

export class PreloaderScene extends BaseScene {
	constructor() {
		super(SceneKeys.PRELOADER);
		this.assetLoader = new AssetLoader(this);
	}

	preload() {
		const { width, height } = this.scale;
		const progressBarWidth = width * 0.6;
		const progressBarHeight = 18;

		const progressBox = this.add.rectangle(
			width / 2,
			height / 2 + 20,
			progressBarWidth,
			progressBarHeight,
			0x000000,
			0.4
		);

		const progressBar = this.add.rectangle(
			progressBox.x - progressBox.width / 2,
			progressBox.y,
			4,
			progressBarHeight - 4,
			0xffffff
		);
		progressBar.setOrigin(0, 0.5);

		const loadingText = this.add
			.text(width / 2, height / 2 - 20, 'Cargando...', {
				fontFamily: 'Press Start 2P, SuperMario, monospace',
				fontSize: 12,
				color: '#ffffff'
			})
			.setOrigin(0.5);

		this.load.on('progress', (value) => {
			progressBar.width = (progressBarWidth - 8) * value;
		});

		this.load.on('fileprogress', (_file, cacheKey) => {
			loadingText.setText(`Cargando: ${cacheKey}`);
		});

		this.load.on('complete', () => {
			progressBox.destroy();
			progressBar.destroy();
			loadingText.destroy();
		});

		this.assetLoader.preload();
	}

	create() {
		registerAnimations(this);
		this.scene.start(SceneKeys.MAIN_MENU);
	}
}
