// Pong Battle Game
// Can run standalone with Live Server

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const difficultySelect = document.getElementById('difficulty');
const playerScoreEl = document.getElementById('playerScore');
const aiScoreEl = document.getElementById('aiScore');

// Game Constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;
const WINNING_SCORE = 5;

// Game State
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ball = { x: 0, y: 0, vx: 0, vy: 0 };
let playerScore = 0;
let aiScore = 0;
let gameLoop = null;
let isPlaying = false;
let aiSpeed = 4;

// Difficulty settings
const difficulties = {
  easy: { speed: 3, reaction: 0.04 },
  medium: { speed: 4, reaction: 0.07 },
  hard: { speed: 6, reaction: 0.1 }
};

// Keys pressed
const keys = {
  up: false,
  down: false
};

// Reset ball
function resetBall(direction = 1) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 5 * direction;
  ball.vy = (Math.random() - 0.5) * 6;
}

// Update game
function update() {
  if (!isPlaying) return;
  
  // Player movement
  const playerSpeed = 7;
  if (keys.up && playerY > 0) {
    playerY -= playerSpeed;
  }
  if (keys.down && playerY < canvas.height - PADDLE_HEIGHT) {
    playerY += playerSpeed;
  }
  
  // AI movement
  const diff = difficulties[difficultySelect.value];
  const aiCenter = aiY + PADDLE_HEIGHT / 2;
  const targetY = ball.y + (Math.random() - 0.5) * 30; // Add some randomness
  
  if (ball.vx > 0) { // Ball moving towards AI
    if (aiCenter < targetY - 10) {
      aiY += diff.speed;
    } else if (aiCenter > targetY + 10) {
      aiY -= diff.speed;
    }
  } else {
    // Move towards center when ball is going away
    const center = canvas.height / 2 - PADDLE_HEIGHT / 2;
    if (aiY < center - 5) aiY += diff.speed * 0.5;
    else if (aiY > center + 5) aiY -= diff.speed * 0.5;
  }
  
  // Keep AI paddle in bounds
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
  
  // Ball movement
  ball.x += ball.vx;
  ball.y += ball.vy;
  
  // Top and bottom collision
  if (ball.y <= 0 || ball.y >= canvas.height - BALL_SIZE) {
    ball.vy *= -1;
    ball.y = Math.max(0, Math.min(canvas.height - BALL_SIZE, ball.y));
  }
  
  // Player paddle collision
  if (
    ball.x <= 30 + PADDLE_WIDTH &&
    ball.x >= 30 &&
    ball.y + BALL_SIZE >= playerY &&
    ball.y <= playerY + PADDLE_HEIGHT
  ) {
    ball.vx = Math.abs(ball.vx) * 1.05; // Speed up slightly
    ball.vx = Math.min(ball.vx, 12); // Cap speed
    
    // Angle based on where ball hit paddle
    const hitPos = (ball.y + BALL_SIZE / 2 - playerY) / PADDLE_HEIGHT;
    ball.vy = (hitPos - 0.5) * 10;
  }
  
  // AI paddle collision
  if (
    ball.x + BALL_SIZE >= canvas.width - 30 - PADDLE_WIDTH &&
    ball.x + BALL_SIZE <= canvas.width - 30 &&
    ball.y + BALL_SIZE >= aiY &&
    ball.y <= aiY + PADDLE_HEIGHT
  ) {
    ball.vx = -Math.abs(ball.vx) * 1.05;
    ball.vx = Math.max(ball.vx, -12);
    
    const hitPos = (ball.y + BALL_SIZE / 2 - aiY) / PADDLE_HEIGHT;
    ball.vy = (hitPos - 0.5) * 10;
  }
  
  // Score
  if (ball.x <= 0) {
    aiScore++;
    aiScoreEl.textContent = aiScore;
    checkWin();
    resetBall(-1);
  } else if (ball.x >= canvas.width) {
    playerScore++;
    playerScoreEl.textContent = playerScore;
    checkWin();
    resetBall(1);
  }
  
  draw();
  gameLoop = requestAnimationFrame(update);
}

// Check for winner
function checkWin() {
  if (playerScore >= WINNING_SCORE || aiScore >= WINNING_SCORE) {
    isPlaying = false;
    cancelAnimationFrame(gameLoop);
    
    const winner = playerScore >= WINNING_SCORE ? 'Player' : 'AI';
    const color = playerScore >= WINNING_SCORE ? '#22c55e' : '#ef4444';
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = color;
    ctx.font = 'bold 36px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(`${winner} Wins!`, canvas.width / 2, canvas.height / 2 - 10);
    
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '16px Segoe UI';
    ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 30);
    
    startBtn.textContent = 'Play Again';
  }
}

// Draw game
function draw() {
  // Clear canvas
  ctx.fillStyle = '#0f0f1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw center line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw paddles
  ctx.fillStyle = '#14b8a6';
  ctx.shadowColor = '#14b8a6';
  ctx.shadowBlur = 15;
  
  // Player paddle
  ctx.beginPath();
  ctx.roundRect(30, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, 5);
  ctx.fill();
  
  // AI paddle
  ctx.beginPath();
  ctx.roundRect(canvas.width - 30 - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, 5);
  ctx.fill();
  
  ctx.shadowBlur = 0;
  
  // Draw ball
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(ball.x + BALL_SIZE / 2, ball.y + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Draw scores in background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.font = 'bold 120px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText(playerScore, canvas.width / 4, canvas.height / 2 + 40);
  ctx.fillText(aiScore, (canvas.width / 4) * 3, canvas.height / 2 + 40);
}

// Start game
function startGame() {
  playerScore = 0;
  aiScore = 0;
  playerScoreEl.textContent = '0';
  aiScoreEl.textContent = '0';
  
  playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
  aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
  
  resetBall(Math.random() > 0.5 ? 1 : -1);
  
  isPlaying = true;
  startBtn.textContent = 'Restart';
  
  if (gameLoop) cancelAnimationFrame(gameLoop);
  gameLoop = requestAnimationFrame(update);
}

// Event listeners
startBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      keys.up = true;
      e.preventDefault();
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      keys.down = true;
      e.preventDefault();
      break;
    case 'r':
    case 'R':
      startGame();
      break;
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      keys.up = false;
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      keys.down = false;
      break;
  }
});

// Initial draw
resetBall();
draw();
