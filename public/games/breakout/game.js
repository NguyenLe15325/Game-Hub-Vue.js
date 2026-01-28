// Brick Breaker Game
// Can run standalone with Live Server

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');

// Game Constants
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 52;
const BRICK_HEIGHT = 18;
const BRICK_PADDING = 6;
const BRICK_TOP = 50;
const BRICK_LEFT = 22;

// Colors for brick rows
const BRICK_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

// Game State
let paddle = { x: 0, width: PADDLE_WIDTH };
let ball = { x: 0, y: 0, dx: 0, dy: 0 };
let bricks = [];
let score = 0;
let lives = 3;
let level = 1;
let gameLoop = null;
let isPlaying = false;
let ballLaunched = false;

// Initialize paddle position
paddle.x = canvas.width / 2 - PADDLE_WIDTH / 2;

// Create bricks
function createBricks() {
  bricks = [];
  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      bricks.push({
        x: BRICK_LEFT + col * (BRICK_WIDTH + BRICK_PADDING),
        y: BRICK_TOP + row * (BRICK_HEIGHT + BRICK_PADDING),
        color: BRICK_COLORS[row],
        hits: row < 2 ? 2 : 1, // Top 2 rows need 2 hits
        visible: true
      });
    }
  }
}

// Reset ball
function resetBall() {
  ball.x = paddle.x + PADDLE_WIDTH / 2;
  ball.y = canvas.height - 40;
  ball.dx = 0;
  ball.dy = 0;
  ballLaunched = false;
}

// Launch ball
function launchBall() {
  if (!ballLaunched) {
    const angle = (Math.random() * 60 + 60) * Math.PI / 180; // 60-120 degrees
    const speed = 5 + level * 0.5;
    ball.dx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = -Math.sin(angle) * speed;
    ballLaunched = true;
  }
}

// Update game
function update() {
  if (!isPlaying) return;
  
  // Ball follows paddle before launch
  if (!ballLaunched) {
    ball.x = paddle.x + PADDLE_WIDTH / 2;
  } else {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collisions
    if (ball.x <= BALL_RADIUS || ball.x >= canvas.width - BALL_RADIUS) {
      ball.dx *= -1;
    }
    if (ball.y <= BALL_RADIUS) {
      ball.dy *= -1;
    }
    
    // Paddle collision
    if (
      ball.y + BALL_RADIUS >= canvas.height - 25 &&
      ball.y - BALL_RADIUS <= canvas.height - 25 + PADDLE_HEIGHT &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + PADDLE_WIDTH
    ) {
      // Calculate bounce angle based on where ball hit paddle
      const hitPos = (ball.x - paddle.x) / PADDLE_WIDTH;
      const angle = (hitPos - 0.5) * Math.PI * 0.7; // -63 to +63 degrees
      const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      
      ball.dx = Math.sin(angle) * speed;
      ball.dy = -Math.abs(Math.cos(angle) * speed);
      ball.y = canvas.height - 25 - BALL_RADIUS;
    }
    
    // Brick collisions
    for (const brick of bricks) {
      if (!brick.visible) continue;
      
      if (
        ball.x + BALL_RADIUS > brick.x &&
        ball.x - BALL_RADIUS < brick.x + BRICK_WIDTH &&
        ball.y + BALL_RADIUS > brick.y &&
        ball.y - BALL_RADIUS < brick.y + BRICK_HEIGHT
      ) {
        brick.hits--;
        if (brick.hits <= 0) {
          brick.visible = false;
          score += 10 * level;
          scoreEl.textContent = score;
        }
        
        // Determine collision side
        const overlapLeft = ball.x + BALL_RADIUS - brick.x;
        const overlapRight = brick.x + BRICK_WIDTH - (ball.x - BALL_RADIUS);
        const overlapTop = ball.y + BALL_RADIUS - brick.y;
        const overlapBottom = brick.y + BRICK_HEIGHT - (ball.y - BALL_RADIUS);
        
        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);
        
        if (minOverlapX < minOverlapY) {
          ball.dx *= -1;
        } else {
          ball.dy *= -1;
        }
        
        break;
      }
    }
    
    // Check level complete
    if (bricks.every(b => !b.visible)) {
      level++;
      levelEl.textContent = level;
      createBricks();
      resetBall();
    }
    
    // Ball fell
    if (ball.y > canvas.height + BALL_RADIUS) {
      lives--;
      updateLives();
      
      if (lives <= 0) {
        gameOver();
      } else {
        resetBall();
      }
    }
  }
  
  draw();
  gameLoop = requestAnimationFrame(update);
}

// Update lives display
function updateLives() {
  livesEl.textContent = '❤️'.repeat(lives) || '💔';
}

// Draw game
function draw() {
  // Clear canvas
  ctx.fillStyle = '#0f0f1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw bricks
  for (const brick of bricks) {
    if (!brick.visible) continue;
    
    ctx.fillStyle = brick.color;
    ctx.shadowColor = brick.color;
    ctx.shadowBlur = brick.hits > 1 ? 10 : 0;
    
    ctx.beginPath();
    ctx.roundRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT, 4);
    ctx.fill();
    
    // Highlight for multi-hit bricks
    if (brick.hits > 1) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.roundRect(brick.x + 2, brick.y + 2, BRICK_WIDTH - 4, 4, 2);
      ctx.fill();
    }
  }
  
  ctx.shadowBlur = 0;
  
  // Draw paddle
  const gradient = ctx.createLinearGradient(paddle.x, 0, paddle.x + PADDLE_WIDTH, 0);
  gradient.addColorStop(0, '#f59e0b');
  gradient.addColorStop(1, '#d97706');
  ctx.fillStyle = gradient;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 15;
  
  ctx.beginPath();
  ctx.roundRect(paddle.x, canvas.height - 25, PADDLE_WIDTH, PADDLE_HEIGHT, 6);
  ctx.fill();
  
  ctx.shadowBlur = 0;
  
  // Draw ball
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Launch instruction
  if (!ballLaunched && isPlaying) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Click or press Space to launch', canvas.width / 2, canvas.height - 60);
  }
}

// Game over
function gameOver() {
  isPlaying = false;
  cancelAnimationFrame(gameLoop);
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 36px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
  
  ctx.fillStyle = '#fbbf24';
  ctx.font = '20px Segoe UI';
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
  
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '14px Segoe UI';
  ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 55);
  
  startBtn.textContent = 'Play Again';
}

// Start game
function startGame() {
  score = 0;
  lives = 3;
  level = 1;
  
  scoreEl.textContent = '0';
  levelEl.textContent = '1';
  updateLives();
  
  paddle.x = canvas.width / 2 - PADDLE_WIDTH / 2;
  
  createBricks();
  resetBall();
  
  isPlaying = true;
  startBtn.textContent = 'Restart';
  
  if (gameLoop) cancelAnimationFrame(gameLoop);
  gameLoop = requestAnimationFrame(update);
}

// Event listeners
startBtn.addEventListener('click', startGame);

// Mouse control
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  paddle.x = Math.max(0, Math.min(canvas.width - PADDLE_WIDTH, mouseX - PADDLE_WIDTH / 2));
});

canvas.addEventListener('click', () => {
  if (isPlaying) launchBall();
});

// Keyboard control
const keys = { left: false, right: false };

document.addEventListener('keydown', (e) => {
  // Prevent arrow keys from scrolling the page
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();
  }
  
  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      keys.left = true;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      keys.right = true;
      break;
    case ' ':
      e.preventDefault();
      if (isPlaying) launchBall();
      break;
    case 'r':
    case 'R':
      startGame();
      break;
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      keys.left = false;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      keys.right = false;
      break;
  }
});

// Keyboard paddle movement in game loop
setInterval(() => {
  if (!isPlaying) return;
  const speed = 8;
  if (keys.left) paddle.x = Math.max(0, paddle.x - speed);
  if (keys.right) paddle.x = Math.min(canvas.width - PADDLE_WIDTH, paddle.x + speed);
}, 16);

// Initial draw
createBricks();
resetBall();
draw();
