const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const redScoreEl = document.getElementById('redScore');
const blueScoreEl = document.getElementById('blueScore');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const modeButtons = document.querySelectorAll('.btn-mode');

const PADDLE_RADIUS = 30;
const PUCK_RADIUS = 15;
const GOAL_WIDTH = 100;

let redPaddle, bluePaddle, puck;
let redScore = 0, blueScore = 0;
let gameRunning = false;
let gameMode = 'pvp';
let keys = {};

function init() {
  redPaddle = { x: canvas.width / 2, y: 60, vx: 0, vy: 0 };
  bluePaddle = { x: canvas.width / 2, y: canvas.height - 60, vx: 0, vy: 0 };
  resetPuck();
}

function resetPuck() {
  puck = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() < 0.5 ? -1 : 1) * 4
  };
}

function update() {
  if (!gameRunning) return;
  
  // Red paddle movement (WASD)
  if (keys['w'] && redPaddle.y > PADDLE_RADIUS + 5) redPaddle.y -= 6;
  if (keys['s'] && redPaddle.y < canvas.height / 2 - PADDLE_RADIUS) redPaddle.y += 6;
  if (keys['a'] && redPaddle.x > PADDLE_RADIUS + 5) redPaddle.x -= 6;
  if (keys['d'] && redPaddle.x < canvas.width - PADDLE_RADIUS - 5) redPaddle.x += 6;
  
  // Blue paddle movement (Arrow keys or AI)
  if (gameMode === 'pvp') {
    if (keys['ArrowUp'] && bluePaddle.y > canvas.height / 2 + PADDLE_RADIUS) bluePaddle.y -= 6;
    if (keys['ArrowDown'] && bluePaddle.y < canvas.height - PADDLE_RADIUS - 5) bluePaddle.y += 6;
    if (keys['ArrowLeft'] && bluePaddle.x > PADDLE_RADIUS + 5) bluePaddle.x -= 6;
    if (keys['ArrowRight'] && bluePaddle.x < canvas.width - PADDLE_RADIUS - 5) bluePaddle.x += 6;
  } else {
    // AI movement
    const targetX = puck.x;
    const targetY = puck.y > canvas.height / 2 ? puck.y : canvas.height * 0.75;
    
    if (Math.abs(bluePaddle.x - targetX) > 5) {
      bluePaddle.x += (targetX > bluePaddle.x ? 4 : -4);
    }
    if (Math.abs(bluePaddle.y - targetY) > 5 && bluePaddle.y > canvas.height / 2 + PADDLE_RADIUS) {
      bluePaddle.y += (targetY > bluePaddle.y ? 3 : -3);
    }
    bluePaddle.x = Math.max(PADDLE_RADIUS + 5, Math.min(canvas.width - PADDLE_RADIUS - 5, bluePaddle.x));
    bluePaddle.y = Math.max(canvas.height / 2 + PADDLE_RADIUS, Math.min(canvas.height - PADDLE_RADIUS - 5, bluePaddle.y));
  }
  
  // Move puck
  puck.x += puck.vx;
  puck.y += puck.vy;
  
  // Wall collision
  if (puck.x <= PUCK_RADIUS || puck.x >= canvas.width - PUCK_RADIUS) {
    puck.vx *= -0.95;
    puck.x = Math.max(PUCK_RADIUS, Math.min(canvas.width - PUCK_RADIUS, puck.x));
  }
  
  // Goal detection
  const goalLeft = (canvas.width - GOAL_WIDTH) / 2;
  const goalRight = (canvas.width + GOAL_WIDTH) / 2;
  
  if (puck.y <= PUCK_RADIUS) {
    if (puck.x > goalLeft && puck.x < goalRight) {
      blueScore++;
      blueScoreEl.textContent = blueScore;
      resetPuck();
      checkWin();
    } else {
      puck.vy *= -0.95;
      puck.y = PUCK_RADIUS;
    }
  }
  
  if (puck.y >= canvas.height - PUCK_RADIUS) {
    if (puck.x > goalLeft && puck.x < goalRight) {
      redScore++;
      redScoreEl.textContent = redScore;
      resetPuck();
      checkWin();
    } else {
      puck.vy *= -0.95;
      puck.y = canvas.height - PUCK_RADIUS;
    }
  }
  
  // Paddle collision
  checkPaddleCollision(redPaddle);
  checkPaddleCollision(bluePaddle);
  
  // Friction
  puck.vx *= 0.998;
  puck.vy *= 0.998;
  
  // Speed limit
  const speed = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy);
  if (speed > 12) {
    puck.vx = (puck.vx / speed) * 12;
    puck.vy = (puck.vy / speed) * 12;
  }
}

function checkPaddleCollision(paddle) {
  const dx = puck.x - paddle.x;
  const dy = puck.y - paddle.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist < PADDLE_RADIUS + PUCK_RADIUS) {
    const angle = Math.atan2(dy, dx);
    const speed = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy) + 2;
    
    puck.vx = Math.cos(angle) * speed;
    puck.vy = Math.sin(angle) * speed;
    
    // Push puck out
    puck.x = paddle.x + Math.cos(angle) * (PADDLE_RADIUS + PUCK_RADIUS + 1);
    puck.y = paddle.y + Math.sin(angle) * (PADDLE_RADIUS + PUCK_RADIUS + 1);
  }
}

function checkWin() {
  if (redScore >= 7 || blueScore >= 7) {
    gameRunning = false;
    startBtn.textContent = redScore >= 7 ? 'Red Wins! Play Again' : 'Blue Wins! Play Again';
  }
}

function draw() {
  // Table
  ctx.fillStyle = '#0d4a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Center line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Center circle
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
  ctx.stroke();
  
  // Goals
  ctx.fillStyle = '#ef4444';
  ctx.fillRect((canvas.width - GOAL_WIDTH) / 2, 0, GOAL_WIDTH, 8);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect((canvas.width - GOAL_WIDTH) / 2, canvas.height - 8, GOAL_WIDTH, 8);
  
  // Red paddle
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(redPaddle.x, redPaddle.y, PADDLE_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.arc(redPaddle.x, redPaddle.y, PADDLE_RADIUS * 0.6, 0, Math.PI * 2);
  ctx.fill();
  
  // Blue paddle
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(bluePaddle.x, bluePaddle.y, PADDLE_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1d4ed8';
  ctx.beginPath();
  ctx.arc(bluePaddle.x, bluePaddle.y, PADDLE_RADIUS * 0.6, 0, Math.PI * 2);
  ctx.fill();
  
  // Puck
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(puck.x, puck.y, PUCK_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ccc';
  ctx.beginPath();
  ctx.arc(puck.x, puck.y, PUCK_RADIUS * 0.5, 0, Math.PI * 2);
  ctx.fill();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  redScore = 0;
  blueScore = 0;
  redScoreEl.textContent = '0';
  blueScoreEl.textContent = '0';
  init();
  gameRunning = true;
  startBtn.textContent = 'Restart';
}

document.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault();
  }
  keys[e.key.toLowerCase()] = true;
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
  keys[e.key] = false;
});

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    gameMode = btn.dataset.mode;
    modeButtons.forEach(b => b.classList.toggle('active', b === btn));
  });
});

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', () => {
  redScore = 0;
  blueScore = 0;
  redScoreEl.textContent = '0';
  blueScoreEl.textContent = '0';
});

init();
gameLoop();
