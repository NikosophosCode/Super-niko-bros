import Phaser from 'phaser';
import { GameEvents } from '@config/eventKeys';
import { eventBus } from './EventBus';

export class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.currentMusicKey = null;
    this.music = null;
    this.sfx = new Map();
    this.musicVolume = 0.6;
    this.handleGameOver = () => this.fadeOutMusic();
    this.handleLevelComplete = () => this.fadeOutMusic();
    this.handlePause = () => this.pauseMusic();
    this.handleResume = () => this.resumeMusic();
    this.registerEventListeners();
  }

  registerEventListeners() {
    eventBus.on(GameEvents.GAME_OVER, this.handleGameOver);
    eventBus.on(GameEvents.LEVEL_COMPLETE, this.handleLevelComplete);
    eventBus.on(GameEvents.PAUSE, this.handlePause);
    eventBus.on(GameEvents.RESUME, this.handleResume);
  }

  playMusic(key, { loop = true, volume = 0.6 } = {}) {
    this.musicVolume = volume;

    if (!this.scene.sound.get(key)) {
      this.music = this.scene.sound.add(key, { loop, volume });
    } else {
      this.music = this.scene.sound.get(key);
    }

    if (this.currentMusicKey !== key) {
      if (!this.currentMusicKey) {
        this.currentMusicKey = key;
        this.music?.setVolume(volume);
        this.music?.play();
        return;
      }

      this.fadeOutMusic(() => {
        this.currentMusicKey = key;
        this.music?.setVolume(this.musicVolume);
        this.music?.play();
      });
    } else if (!this.music?.isPlaying) {
      this.music?.play();
    }
  }

  fadeOutMusic(onComplete) {
    if (!this.music) {
      onComplete?.();
      return;
    }

    this.scene.tweens.add({
      targets: this.music,
      volume: 0,
      duration: 400,
      onComplete: () => {
        this.music.stop();
        this.music.setVolume(this.musicVolume);
        onComplete?.();
      }
    });
  }

  pauseMusic() {
    this.music?.pause();
  }

  resumeMusic() {
    this.music?.resume();
  }

  playSfx(key, config = {}) {
    if (!this.sfx.has(key)) {
      const sound = this.scene.sound.add(key);
      this.sfx.set(key, sound);
    }

    const sound = this.sfx.get(key);
    sound.play(config);
  }

  destroy() {
    eventBus.off(GameEvents.GAME_OVER, this.handleGameOver);
    eventBus.off(GameEvents.LEVEL_COMPLETE, this.handleLevelComplete);
    eventBus.off(GameEvents.PAUSE, this.handlePause);
    eventBus.off(GameEvents.RESUME, this.handleResume);
    this.music?.destroy();
    this.sfx.forEach((sound) => sound.destroy());
    this.sfx.clear();
    this.music = null;
  }
}
