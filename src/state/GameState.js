class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.level = '1-1';
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.timeRemaining = 400;
    this.powerUpState = 'small';
  }

  addScore(amount) {
    this.score += amount;
    return this.score;
  }

  addCoin(amount = 1) {
    this.coins += amount;
    if (this.coins >= 100) {
      this.coins -= 100;
      this.addLife();
    }
    return this.coins;
  }

  addLife(amount = 1) {
    this.lives += amount;
    return this.lives;
  }

  loseLife() {
    this.lives = Math.max(0, this.lives - 1);
    return this.lives;
  }

  setPowerUp(state) {
    this.powerUpState = state;
    return this.powerUpState;
  }

  updateTime(delta) {
    this.timeRemaining = Math.max(0, this.timeRemaining - delta);
    return this.timeRemaining;
  }
}

export const gameState = new GameState();
