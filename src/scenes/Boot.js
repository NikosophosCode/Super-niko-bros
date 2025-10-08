import { BaseScene } from './BaseScene';
import { SceneKeys } from '@config/sceneKeys';
import { loadFonts } from '@utils/fontLoader';

export class BootScene extends BaseScene {
	constructor() {
		super(SceneKeys.BOOT);
	}

	async create() {
		// Cargar fuentes con timeout para evitar bloqueos
		try {
			await Promise.race([
				loadFonts([
					{ name: 'SuperMario', url: 'fonts/SuperMario.ttf' },
					{ name: 'SuperPlumberBrothers', url: 'fonts/SuperPlumberBrothers.ttf' }
				]),
				// Timeout de 3 segundos
				new Promise((_, reject) => 
					setTimeout(() => reject(new Error('Font loading timeout')), 3000)
				)
			]);
		} catch (error) {
			console.warn('Font loading failed or timed out, using fallback fonts:', error);
		}

		this.scene.start(SceneKeys.PRELOADER);
	}
}
