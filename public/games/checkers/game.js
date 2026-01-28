const board = document.getElementById('gameBoard');
const turnIndicator = document.getElementById('turnIndicator');
const redScoreEl = document.getElementById('redScore');
const blackScoreEl = document.getElementById('blackScore');
const restartBtn = document.getElementById('restartBtn');
const modeButtons = document.querySelectorAll('.btn-mode');

let grid = [];
let currentPlayer = 'red';
let selectedPiece = null;
let validMoves = [];
let mustCapture = false;
let gameMode = 'pvp';

function init() {
  grid = Array(8).fill(null).map(() => Array(8).fill(null));
  currentPlayer = 'red';
  selectedPiece = null;
  validMoves = [];
  mustCapture = false;
  
  // Place pieces
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) grid[r][c] = { color: 'black', king: false };
    }
  }
  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) grid[r][c] = { color: 'red', king: false };
    }
  }
  
  render();
  updateScores();
  turnIndicator.textContent = "Red's Turn";
  turnIndicator.className = 'red-turn';
}

function render() {
  board.innerHTML = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = document.createElement('div');
      cell.className = `cell ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
      cell.dataset.row = r;
      cell.dataset.col = c;
      
      const move = validMoves.find(m => m.row === r && m.col === c);
      if (move) {
        cell.classList.add(move.capture ? 'capture' : 'valid');
        cell.addEventListener('click', () => movePiece(move));
      }
      
      const piece = grid[r][c];
      if (piece) {
        const pieceEl = document.createElement('div');
        pieceEl.className = `piece ${piece.color}${piece.king ? ' king' : ''}`;
        if (selectedPiece && selectedPiece.row === r && selectedPiece.col === c) {
          pieceEl.classList.add('selected');
        }
        pieceEl.addEventListener('click', (e) => {
          e.stopPropagation();
          selectPiece(r, c);
        });
        cell.appendChild(pieceEl);
      }
      
      board.appendChild(cell);
    }
  }
}

function selectPiece(r, c) {
  const piece = grid[r][c];
  if (!piece || piece.color !== currentPlayer) return;
  
  selectedPiece = { row: r, col: c };
  validMoves = getValidMoves(r, c);
  
  // Check if must capture
  const allCaptures = getAllCaptures(currentPlayer);
  if (allCaptures.length > 0) {
    mustCapture = true;
    validMoves = validMoves.filter(m => m.capture);
    if (validMoves.length === 0) {
      // This piece can't capture, need to select another
      const canCapture = allCaptures.some(cap => cap.fromRow === r && cap.fromCol === c);
      if (!canCapture) {
        selectedPiece = null;
        validMoves = [];
      }
    }
  }
  
  render();
}

function getValidMoves(r, c) {
  const piece = grid[r][c];
  if (!piece) return [];
  
  const moves = [];
  const dirs = piece.king ? [-1, 1] : (piece.color === 'red' ? [-1] : [1]);
  
  for (const dr of dirs) {
    for (const dc of [-1, 1]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (!grid[nr][nc]) {
          moves.push({ row: nr, col: nc, capture: false });
        } else if (grid[nr][nc].color !== piece.color) {
          const jr = nr + dr, jc = nc + dc;
          if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8 && !grid[jr][jc]) {
            moves.push({ row: jr, col: jc, capture: true, capturedRow: nr, capturedCol: nc });
          }
        }
      }
    }
  }
  
  return moves;
}

function getAllCaptures(color) {
  const captures = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (grid[r][c] && grid[r][c].color === color) {
        const moves = getValidMoves(r, c).filter(m => m.capture);
        moves.forEach(m => captures.push({ ...m, fromRow: r, fromCol: c }));
      }
    }
  }
  return captures;
}

function movePiece(move) {
  const { row: fromR, col: fromC } = selectedPiece;
  const piece = grid[fromR][fromC];
  
  grid[move.row][move.col] = piece;
  grid[fromR][fromC] = null;
  
  if (move.capture) {
    grid[move.capturedRow][move.capturedCol] = null;
  }
  
  // King promotion
  if ((piece.color === 'red' && move.row === 0) || (piece.color === 'black' && move.row === 7)) {
    piece.king = true;
  }
  
  // Check for multi-capture
  if (move.capture) {
    const moreMoves = getValidMoves(move.row, move.col).filter(m => m.capture);
    if (moreMoves.length > 0) {
      selectedPiece = { row: move.row, col: move.col };
      validMoves = moreMoves;
      render();
      updateScores();
      return;
    }
  }
  
  selectedPiece = null;
  validMoves = [];
  mustCapture = false;
  
  // Check win
  updateScores();
  if (checkWin()) return;
  
  currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
  turnIndicator.textContent = `${currentPlayer === 'red' ? 'Red' : 'Black'}'s Turn`;
  turnIndicator.className = currentPlayer === 'red' ? 'red-turn' : 'black-turn';
  
  render();
  
  if (gameMode === 'ai' && currentPlayer === 'black') {
    setTimeout(aiMove, 500);
  }
}

function updateScores() {
  let red = 0, black = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (grid[r][c]) {
        if (grid[r][c].color === 'red') red++;
        else black++;
      }
    }
  }
  redScoreEl.textContent = red;
  blackScoreEl.textContent = black;
}

function checkWin() {
  let red = 0, black = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (grid[r][c]) {
        if (grid[r][c].color === 'red') red++;
        else black++;
      }
    }
  }
  
  if (red === 0) {
    turnIndicator.textContent = 'Black Wins!';
    return true;
  }
  if (black === 0) {
    turnIndicator.textContent = 'Red Wins!';
    return true;
  }
  return false;
}

function aiMove() {
  // Simple AI: prioritize captures, then random move
  const captures = getAllCaptures('black');
  if (captures.length > 0) {
    const cap = captures[Math.floor(Math.random() * captures.length)];
    selectedPiece = { row: cap.fromRow, col: cap.fromCol };
    validMoves = getValidMoves(cap.fromRow, cap.fromCol).filter(m => m.capture);
    movePiece(validMoves[0]);
    return;
  }
  
  // Random move
  const allMoves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (grid[r][c] && grid[r][c].color === 'black') {
        const moves = getValidMoves(r, c);
        moves.forEach(m => allMoves.push({ ...m, fromRow: r, fromCol: c }));
      }
    }
  }
  
  if (allMoves.length > 0) {
    const move = allMoves[Math.floor(Math.random() * allMoves.length)];
    selectedPiece = { row: move.fromRow, col: move.fromCol };
    validMoves = [move];
    movePiece(move);
  }
}

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    gameMode = btn.dataset.mode;
    modeButtons.forEach(b => b.classList.toggle('active', b === btn));
    init();
  });
});

restartBtn.addEventListener('click', init);
init();
