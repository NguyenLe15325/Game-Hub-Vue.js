// Block Puzzle (Tetris-like) Game
// Can run standalone with Live Server

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const linesEl = document.getElementById('lines');
const highScoreEl = document.getElementById('highScore');

// Constants
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = canvas.width / COLS;
const NEXT_BLOCK_SIZE = 20;

// Tetromino shapes and colors
const SHAPES = {
  I: { shape: [[1, 1, 1, 1]], color: '#06b6d4' },
  O: { shape: [[1, 1], [1, 1]], color: '#eab308' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a855f7' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#22c55e' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ef4444' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#3b82f6' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f97316' }
};

const SHAPE_NAMES = Object.keys(SHAPES);

// Game State
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let lines = 0;
let highScore = localStorage.getItem('tetrisHighScore') || 0;
let gameLoop = null;
let isPaused = false;
let isGameOver = false;
let dropInterval = 1000;
let lastDrop = 0;

highScoreEl.textContent = highScore;

// Initialize board
function initBoard() {
  board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
}

// Create a new piece
function createPiece(type) {
  const template = SHAPES[type];
  return {
    type,
    shape: template.shape.map(row => [...row]),
    color: template.color,
    x: Math.floor(COLS / 2) - Math.floor(template.shape[0].length / 2),
    y: 0
  };
}

// Get random piece
function getRandomPiece() {
  const type = SHAPE_NAMES[Math.floor(Math.random() * SHAPE_NAMES.length)];
  return createPiece(type);
}

// Rotate piece
function rotate(piece) {
  const rows = piece.shape.length;
  const cols = piece.shape[0].length;
  const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      rotated[x][rows - 1 - y] = piece.shape[y][x];
    }
  }
  
  return rotated;
}

// Check collision
function hasCollision(piece, offsetX = 0, offsetY = 0, shape = piece.shape) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const newX = piece.x + x + offsetX;
        const newY = piece.y + y + offsetY;
        
        if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
        if (newY >= 0 && board[newY][newX]) return true;
      }
    }
  }
  return false;
}

// Lock piece to board
function lockPiece() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        const boardY = currentPiece.y + y;
        const boardX = currentPiece.x + x;
        
        if (boardY < 0) {
          gameOver();
          return;
        }
        
        board[boardY][boardX] = currentPiece.color;
      }
    }
  }
  
  clearLines();
  spawnNewPiece();
}

// Clear completed lines
function clearLines() {
  let linesCleared = 0;
  
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== null)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(null));
      linesCleared++;
      y++; // Check same row again
    }
  }
  
  if (linesCleared > 0) {
    // Scoring: 100, 300, 500, 800 for 1, 2, 3, 4 lines
    const points = [0, 100, 300, 500, 800][linesCleared] * level;
    score += points;
    lines += linesCleared;
    
    // Level up every 10 lines
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel > level) {
      level = newLevel;
      dropInterval = Math.max(100, 1000 - (level - 1) * 100);
    }
    
    updateStats();
  }
}

// Spawn new piece
function spawnNewPiece() {
  currentPiece = nextPiece || getRandomPiece();
  nextPiece = getRandomPiece();
  
  if (hasCollision(currentPiece)) {
    gameOver();
  }
  
  drawNext();
}

// Move piece
function movePiece(dx, dy) {
  if (!hasCollision(currentPiece, dx, dy)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    return true;
  }
  return false;
}

// Rotate piece
function rotatePiece() {
  const rotated = rotate(currentPiece);
  
  // Wall kick - try to fit rotated piece
  const kicks = [0, -1, 1, -2, 2];
  for (const kick of kicks) {
    if (!hasCollision(currentPiece, kick, 0, rotated)) {
      currentPiece.shape = rotated;
      currentPiece.x += kick;
      return;
    }
  }
}

// Hard drop
function hardDrop() {
  while (movePiece(0, 1)) {
    score += 2;
  }
  lockPiece();
  updateStats();
}

// Update stats display
function updateStats() {
  scoreEl.textContent = score;
  levelEl.textContent = level;
  linesEl.textContent = lines;
}

// Draw block
function drawBlock(context, x, y, color, size = BLOCK_SIZE) {
  const padding = 1;
  
  // Main block
  context.fillStyle = color;
  context.fillRect(x * size + padding, y * size + padding, size - padding * 2, size - padding * 2);
  
  // Highlight
  context.fillStyle = 'rgba(255, 255, 255, 0.3)';
  context.fillRect(x * size + padding, y * size + padding, size - padding * 2, 3);
  context.fillRect(x * size + padding, y * size + padding, 3, size - padding * 2);
  
  // Shadow
  context.fillStyle = 'rgba(0, 0, 0, 0.3)';
  context.fillRect(x * size + size - padding - 3, y * size + padding, 3, size - padding * 2);
  context.fillRect(x * size + padding, y * size + size - padding - 3, size - padding * 2, 3);
}

// Draw game
function draw() {
  // Clear canvas
  ctx.fillStyle = '#0f0f1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * BLOCK_SIZE, 0);
    ctx.lineTo(x * BLOCK_SIZE, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * BLOCK_SIZE);
    ctx.lineTo(canvas.width, y * BLOCK_SIZE);
    ctx.stroke();
  }
  
  // Draw board
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (board[y][x]) {
        drawBlock(ctx, x, y, board[y][x]);
      }
    }
  }
  
  // Draw ghost piece
  if (currentPiece) {
    let ghostY = currentPiece.y;
    while (!hasCollision(currentPiece, 0, ghostY - currentPiece.y + 1)) {
      ghostY++;
    }
    
    ctx.globalAlpha = 0.3;
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          drawBlock(ctx, currentPiece.x + x, ghostY + y, currentPiece.color);
        }
      }
    }
    ctx.globalAlpha = 1;
    
    // Draw current piece
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          drawBlock(ctx, currentPiece.x + x, currentPiece.y + y, currentPiece.color);
        }
      }
    }
  }
  
  // Draw pause overlay
  if (isPaused) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
  }
}

// Draw next piece preview
function drawNext() {
  nextCtx.fillStyle = '#0f0f1a';
  nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
  
  if (nextPiece) {
    const offsetX = (nextCanvas.width / NEXT_BLOCK_SIZE - nextPiece.shape[0].length) / 2;
    const offsetY = (nextCanvas.height / NEXT_BLOCK_SIZE - nextPiece.shape.length) / 2;
    
    for (let y = 0; y < nextPiece.shape.length; y++) {
      for (let x = 0; x < nextPiece.shape[y].length; x++) {
        if (nextPiece.shape[y][x]) {
          drawBlock(nextCtx, offsetX + x, offsetY + y, nextPiece.color, NEXT_BLOCK_SIZE);
        }
      }
    }
  }
}

// Game loop
function update(timestamp) {
  if (isPaused || isGameOver) {
    gameLoop = requestAnimationFrame(update);
    return;
  }
  
  if (timestamp - lastDrop > dropInterval) {
    if (!movePiece(0, 1)) {
      lockPiece();
    }
    lastDrop = timestamp;
  }
  
  draw();
  gameLoop = requestAnimationFrame(update);
}

// Game over
function gameOver() {
  isGameOver = true;
  cancelAnimationFrame(gameLoop);
  gameLoop = null;
  
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('tetrisHighScore', highScore);
    highScoreEl.textContent = highScore;
  }
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 28px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
  
  ctx.fillStyle = '#a78bfa';
  ctx.font = '18px Segoe UI';
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 15);
  
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '12px Segoe UI';
  ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 45);
  
  startBtn.textContent = 'Play Again';
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

// Start game
function startGame() {
  initBoard();
  score = 0;
  level = 1;
  lines = 0;
  dropInterval = 1000;
  isGameOver = false;
  isPaused = false;
  
  updateStats();
  spawnNewPiece();
  
  startBtn.textContent = 'Restart';
  pauseBtn.disabled = false;
  
  if (gameLoop) cancelAnimationFrame(gameLoop);
  lastDrop = performance.now();
  gameLoop = requestAnimationFrame(update);
}

// Toggle pause
function togglePause() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
  draw();
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

document.addEventListener('keydown', (e) => {
  if (isGameOver) {
    if (e.key.toLowerCase() === 'r') startGame();
    return;
  }
  
  if (e.key === ' ') {
    e.preventDefault();
    if (isPaused) {
      togglePause();
    } else if (currentPiece) {
      hardDrop();
    }
    return;
  }
  
  if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
    togglePause();
    return;
  }
  
  if (e.key.toLowerCase() === 'r') {
    startGame();
    return;
  }
  
  // Prevent arrow keys from scrolling the page
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
  
  if (isPaused || !currentPiece) return;
  
  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      movePiece(-1, 0);
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      movePiece(1, 0);
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (movePiece(0, 1)) score += 1;
      updateStats();
      break;
    case 'ArrowUp':
    case 'w':
    case 'W':
      rotatePiece();
      break;
  }
  
  draw();
});

// Initial draw
initBoard();
draw();
drawNext();
