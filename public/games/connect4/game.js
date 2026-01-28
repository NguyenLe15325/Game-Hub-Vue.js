const board = document.getElementById('gameBoard');
const turnIndicator = document.getElementById('turnIndicator');
const redScoreEl = document.getElementById('redScore');
const yellowScoreEl = document.getElementById('yellowScore');
const restartBtn = document.getElementById('restartBtn');
const modeButtons = document.querySelectorAll('.btn-mode');

const ROWS = 6, COLS = 7;
let grid = [];
let currentPlayer = 'red';
let gameActive = true;
let gameMode = 'pvp';
let scores = { red: 0, yellow: 0 };

function init() {
  grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(''));
  currentPlayer = 'red';
  gameActive = true;
  render();
  turnIndicator.textContent = "Red's Turn";
  turnIndicator.className = 'red-turn';
}

function render() {
  board.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (grid[r][c]) cell.classList.add(grid[r][c]);
      cell.dataset.col = c;
      cell.addEventListener('click', () => dropDisc(c));
      board.appendChild(cell);
    }
  }
}

function dropDisc(col) {
  if (!gameActive) return;
  
  let row = -1;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r][col] === '') { row = r; break; }
  }
  if (row === -1) return;
  
  grid[row][col] = currentPlayer;
  render();
  
  if (checkWin(row, col)) {
    gameActive = false;
    scores[currentPlayer]++;
    updateScoreDisplay();
    highlightWinner(row, col);
    turnIndicator.textContent = `${currentPlayer === 'red' ? 'Red' : 'Yellow'} Wins!`;
    return;
  }
  
  if (grid[0].every(cell => cell !== '')) {
    gameActive = false;
    turnIndicator.textContent = "It's a Draw!";
    return;
  }
  
  currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
  turnIndicator.textContent = `${currentPlayer === 'red' ? 'Red' : 'Yellow'}'s Turn`;
  turnIndicator.className = currentPlayer === 'red' ? 'red-turn' : 'yellow-turn';
  
  if (gameMode === 'ai' && currentPlayer === 'yellow') {
    setTimeout(aiMove, 500);
  }
}

function checkWin(row, col) {
  const directions = [[0,1],[1,0],[1,1],[1,-1]];
  for (const [dr, dc] of directions) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i, c = col + dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c] !== currentPlayer) break;
      count++;
    }
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i, c = col - dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c] !== currentPlayer) break;
      count++;
    }
    if (count >= 4) return true;
  }
  return false;
}

function highlightWinner(row, col) {
  const directions = [[0,1],[1,0],[1,1],[1,-1]];
  for (const [dr, dc] of directions) {
    const cells = [[row, col]];
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i, c = col + dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c] !== currentPlayer) break;
      cells.push([r, c]);
    }
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i, c = col - dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c] !== currentPlayer) break;
      cells.push([r, c]);
    }
    if (cells.length >= 4) {
      cells.forEach(([r, c]) => {
        board.children[r * COLS + c].classList.add('winner');
      });
      break;
    }
  }
}

function aiMove() {
  if (!gameActive) return;
  
  // Check for winning move
  for (let c = 0; c < COLS; c++) {
    const r = getDropRow(c);
    if (r !== -1) {
      grid[r][c] = 'yellow';
      if (checkWinAt(r, c, 'yellow')) { grid[r][c] = ''; dropDisc(c); return; }
      grid[r][c] = '';
    }
  }
  
  // Block player
  for (let c = 0; c < COLS; c++) {
    const r = getDropRow(c);
    if (r !== -1) {
      grid[r][c] = 'red';
      if (checkWinAt(r, c, 'red')) { grid[r][c] = ''; dropDisc(c); return; }
      grid[r][c] = '';
    }
  }
  
  // Center preference
  const centerCol = 3;
  if (getDropRow(centerCol) !== -1) { dropDisc(centerCol); return; }
  
  // Random
  const valid = [];
  for (let c = 0; c < COLS; c++) if (getDropRow(c) !== -1) valid.push(c);
  if (valid.length > 0) dropDisc(valid[Math.floor(Math.random() * valid.length)]);
}

function getDropRow(col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r][col] === '') return r;
  }
  return -1;
}

function checkWinAt(row, col, player) {
  const directions = [[0,1],[1,0],[1,1],[1,-1]];
  for (const [dr, dc] of directions) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i, c = col + dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c] !== player) break;
      count++;
    }
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i, c = col - dc * i;
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c] !== player) break;
      count++;
    }
    if (count >= 4) return true;
  }
  return false;
}

function updateScoreDisplay() {
  redScoreEl.textContent = scores.red;
  yellowScoreEl.textContent = scores.yellow;
  localStorage.setItem('connect4Scores', JSON.stringify(scores));
}

function loadScores() {
  const saved = localStorage.getItem('connect4Scores');
  if (saved) scores = JSON.parse(saved);
  updateScoreDisplay();
}

modeButtons.forEach(btn => btn.addEventListener('click', () => {
  gameMode = btn.dataset.mode;
  modeButtons.forEach(b => b.classList.toggle('active', b === btn));
  init();
}));

restartBtn.addEventListener('click', init);
loadScores();
init();
