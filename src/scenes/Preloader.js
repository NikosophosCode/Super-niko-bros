import { BaseScene } from './BaseScene';
import { SceneKeys } from '@config/sceneKeys';
import { AssetLoader } from '@managers/AssetLoader';
import { registerAnimations } from '@config/animationConfig';

export class PreloaderScene extends BaseScene {
	constructor() {
		super(SceneKeys.PRELOADER);
		this.assetLoader = new AssetLoader(this);
		this.audioLoaded = false;
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

		const percentText = this.add
			.text(width / 2, height / 2 + 50, '0%', {
				fontFamily: 'Press Start 2P, SuperMario, monospace',
				fontSize: 10,
				color: '#ffffff'
			})
			.setOrigin(0.5);

		this.load.on('progress', (value) => {
			progressBar.width = (progressBarWidth - 8) * value;
			percentText.setText(`${Math.floor(value * 100)}%`);
		});

		this.load.on('fileprogress', (file) => {
			const fileName = file.key.length > 20 ? file.key.substring(0, 20) + '...' : file.key;
			loadingText.setText(`Cargando: ${fileName}`);
		});

		this.load.on('complete', () => {
			progressBox.destroy();
			progressBar.destroy();
			loadingText.destroy();
			percentText.destroy();
		});

		// Cargar assets principales (sin audio)
		this.assetLoader.preloadGameAssets();
		this.assetLoader.loadBitmapFonts();
	}

	create() {
		registerAnimations(this);
		
		// Iniciar carga de audio en segundo plano
		this.loadAudioInBackground();
		
		// Ir al menú principal inmediatamente
		this.scene.start(SceneKeys.MAIN_MENU);
	}

	loadAudioInBackground() {
		// Crear un loader temporal para audio
		const audioLoader = new Phaser.Loader.LoaderPlugin(this);
		
		this.assetLoader.scene = { load: audioLoader };
		this.assetLoader.preloadAudio();
		
		audioLoader.once('complete', () => {
			this.audioLoaded = true;
			console.log('✓ Audio cargado en segundo plano');
		});
		
		audioLoader.start();
	}
}
