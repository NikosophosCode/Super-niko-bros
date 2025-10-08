import { describe, it, expect, beforeEach } from 'vitest';
import { gameState } from '@state/GameState';

describe('gameState', () => {
  beforeEach(() => {
    gameState.reset();
  });

  it('increases score when adding points', () => {
    const result = gameState.addScore(500);
    expect(result).toBe(500);
    expect(gameState.score).toBe(500);
  });

  it('awards an extra life after collecting 100 coins', () => {
    gameState.coins = 99;
    gameState.lives = 3;

    const coins = gameState.addCoin();

    expect(coins).toBe(0);
    expect(gameState.lives).toBe(4);
  });

  it('does not reduce lives below zero', () => {
    gameState.lives = 1;
    gameState.loseLife();

    expect(gameState.lives).toBe(0);
    gameState.loseLife();
    expect(gameState.lives).toBe(0);
  });

  it('decrements time remaining without going negative', () => {
    gameState.timeRemaining = 3;
    const remaining = gameState.updateTime(5);

    expect(remaining).toBe(0);
    expect(gameState.timeRemaining).toBe(0);
  });
});
