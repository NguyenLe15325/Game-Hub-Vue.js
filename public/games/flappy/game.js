// Flappy Jump Game
// Can run standalone with Live Server

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');

// Game Constants
const GRAVITY = 0.4;
const JUMP_FORCE = -7;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;
const BIRD_SIZE = 30;

// Game State
let bird = { x: 80, y: 250, velocity: 0, rotation: 0 };
let pipes = [];
let score = 0;
let highScore = localStorage.getItem('flappyHighScore') || 0;
let gameLoop = null;
let isPlaying = false;
let isGameOver = false;

highScoreEl.textContent = highScore;

// Create pipe
function createPipe() {
  const minHeight = 80;
  const maxHeight = canvas.height - PIPE_GAP - minHeight - 80;
  const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
  
  pipes.push({
    x: canvas.width,
    topHeight: topHeight,
    bottomY: topHeight + PIPE_GAP,
    passed: false
  });
}

// Reset game
function resetGame() {
  bird = { x: 80, y: 250, velocity: 0, rotation: 0 };
  pipes = [];
  score = 0;
  isGameOver = false;
  scoreEl.textContent = '0';
}

// Jump
function jump() {
  if (isGameOver) return;
  bird.velocity = JUMP_FORCE;
}

// Update game
function update() {
  if (!isPlaying) return;
  
  // Bird physics
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;
  bird.rotation = Math.min(Math.max(bird.velocity * 3, -30), 90);
  
  // Generate pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    createPipe();
  }
  
  // Update pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= PIPE_SPEED;
    
    // Score
    if (!pipes[i].passed && pipes[i].x + PIPE_WIDTH < bird.x) {
      pipes[i].passed = true;
      score++;
      scoreEl.textContent = score;
    }
    
    // Remove off-screen pipes
    if (pipes[i].x + PIPE_WIDTH < 0) {
      pipes.splice(i, 1);
    }
  }
  
  // Collision detection
  // Ground and ceiling
  if (bird.y + BIRD_SIZE / 2 > canvas.height - 60 || bird.y - BIRD_SIZE / 2 < 0) {
    gameOver();
    return;
  }
  
  // Pipes
  for (const pipe of pipes) {
    const birdLeft = bird.x - BIRD_SIZE / 2 + 5;
    const birdRight = bird.x + BIRD_SIZE / 2 - 5;
    const birdTop = bird.y - BIRD_SIZE / 2 + 5;
    const birdBottom = bird.y + BIRD_SIZE / 2 - 5;
    
    if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
      if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
        gameOver();
        return;
      }
    }
  }
  
  draw();
  gameLoop = requestAnimationFrame(update);
}

// Draw game
function draw() {
  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGradient.addColorStop(0, '#0ea5e9');
  skyGradient.addColorStop(1, '#7dd3fc');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  drawCloud(50, 80, 40);
  drawCloud(200, 50, 30);
  drawCloud(320, 100, 35);
  
  // Pipes
  for (const pipe of pipes) {
    // Top pipe
    drawPipe(pipe.x, 0, PIPE_WIDTH, pipe.topHeight, true);
    // Bottom pipe
    drawPipe(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY - 60, false);
  }
  
  // Ground
  ctx.fillStyle = '#92400e';
  ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
  ctx.fillStyle = '#65a30d';
  ctx.fillRect(0, canvas.height - 60, canvas.width, 15);
  
  // Bird
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(bird.rotation * Math.PI / 180);
  
  // Body
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.ellipse(0, 0, BIRD_SIZE / 2, BIRD_SIZE / 2 - 3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Wing
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.ellipse(-5, 3, 10, 7, -0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Eye
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(8, -5, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(10, -5, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Beak
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(15, 0);
  ctx.lineTo(25, 3);
  ctx.lineTo(15, 6);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
  
  // Score display on canvas
  ctx.fillStyle = 'white';
  ctx.font = 'bold 48px Segoe UI';
  ctx.textAlign = 'center';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 4;
  ctx.strokeText(score, canvas.width / 2, 60);
  ctx.fillText(score, canvas.width / 2, 60);
}

// Draw cloud
function drawCloud(x, y, size) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.arc(x + size * 0.8, y - size * 0.2, size * 0.7, 0, Math.PI * 2);
  ctx.arc(x + size * 1.5, y, size * 0.8, 0, Math.PI * 2);
  ctx.fill();
}

// Draw pipe
function drawPipe(x, y, width, height, isTop) {
  // Main pipe
  const gradient = ctx.createLinearGradient(x, 0, x + width, 0);
  gradient.addColorStop(0, '#22c55e');
  gradient.addColorStop(0.5, '#4ade80');
  gradient.addColorStop(1, '#16a34a');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
  
  // Pipe cap
  const capHeight = 25;
  const capWidth = width + 10;
  const capX = x - 5;
  const capY = isTop ? y + height - capHeight : y;
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(capX, capY, capWidth, capHeight, 4);
  ctx.fill();
  
  // Highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(x + 5, y, 8, height);
}

// Game over
function gameOver() {
  isGameOver = true;
  isPlaying = false;
  cancelAnimationFrame(gameLoop);
  
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('flappyHighScore', highScore);
    highScoreEl.textContent = highScore;
  }
  
  // Overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 40px Segoe UI';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
  
  ctx.fillStyle = '#60a5fa';
  ctx.font = '24px Segoe UI';
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 15);
  
  if (score === highScore && score > 0) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = '18px Segoe UI';
    ctx.fillText('🏆 New High Score!', canvas.width / 2, canvas.height / 2 + 50);
  }
  
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '14px Segoe UI';
  ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 85);
  
  startBtn.textContent = 'Play Again';
}

// Start game
function startGame() {
  resetGame();
  isPlaying = true;
  startBtn.textContent = 'Restart';
  
  if (gameLoop) cancelAnimationFrame(gameLoop);
  gameLoop = requestAnimationFrame(update);
}

// Event listeners
startBtn.addEventListener('click', startGame);

canvas.addEventListener('click', () => {
  if (isPlaying && !isGameOver) {
    jump();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (isPlaying && !isGameOver) {
      jump();
    }
  }
  if (e.key.toLowerCase() === 'r') {
    startGame();
  }
});

// Initial draw
draw();
