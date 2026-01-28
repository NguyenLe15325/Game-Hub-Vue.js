// Snake Classic Game
// Can run standalone with Live Server

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');

// Game Constants
const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;

// Game State
let snake = [];
let food = { x: 0, y: 0 };
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop = null;
let isPaused = false;
let isGameOver = false;
let gameSpeed = 100;

// Initialize
highScoreEl.textContent = highScore;

function initGame() {
  snake = [
    { x: Math.floor(TILE_COUNT / 2), y: Math.floor(TILE_COUNT / 2) }
  ];
  direction = { x: 0, y: 0 };
  nextDirection = { x: 0, y: 0 };
  score = 0;
  scoreEl.textContent = score;
  isGameOver = false;
  isPaused = false;
  gameSpeed = 100;
  spawnFood();
}

function spawnFood() {
  do {
    food.x = Math.floor(Math.random() * TILE_COUNT);
    food.y = Math.floor(Math.random() * TILE_COUNT);
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function update() {
  if (isPaused || isGameOver) return;
  
  // Update direction
  direction = { ...nextDirection };
  
  // Only move if there's a direction
  if (direction.x === 0 && direction.y === 0) {
    draw();
    return;
  }
  
  // Calculate new head position
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };
  
  // Check wall collision
  if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
    gameOver();
    return;
  }
  
  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }
  
  // Add new head
  snake.unshift(head);
  
  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    spawnFood();
    
    // Speed up slightly
    if (gameSpeed > 50) {
      gameSpeed -= 2;
      clearInterval(gameLoop);
      gameLoop = setInterval(update, gameSpeed);
    }
  } else {
    snake.pop();
  }
  
  draw();
}

function draw() {
  // Clear canvas
  ctx.fillStyle = '#0f0f1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid (subtle)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= TILE_COUNT; i++) {
    ctx.beginPath();
    ctx.moveTo(i * GRID_SIZE, 0);
    ctx.lineTo(i * GRID_SIZE, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * GRID_SIZE);
    ctx.lineTo(canvas.width, i * GRID_SIZE);
    ctx.stroke();
  }
  
  // Draw food
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(
    food.x * GRID_SIZE + GRID_SIZE / 2,
    food.y * GRID_SIZE + GRID_SIZE / 2,
    GRID_SIZE / 2 - 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Draw snake
  snake.forEach((segment, index) => {
    const gradient = ctx.createRadialGradient(
      segment.x * GRID_SIZE + GRID_SIZE / 2,
      segment.y * GRID_SIZE + GRID_SIZE / 2,
      0,
      segment.x * GRID_SIZE + GRID_SIZE / 2,
      segment.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2
    );
    
    if (index === 0) {
      // Head
      gradient.addColorStop(0, '#4ade80');
      gradient.addColorStop(1, '#22c55e');
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 15;
    } else {
      // Body
      const alpha = 1 - (index / snake.length) * 0.5;
      gradient.addColorStop(0, `rgba(34, 197, 94, ${alpha})`);
      gradient.addColorStop(1, `rgba(22, 163, 74, ${alpha})`);
      ctx.shadowBlur = 0;
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(
      segment.x * GRID_SIZE + 1,
      segment.y * GRID_SIZE + 1,
      GRID_SIZE - 2,
      GRID_SIZE - 2,
      4
    );
    ctx.fill();
  });
  
  ctx.shadowBlur = 0;
  
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

function gameOver() {
  isGameOver = true;
  clearInterval(gameLoop);
  gameLoop = null;
  
  // Update high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
    highScoreEl.textContent = highScore;
  }
  
  // Draw game over
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 32px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
  
  ctx.fillStyle = '#22c55e';
  ctx.font = '20px Segoe UI';
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
  
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '14px Segoe UI';
  ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 55);
  
  startBtn.textContent = 'Play Again';
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function startGame() {
  initGame();
  startBtn.textContent = 'Restart';
  pauseBtn.disabled = false;
  
  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(update, gameSpeed);
  draw();
}

function togglePause() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
  draw();
}

// Event Listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

document.addEventListener('keydown', (e) => {
  // Prevent default for arrow keys
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault();
  }
  
  // Pause with space
  if (e.key === ' ' && gameLoop && !isGameOver) {
    togglePause();
    return;
  }
  
  // Restart with R
  if (e.key.toLowerCase() === 'r') {
    startGame();
    return;
  }
  
  if (isPaused || isGameOver) return;
  
  // Direction controls
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
      break;
  }
});

// Initial draw
draw();
