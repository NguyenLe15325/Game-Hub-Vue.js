const board = document.getElementById('gameBoard');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');

let grid = [];
let score = 0;
let highScore = localStorage.getItem('2048HighScore') || 0;
highScoreEl.textContent = highScore;

function init() {
  grid = Array(4).fill(null).map(() => Array(4).fill(0));
  score = 0;
  scoreEl.textContent = '0';
  addRandomTile();
  addRandomTile();
  render();
}

function addRandomTile() {
  const empty = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length > 0) {
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
}

function render() {
  board.innerHTML = '';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.dataset.value = grid[r][c];
      tile.textContent = grid[r][c] || '';
      board.appendChild(tile);
    }
  }
}

function slide(row) {
  let arr = row.filter(v => v);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr.splice(i + 1, 1);
    }
  }
  while (arr.length < 4) arr.push(0);
  return arr;
}

function move(dir) {
  let moved = false;
  const oldGrid = JSON.stringify(grid);
  
  if (dir === 'left') {
    for (let r = 0; r < 4; r++) grid[r] = slide(grid[r]);
  } else if (dir === 'right') {
    for (let r = 0; r < 4; r++) grid[r] = slide(grid[r].reverse()).reverse();
  } else if (dir === 'up') {
    for (let c = 0; c < 4; c++) {
      let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
      col = slide(col);
      for (let r = 0; r < 4; r++) grid[r][c] = col[r];
    }
  } else if (dir === 'down') {
    for (let c = 0; c < 4; c++) {
      let col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
      col = slide(col);
      for (let r = 0; r < 4; r++) grid[3 - r][c] = col[r];
    }
  }
  
  if (JSON.stringify(grid) !== oldGrid) {
    addRandomTile();
    scoreEl.textContent = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('2048HighScore', highScore);
      highScoreEl.textContent = highScore;
    }
  }
  render();
  checkGameOver();
}

function checkGameOver() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return;
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return;
    }
  }
  setTimeout(() => {
    const overlay = document.createElement('div');
    overlay.className = 'game-over';
    overlay.innerHTML = `<div class="game-over-content"><h2>Game Over!</h2><p>Final Score: ${score}</p><button class="btn" onclick="this.closest('.game-over').remove(); init();">Play Again</button></div>`;
    document.body.appendChild(overlay);
  }, 300);
}

document.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
    const dirs = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
    move(dirs[e.key]);
  }
});

startBtn.addEventListener('click', init);
init();
