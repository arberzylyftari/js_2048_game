'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const cells = document.querySelectorAll('.field-cell');

if (game.getStatus() === 'ongoing') {
  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');
  messageStart.classList.add('hidden');
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  updateUI();
});

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  if (game.getStatus() !== 'ongoing') {
    return;
  }

  let used = false;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      game.moveLeft();
      used = true;
      break;
    case 'ArrowRight':
      event.preventDefault();
      game.moveRight();
      used = true;
      break;
    case 'ArrowUp':
      event.preventDefault();
      game.moveUp();
      used = true;
      break;
    case 'ArrowDown':
      event.preventDefault();
      game.moveDown();
      used = true;
      break;
  }

  if (used) {
    updateUI();
  }
});

function updateUI() {
  const board = game.getState();
  const score = game.getScore();

  gameScore.textContent = score;

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value !== 0) {
      cell.textContent = String(value);
      cell.classList.add(`field-cell--${value}`);
    }
  });

  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  if (status === 'win') {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
  } else if (status === 'game over') {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
  } else {
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }
}

updateUI();
