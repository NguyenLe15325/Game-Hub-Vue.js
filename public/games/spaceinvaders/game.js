const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const highScoreEl = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');

const PLAYER_WIDTH = 40, PLAYER_HEIGHT = 20;
const INVADER_WIDTH = 30, INVADER_HEIGHT = 20;
const BULLET_WIDTH = 3, BULLET_HEIGHT = 10;

let player, invaders, bullets, enemyBullets, score, lives, gameRunning, highScore;
let keys = {};
let lastShot = 0;
let invaderDirection = 1;
let invaderSpeed = 1;

highScore = localStorage.getItem('spaceInvadersHighScore') || 0;
highScoreEl.textContent = highScore;

function init() {
  player = { x: canvas.width / 2 - PLAYER_WIDTH / 2, y: canvas.height - 40 };
  invaders = [];
  bullets = [];
  enemyBullets = [];
  score = 0;
  lives = 3;
  gameRunning = true;
  invaderDirection = 1;
  invaderSpeed = 1;
  
  // Create invaders
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      invaders.push({
        x: 30 + col * 45,
        y: 40 + row * 35,
        type: row
      });
    }
  }
  
  updateDisplay();
  startBtn.textContent = 'Restart';
  gameLoop();
}

function updateDisplay() {
  scoreEl.textContent = score;
  livesEl.textContent = '❤️'.repeat(lives);
}

function gameLoop() {
  if (!gameRunning) return;
  
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  // Player movement
  if (keys['ArrowLeft'] && player.x > 5) player.x -= 5;
  if (keys['ArrowRight'] && player.x < canvas.width - PLAYER_WIDTH - 5) player.x += 5;
  
  // Shoot
  if (keys[' '] && Date.now() - lastShot > 300) {
    bullets.push({ x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: player.y });
    lastShot = Date.now();
  }
  
  // Update bullets
  bullets = bullets.filter(b => { b.y -= 8; return b.y > 0; });
  enemyBullets = enemyBullets.filter(b => { b.y += 5; return b.y < canvas.height; });
  
  // Move invaders
  let moveDown = false;
  invaders.forEach(inv => {
    inv.x += invaderSpeed * invaderDirection;
    if (inv.x <= 0 || inv.x >= canvas.width - INVADER_WIDTH) moveDown = true;
  });
  
  if (moveDown) {
    invaderDirection *= -1;
    invaders.forEach(inv => inv.y += 15);
    invaderSpeed = Math.min(invaderSpeed + 0.1, 3);
  }
  
  // Enemy shooting
  if (Math.random() < 0.02 && invaders.length > 0) {
    const shooter = invaders[Math.floor(Math.random() * invaders.length)];
    enemyBullets.push({ x: shooter.x + INVADER_WIDTH / 2, y: shooter.y + INVADER_HEIGHT });
  }
  
  // Check collisions
  bullets.forEach((bullet, bi) => {
    invaders.forEach((inv, ii) => {
      if (bullet.x < inv.x + INVADER_WIDTH && bullet.x + BULLET_WIDTH > inv.x &&
          bullet.y < inv.y + INVADER_HEIGHT && bullet.y + BULLET_HEIGHT > inv.y) {
        invaders.splice(ii, 1);
        bullets.splice(bi, 1);
        score += (4 - inv.type) * 10;
        updateDisplay();
      }
    });
  });
  
  enemyBullets.forEach((bullet, bi) => {
    if (bullet.x < player.x + PLAYER_WIDTH && bullet.x + BULLET_WIDTH > player.x &&
        bullet.y < player.y + PLAYER_HEIGHT && bullet.y + BULLET_HEIGHT > player.y) {
      enemyBullets.splice(bi, 1);
      lives--;
      updateDisplay();
      if (lives <= 0) gameOver();
    }
  });
  
  // Check if invaders reach player
  invaders.forEach(inv => {
    if (inv.y + INVADER_HEIGHT >= player.y) gameOver();
  });
  
  // Check win
  if (invaders.length === 0) {
    score += 500;
    updateDisplay();
    init();
  }
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw stars
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 50; i++) {
    ctx.fillRect((i * 73) % canvas.width, (i * 91) % canvas.height, 1, 1);
  }
  
  // Draw player
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.moveTo(player.x + PLAYER_WIDTH / 2, player.y);
  ctx.lineTo(player.x, player.y + PLAYER_HEIGHT);
  ctx.lineTo(player.x + PLAYER_WIDTH, player.y + PLAYER_HEIGHT);
  ctx.closePath();
  ctx.fill();
  
  // Draw invaders
  const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];
  invaders.forEach(inv => {
    ctx.fillStyle = colors[inv.type];
    ctx.fillRect(inv.x, inv.y, INVADER_WIDTH, INVADER_HEIGHT);
    ctx.fillStyle = '#000';
    ctx.fillRect(inv.x + 5, inv.y + 5, 5, 5);
    ctx.fillRect(inv.x + 20, inv.y + 5, 5, 5);
  });
  
  // Draw bullets
  ctx.fillStyle = '#4ade80';
  bullets.forEach(b => ctx.fillRect(b.x, b.y, BULLET_WIDTH, BULLET_HEIGHT));
  
  ctx.fillStyle = '#ef4444';
  enemyBullets.forEach(b => ctx.fillRect(b.x, b.y, BULLET_WIDTH, BULLET_HEIGHT));
}

function gameOver() {
  gameRunning = false;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('spaceInvadersHighScore', highScore);
    highScoreEl.textContent = highScore;
  }
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 35);
  
  startBtn.textContent = 'Play Again';
}

document.addEventListener('keydown', e => {
  if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
  keys[e.key] = true;
});
document.addEventListener('keyup', e => keys[e.key] = false);
startBtn.addEventListener('click', init);

// Initial draw
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#22c55e';
ctx.font = '20px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('Press Start to Play', canvas.width / 2, canvas.height / 2);
