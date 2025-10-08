import Phaser from 'phaser';
import { eventBus } from '@managers/EventBus';
import { gameState } from '@state/GameState';

export class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
    this.eventBus = eventBus;
    this.gameState = gameState;
  }

  fadeIn(duration = 500) {
    this.cameras.main.fadeIn(duration, 0, 0, 0);
  }

  fadeOut(duration = 500, callback) {
    this.cameras.main.fadeOut(duration, 0, 0, 0);
    if (callback) {
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, callback);
    }
  }
}
