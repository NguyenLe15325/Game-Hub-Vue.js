const cells = document.querySelectorAll('.cell');
const turnIndicator = document.getElementById('turnIndicator');
const xScoreEl = document.getElementById('xScore');
const oScoreEl = document.getElementById('oScore');
const drawScoreEl = document.getElementById('drawScore');
const restartBtn = document.getElementById('restartBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const modeButtons = document.querySelectorAll('.btn-mode');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'pvp';
let scores = { X: 0, O: 0, draw: 0 };

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function loadScores() {
  const saved = localStorage.getItem('tictactoeScores');
  if (saved) scores = JSON.parse(saved);
  updateScoreDisplay();
}

function saveScores() {
  localStorage.setItem('tictactoeScores', JSON.stringify(scores));
}

function updateScoreDisplay() {
  xScoreEl.textContent = scores.X;
  oScoreEl.textContent = scores.O;
  drawScoreEl.textContent = scores.draw;
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== '' || !gameActive) return;
  
  makeMove(index, currentPlayer);
  
  if (gameActive && gameMode === 'ai' && currentPlayer === 'O') {
    setTimeout(aiMove, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());
  
  if (checkWin(player)) {
    gameActive = false;
    scores[player]++;
    saveScores();
    updateScoreDisplay();
    highlightWinner(player);
    turnIndicator.textContent = `Player ${player} Wins!`;
    return;
  }
  
  if (board.every(cell => cell !== '')) {
    gameActive = false;
    scores.draw++;
    saveScores();
    updateScoreDisplay();
    turnIndicator.textContent = "It's a Draw!";
    return;
  }
  
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
  turnIndicator.className = currentPlayer === 'X' ? 'x-turn' : 'o-turn';
}

function checkWin(player) {
  return winPatterns.some(pattern => 
    pattern.every(index => board[index] === player)
  );
}

function highlightWinner(player) {
  winPatterns.forEach(pattern => {
    if (pattern.every(index => board[index] === player)) {
      pattern.forEach(index => cells[index].classList.add('winner'));
    }
  });
}

function aiMove() {
  if (!gameActive) return;
  
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      if (checkWin('O')) { board[i] = ''; makeMove(i, 'O'); return; }
      board[i] = '';
    }
  }
  
  // Block player
  for (let i = 0; i < 9; i++) {
    if (board[i] === '') {
      board[i] = 'X';
      if (checkWin('X')) { board[i] = ''; makeMove(i, 'O'); return; }
      board[i] = '';
    }
  }
  
  // Take center
  if (board[4] === '') { makeMove(4, 'O'); return; }
  
  // Take corner
  const corners = [0, 2, 6, 8].filter(i => board[i] === '');
  if (corners.length > 0) {
    makeMove(corners[Math.floor(Math.random() * corners.length)], 'O');
    return;
  }
  
  // Take any
  const empty = board.map((c, i) => c === '' ? i : null).filter(i => i !== null);
  if (empty.length > 0) {
    makeMove(empty[Math.floor(Math.random() * empty.length)], 'O');
  }
}

function restart() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o', 'winner');
  });
  turnIndicator.textContent = "Player X's Turn";
  turnIndicator.className = 'x-turn';
}

function resetScores() {
  scores = { X: 0, O: 0, draw: 0 };
  saveScores();
  updateScoreDisplay();
}

function setMode(mode) {
  gameMode = mode;
  modeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
  restart();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restart);
resetScoreBtn.addEventListener('click', resetScores);
modeButtons.forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));

loadScores();
