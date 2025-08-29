'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.hasWon = false;

    if (initialState) {
      this.board = initialState.map((row) => [...row]);
      this.status = 'ongoing';
    } else {
      this.board = this.createEmptyBoard();
      this.status = 'idle';
    }
  }

  _initializeGame() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'ongoing';
    this.hasWon = false;
    this.addRandomTile();
    this.addRandomTile();
  }

  createEmptyBoard() {
    return Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0));
  }

  getState() {
    // deep copy to avoid external mutations
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this._initializeGame();
    }
  }

  restart() {
    this._initializeGame();
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    return emptyCells;
  }

  moveLeft() {
    if (this.status !== 'ongoing') {
      return false;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const newRow = this.slideAndMergeLeft(this.board[r]);

      if (JSON.stringify(newRow) !== JSON.stringify(this.board[r])) {
        moved = true;
      }
      this.board[r] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }

    return moved;
  }

  slideAndMergeLeft(row) {
    let filtered = row.filter((cell) => cell !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    filtered = filtered.filter((cell) => cell !== 0);

    while (filtered.length < this.size) {
      filtered.push(0);
    }

    return filtered;
  }

  checkGameStatus() {
    if (!this.hasWon) {
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (this.board[r][c] === 2048) {
            this.status = 'win';
            this.hasWon = true;

            return;
          }
        }
      }
    }

    if (this.getEmptyCells().length === 0 && !this.canMove()) {
      this.status = 'game over';
    }
  }

  canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const current = this.board[r][c];

        if (c < this.size - 1 && current === this.board[r][c + 1]) {
          return true;
        }

        if (r < this.size - 1 && current === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  rotateBoard() {
    const newBoard = [];

    for (let c = 0; c < this.size; c++) {
      const newRow = [];

      for (let r = this.size - 1; r >= 0; r--) {
        newRow.push(this.board[r][c]);
      }
      newBoard.push(newRow);
    }
    this.board = newBoard;
  }

  rotateCounterClockwise() {
    const newBoard = [];

    for (let c = this.size - 1; c >= 0; c--) {
      const newRow = [];

      for (let r = 0; r < this.size; r++) {
        newRow.push(this.board[r][c]);
      }
      newBoard.push(newRow);
    }
    this.board = newBoard;
  }

  moveRight() {
    if (this.status !== 'ongoing') {
      return false;
    }
    this.rotateBoard();
    this.rotateBoard();

    const moved = this.moveLeft();

    this.rotateBoard();
    this.rotateBoard();

    return moved;
  }

  moveUp() {
    if (this.status !== 'ongoing') {
      return false;
    }
    this.rotateCounterClockwise();

    const moved = this.moveLeft();

    this.rotateBoard();

    return moved;
  }

  moveDown() {
    if (this.status !== 'ongoing') {
      return false;
    }
    this.rotateBoard();

    const moved = this.moveLeft();

    this.rotateCounterClockwise();

    return moved;
  }
}

export default Game;
