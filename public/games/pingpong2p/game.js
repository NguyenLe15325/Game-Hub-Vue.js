const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameRunning = false;
let score1 = 0;
let score2 = 0;
const winScore = 10;

// Paddle settings
const paddleWidth = 12;
const paddleHeight = 100;
const paddleSpeed = 8;

// Ball settings
const ballSize = 12;
let ballSpeedX = 6;
let ballSpeedY = 4;

// Game objects
const paddle1 = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    color: '#ff6b6b'
};

const paddle2 = {
    x: canvas.width - 20 - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    color: '#4ecdc4'
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    dx: ballSpeedX,
    dy: ballSpeedY
};

// Key states
const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        e.preventDefault();
        keys[e.key] = true;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        e.preventDefault();
        keys[e.key] = false;
    }
});

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('resetBtn').addEventListener('click', resetScores);

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        document.getElementById('startBtn').textContent = 'Game Running';
        resetBall();
        gameLoop();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ballSpeedX;
    ball.dy = (Math.random() * 2 - 1) * ballSpeedY;
}

function resetScores() {
    score1 = 0;
    score2 = 0;
    updateScore();
    gameRunning = false;
    document.getElementById('startBtn').textContent = 'Start Game';
    resetBall();
    paddle1.y = canvas.height / 2 - paddleHeight / 2;
    paddle2.y = canvas.height / 2 - paddleHeight / 2;
    draw();
    
    // Remove any winner overlay
    const overlay = document.querySelector('.winner-overlay');
    if (overlay) overlay.remove();
}

function updateScore() {
    document.getElementById('score1').textContent = score1;
    document.getElementById('score2').textContent = score2;
}

function update() {
    // Update paddle positions based on keys
    if (keys.w) paddle1.y -= paddleSpeed;
    if (keys.s) paddle1.y += paddleSpeed;
    if (keys.ArrowUp) paddle2.y -= paddleSpeed;
    if (keys.ArrowDown) paddle2.y += paddleSpeed;
    
    // Keep paddles in bounds
    paddle1.y = Math.max(0, Math.min(canvas.height - paddle1.height, paddle1.y));
    paddle2.y = Math.max(0, Math.min(canvas.height - paddle2.height, paddle2.y));
    
    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top/bottom
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy *= -1;
        ball.y = ball.y - ball.size < 0 ? ball.size : canvas.height - ball.size;
    }
    
    // Ball collision with paddles
    if (checkPaddleCollision(paddle1) || checkPaddleCollision(paddle2)) {
        ball.dx *= -1.05; // Slight speed increase
        
        // Add spin based on where ball hits paddle
        const paddle = ball.x < canvas.width / 2 ? paddle1 : paddle2;
        const hitPos = (ball.y - paddle.y) / paddle.height;
        ball.dy = (hitPos - 0.5) * 10;
    }
    
    // Scoring
    if (ball.x - ball.size < 0) {
        score2++;
        updateScore();
        checkWinner();
        resetBall();
    } else if (ball.x + ball.size > canvas.width) {
        score1++;
        updateScore();
        checkWinner();
        resetBall();
    }
}

function checkPaddleCollision(paddle) {
    return ball.x - ball.size < paddle.x + paddle.width &&
           ball.x + ball.size > paddle.x &&
           ball.y - ball.size < paddle.y + paddle.height &&
           ball.y + ball.size > paddle.y;
}

function checkWinner() {
    if (score1 >= winScore || score2 >= winScore) {
        gameRunning = false;
        document.getElementById('startBtn').textContent = 'Start Game';
        showWinner(score1 >= winScore ? 1 : 2);
    }
}

function showWinner(player) {
    const overlay = document.createElement('div');
    overlay.className = 'winner-overlay';
    overlay.innerHTML = `
        <div class="winner-text ${player === 1 ? 'player1' : 'player2'}">
            🎉 Player ${player} Wins! 🎉
        </div>
        <button class="btn" onclick="resetScores()">Play Again</button>
    `;
    document.body.appendChild(overlay);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.setLineDash([10, 10]);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles with glow
    ctx.shadowBlur = 20;
    
    ctx.shadowColor = paddle1.color;
    ctx.fillStyle = paddle1.color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    
    ctx.shadowColor = paddle2.color;
    ctx.fillStyle = paddle2.color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    
    // Draw ball with glow
    ctx.shadowColor = '#fff';
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    // Draw scores on canvas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(score1, canvas.width / 4, canvas.height / 2 + 40);
    ctx.fillText(score2, canvas.width * 3 / 4, canvas.height / 2 + 40);
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
