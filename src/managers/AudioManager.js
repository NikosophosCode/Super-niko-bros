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
    this.hurryMusicKey = null;
    this.normalMusicKey = null;
    this.isInHurryMode = false;
    this.handleGameOver = () => this.fadeOutMusic();
    this.handleLevelComplete = () => this.fadeOutMusic();
    this.handlePause = () => this.pauseMusic();
    this.handleResume = () => this.resumeMusic();
    this.handleTimerAlmostOut = () => this.enterHurryMode();
    this.registerEventListeners();
  }

  registerEventListeners() {
    eventBus.on(GameEvents.GAME_OVER, this.handleGameOver);
    eventBus.on(GameEvents.LEVEL_COMPLETE, this.handleLevelComplete);
    eventBus.on(GameEvents.PAUSE, this.handlePause);
    eventBus.on(GameEvents.RESUME, this.handleResume);
    eventBus.on(GameEvents.TIMER_ALMOST_OUT, this.handleTimerAlmostOut);
  }

  playMusic(key, { loop = true, volume = 0.6, hurryKey = null, preserveState = false } = {}) {
    this.musicVolume = volume;

    if (!preserveState) {
      this.normalMusicKey = key;
      this.hurryMusicKey = hurryKey;
      this.isInHurryMode = false;
    } else if (hurryKey !== null && hurryKey !== undefined) {
      this.hurryMusicKey = hurryKey;
    }

    if (this.currentMusicKey === key && this.music?.isPlaying) {
      this.music.setVolume(volume);
      return;
    }

    const previousMusic = this.music;

    const startTrack = () => {
      this.startMusicTrack(key, { loop, volume });
    };

    if (previousMusic && previousMusic.isPlaying) {
      this.fadeOutMusic(() => {
        startTrack();
      }, previousMusic);
    } else {
      startTrack();
    }
  }

  fadeOutMusic(onComplete, sound = this.music) {
    if (!sound) {
      onComplete?.();
      return;
    }

    this.scene.tweens.add({
      targets: sound,
      volume: 0,
      duration: 400,
      onComplete: () => {
        sound.stop();
        sound.setVolume(this.musicVolume);
        if (sound === this.music) {
          this.music = null;
          this.currentMusicKey = null;
        }
        onComplete?.();
      }
    });
  }

  startMusicTrack(key, { loop, volume }) {
    let sound = this.scene.sound.get(key);

    if (!sound) {
      sound = this.scene.sound.add(key, { loop, volume });
    } else {
      sound.setLoop(loop);
    }

    sound.setVolume(volume);
    sound.play();

    this.music = sound;
    this.currentMusicKey = key;
  }

  enterHurryMode() {
    if (this.isInHurryMode || !this.hurryMusicKey) {
      return;
    }

    this.isInHurryMode = true;

    const previousMusic = this.music;

    const startHurry = () => {
      this.startMusicTrack(this.hurryMusicKey, { loop: true, volume: this.musicVolume });
    };

    if (previousMusic && previousMusic.isPlaying) {
      this.fadeOutMusic(() => {
        startHurry();
      }, previousMusic);
    } else {
      startHurry();
    }
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
    eventBus.off(GameEvents.TIMER_ALMOST_OUT, this.handleTimerAlmostOut);
    this.music?.destroy();
    this.sfx.forEach((sound) => sound.destroy());
    this.sfx.clear();
    this.music = null;
  }
}
