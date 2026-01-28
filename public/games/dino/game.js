const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const GROUND_Y = 230;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const GAME_SPEED_INCREMENT = 0.001;

// Game state
let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('dinoHighScore') || 0;
let gameSpeed = 6;

// Dino
const dino = {
    x: 80,
    y: GROUND_Y,
    width: 50,
    height: 60,
    ducking: false,
    duckHeight: 35,
    velocityY: 0,
    jumping: false
};

// Obstacles
let obstacles = [];
const obstacleTypes = [
    { type: 'cactus-small', width: 25, height: 50 },
    { type: 'cactus-large', width: 30, height: 70 },
    { type: 'cactus-double', width: 50, height: 50 },
    { type: 'bird', width: 50, height: 40, flying: true }
];

// Clouds
let clouds = [];

// Ground
let groundX = 0;

document.getElementById('highScore').textContent = highScore;

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!gameRunning) {
            startGame();
        } else {
            jump();
        }
    }
    if (e.code === 'ArrowDown') {
        e.preventDefault();
        if (gameRunning) {
            duck(true);
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') {
        e.preventDefault();
        duck(false);
    }
});

document.getElementById('startBtn').addEventListener('click', startGame);

function startGame() {
    if (gameRunning) return;
    
    // Reset game
    gameRunning = true;
    score = 0;
    gameSpeed = 6;
    obstacles = [];
    clouds = [];
    dino.y = GROUND_Y;
    dino.velocityY = 0;
    dino.jumping = false;
    dino.ducking = false;
    
    document.getElementById('startBtn').textContent = 'Playing...';
    
    // Remove game over screen if exists
    const overlay = document.querySelector('.game-over');
    if (overlay) overlay.remove();
    
    // Initialize clouds
    for (let i = 0; i < 3; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: 30 + Math.random() * 50,
            width: 60 + Math.random() * 40
        });
    }
    
    gameLoop();
}

function jump() {
    if (!dino.jumping && !dino.ducking) {
        dino.velocityY = JUMP_FORCE;
        dino.jumping = true;
    }
}

function duck(isDucking) {
    if (!dino.jumping) {
        dino.ducking = isDucking;
    }
}

function spawnObstacle() {
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const obstacle = {
        ...type,
        x: canvas.width + 50,
        y: type.flying ? GROUND_Y - 40 - Math.random() * 30 : GROUND_Y
    };
    obstacles.push(obstacle);
}

function update() {
    // Update dino
    dino.velocityY += GRAVITY;
    dino.y += dino.velocityY;
    
    if (dino.y >= GROUND_Y) {
        dino.y = GROUND_Y;
        dino.velocityY = 0;
        dino.jumping = false;
    }
    
    // Get current dino height
    const dinoHeight = dino.ducking ? dino.duckHeight : dino.height;
    
    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;
        
        // Remove off-screen obstacles
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            continue;
        }
        
        // Check collision
        const o = obstacles[i];
        const dinoTop = dino.y - dinoHeight + (dino.ducking ? 25 : 0);
        
        if (dino.x < o.x + o.width &&
            dino.x + dino.width > o.x &&
            dinoTop < o.y &&
            dino.y > o.y - o.height) {
            gameOver();
            return;
        }
    }
    
    // Spawn new obstacles
    if (obstacles.length === 0 || 
        obstacles[obstacles.length - 1].x < canvas.width - 300 - Math.random() * 200) {
        spawnObstacle();
    }
    
    // Update clouds
    clouds.forEach(cloud => {
        cloud.x -= gameSpeed * 0.3;
        if (cloud.x + cloud.width < 0) {
            cloud.x = canvas.width + 50;
            cloud.y = 30 + Math.random() * 50;
        }
    });
    
    // Update ground
    groundX -= gameSpeed;
    if (groundX <= -20) groundX = 0;
    
    // Update score and speed
    score++;
    gameSpeed += GAME_SPEED_INCREMENT;
    document.getElementById('score').textContent = Math.floor(score / 10);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB'; // Sky
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw clouds
    ctx.fillStyle = '#fff';
    clouds.forEach(cloud => {
        drawCloud(cloud.x, cloud.y, cloud.width);
    });
    
    // Draw ground
    ctx.fillStyle = '#f4d03f';
    ctx.fillRect(0, GROUND_Y + 10, canvas.width, 20);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, GROUND_Y + 30, canvas.width, 70);
    
    // Draw ground texture
    ctx.fillStyle = '#7a4012';
    for (let i = groundX; i < canvas.width; i += 20) {
        ctx.fillRect(i, GROUND_Y + 30, 2, 5);
    }
    
    // Draw dino
    drawDino();
    
    // Draw obstacles
    obstacles.forEach(o => {
        if (o.flying) {
            drawBird(o);
        } else {
            drawCactus(o);
        }
    });
}

function drawCloud(x, y, width) {
    ctx.beginPath();
    ctx.ellipse(x, y, width / 3, 15, 0, 0, Math.PI * 2);
    ctx.ellipse(x + width / 4, y - 10, width / 4, 20, 0, 0, Math.PI * 2);
    ctx.ellipse(x + width / 2, y, width / 4, 15, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawDino() {
    const dinoHeight = dino.ducking ? dino.duckHeight : dino.height;
    const yOffset = dino.ducking ? 25 : 0;
    
    ctx.fillStyle = '#2ecc71';
    
    // Body
    ctx.fillRect(dino.x, dino.y - dinoHeight + yOffset, dino.width - 15, dinoHeight);
    
    // Head
    if (!dino.ducking) {
        ctx.fillRect(dino.x + 20, dino.y - dinoHeight - 15, 25, 25);
        // Eye
        ctx.fillStyle = '#fff';
        ctx.fillRect(dino.x + 35, dino.y - dinoHeight - 10, 6, 6);
        ctx.fillStyle = '#000';
        ctx.fillRect(dino.x + 37, dino.y - dinoHeight - 8, 3, 3);
    } else {
        // Ducking head
        ctx.fillRect(dino.x + 20, dino.y - dinoHeight + yOffset - 10, 30, 15);
        ctx.fillStyle = '#fff';
        ctx.fillRect(dino.x + 40, dino.y - dinoHeight + yOffset - 7, 5, 5);
    }
    
    // Legs (animate when running)
    ctx.fillStyle = '#27ae60';
    const legOffset = Math.floor(score / 5) % 2 === 0 ? 0 : 5;
    ctx.fillRect(dino.x + 5, dino.y - 5 + legOffset, 8, 10);
    ctx.fillRect(dino.x + 22, dino.y - 5 - legOffset, 8, 10);
}

function drawCactus(o) {
    ctx.fillStyle = '#27ae60';
    
    // Main stem
    ctx.fillRect(o.x + o.width / 2 - 8, o.y - o.height, 16, o.height);
    
    // Arms
    if (o.type !== 'cactus-small') {
        ctx.fillRect(o.x, o.y - o.height + 20, o.width / 2 - 5, 10);
        ctx.fillRect(o.x, o.y - o.height + 20, 8, 25);
        ctx.fillRect(o.x + o.width / 2 + 5, o.y - o.height + 35, o.width / 2 - 5, 10);
        ctx.fillRect(o.x + o.width - 8, o.y - o.height + 35, 8, 20);
    }
}

function drawBird(o) {
    ctx.fillStyle = '#8e44ad';
    
    // Body
    ctx.fillRect(o.x + 10, o.y - 15, 30, 20);
    
    // Head
    ctx.fillRect(o.x + 35, o.y - 20, 15, 15);
    
    // Beak
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.moveTo(o.x + 50, o.y - 12);
    ctx.lineTo(o.x + 60, o.y - 12);
    ctx.lineTo(o.x + 50, o.y - 7);
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#fff';
    ctx.fillRect(o.x + 42, o.y - 18, 4, 4);
    
    // Wings (animated)
    ctx.fillStyle = '#8e44ad';
    const wingY = Math.floor(score / 3) % 2 === 0 ? -10 : 10;
    ctx.beginPath();
    ctx.moveTo(o.x + 15, o.y - 5);
    ctx.lineTo(o.x + 25, o.y - 5 + wingY);
    ctx.lineTo(o.x + 35, o.y - 5);
    ctx.fill();
}

function gameOver() {
    gameRunning = false;
    document.getElementById('startBtn').textContent = 'Play Again';
    
    const finalScore = Math.floor(score / 10);
    if (finalScore > highScore) {
        highScore = finalScore;
        localStorage.setItem('dinoHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'game-over';
    overlay.innerHTML = `
        <div class="game-over-text">💥 Game Over!</div>
        <div class="final-score">Score: ${finalScore}</div>
        <button class="btn" onclick="startGame()">Play Again</button>
    `;
    document.body.appendChild(overlay);
}

function gameLoop() {
    if (gameRunning) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Initial draw
draw();
