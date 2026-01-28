const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

const LANE_WIDTH = 60;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 60;
const ROAD_LEFT = 30;
const ROAD_WIDTH = 240;

let player, obstacles, score, gameRunning, speed, roadOffset;
let keys = {};
let highScore = localStorage.getItem('racingHighScore') || 0;
highScoreEl.textContent = highScore;

function init() {
  player = { x: canvas.width / 2 - CAR_WIDTH / 2, y: canvas.height - 100 };
  obstacles = [];
  score = 0;
  speed = 5;
  roadOffset = 0;
  gameRunning = true;
  scoreEl.textContent = '0';
  startBtn.textContent = 'Restart';
  gameLoop();
}

function gameLoop() {
  if (!gameRunning) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function update() {
  // Player movement
  if (keys['ArrowLeft'] && player.x > ROAD_LEFT + 10) player.x -= 6;
  if (keys['ArrowRight'] && player.x < ROAD_LEFT + ROAD_WIDTH - CAR_WIDTH - 10) player.x += 6;
  
  // Road animation
  roadOffset = (roadOffset + speed) % 40;
  
  // Spawn obstacles
  if (Math.random() < 0.02) {
    const lane = Math.floor(Math.random() * 4);
    obstacles.push({
      x: ROAD_LEFT + lane * LANE_WIDTH + 10,
      y: -CAR_HEIGHT,
      type: Math.random() < 0.3 ? 'truck' : 'car'
    });
  }
  
  // Update obstacles
  obstacles = obstacles.filter(obs => {
    obs.y += speed;
    return obs.y < canvas.height + 100;
  });
  
  // Collision detection
  for (const obs of obstacles) {
    const obsHeight = obs.type === 'truck' ? 80 : CAR_HEIGHT;
    if (
      player.x < obs.x + CAR_WIDTH - 10 &&
      player.x + CAR_WIDTH - 10 > obs.x &&
      player.y < obs.y + obsHeight &&
      player.y + CAR_HEIGHT > obs.y
    ) {
      gameOver();
      return;
    }
  }
  
  // Score
  score++;
  if (score % 100 === 0) speed = Math.min(speed + 0.5, 15);
  scoreEl.textContent = Math.floor(score / 10);
}

function draw() {
  // Background
  ctx.fillStyle = '#1a5f1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Road
  ctx.fillStyle = '#333';
  ctx.fillRect(ROAD_LEFT, 0, ROAD_WIDTH, canvas.height);
  
  // Road lines
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.setLineDash([20, 20]);
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(ROAD_LEFT + i * LANE_WIDTH, -40 + roadOffset);
    for (let y = -40 + roadOffset; y < canvas.height; y += 40) {
      ctx.lineTo(ROAD_LEFT + i * LANE_WIDTH, y);
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);
  
  // Road edges
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(ROAD_LEFT, 0);
  ctx.lineTo(ROAD_LEFT, canvas.height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ROAD_LEFT + ROAD_WIDTH, 0);
  ctx.lineTo(ROAD_LEFT + ROAD_WIDTH, canvas.height);
  ctx.stroke();
  
  // Draw player car
  drawCar(player.x, player.y, '#3b82f6', false);
  
  // Draw obstacles
  obstacles.forEach(obs => {
    const color = obs.type === 'truck' ? '#ef4444' : '#f59e0b';
    drawCar(obs.x, obs.y, color, true, obs.type === 'truck');
  });
}

function drawCar(x, y, color, isEnemy, isTruck = false) {
  const height = isTruck ? 80 : CAR_HEIGHT;
  
  // Car body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, CAR_WIDTH, height, 8);
  ctx.fill();
  
  // Windows
  ctx.fillStyle = '#0f172a';
  if (isEnemy) {
    ctx.fillRect(x + 8, y + height - 20, CAR_WIDTH - 16, 12);
  } else {
    ctx.fillRect(x + 8, y + 8, CAR_WIDTH - 16, 15);
  }
  
  // Wheels
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(x - 3, y + 10, 6, 15);
  ctx.fillRect(x + CAR_WIDTH - 3, y + 10, 6, 15);
  ctx.fillRect(x - 3, y + height - 25, 6, 15);
  ctx.fillRect(x + CAR_WIDTH - 3, y + height - 25, 6, 15);
}

function gameOver() {
  gameRunning = false;
  const finalScore = Math.floor(score / 10);
  
  if (finalScore > highScore) {
    highScore = finalScore;
    localStorage.setItem('racingHighScore', highScore);
    highScoreEl.textContent = highScore;
  }
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CRASH!', canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.fillText(`Score: ${finalScore}`, canvas.width / 2, canvas.height / 2 + 20);
  
  startBtn.textContent = 'Play Again';
}

document.addEventListener('keydown', e => {
  if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
    keys[e.key] = true;
  }
});
document.addEventListener('keyup', e => keys[e.key] = false);

leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keys['ArrowLeft'] = true; });
leftBtn.addEventListener('touchend', () => keys['ArrowLeft'] = false);
leftBtn.addEventListener('mousedown', () => keys['ArrowLeft'] = true);
leftBtn.addEventListener('mouseup', () => keys['ArrowLeft'] = false);

rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); keys['ArrowRight'] = true; });
rightBtn.addEventListener('touchend', () => keys['ArrowRight'] = false);
rightBtn.addEventListener('mousedown', () => keys['ArrowRight'] = true);
rightBtn.addEventListener('mouseup', () => keys['ArrowRight'] = false);

startBtn.addEventListener('click', init);

// Initial draw
ctx.fillStyle = '#1a5f1a';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#333';
ctx.fillRect(ROAD_LEFT, 0, ROAD_WIDTH, canvas.height);
ctx.fillStyle = '#f97316';
ctx.font = '20px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('Press Start to Race!', canvas.width / 2, canvas.height / 2);
