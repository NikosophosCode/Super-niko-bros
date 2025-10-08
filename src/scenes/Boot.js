import { BaseScene } from './BaseScene';
import { SceneKeys } from '@config/sceneKeys';
import { loadFonts } from '@utils/fontLoader';

export class BootScene extends BaseScene {
	constructor() {
		super(SceneKeys.BOOT);
	}

	async create() {
		await loadFonts([
			{ name: 'SuperMario', url: 'fonts/SuperMario.ttf' },
			{ name: 'SuperPlumberBrothers', url: 'fonts/SuperPlumberBrothers.ttf' }
		]);

		this.scene.start(SceneKeys.PRELOADER);
	}
}
