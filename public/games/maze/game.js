const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Maze settings
let mazeSize = 15; // Starts at 15x15, increases per level
let cellSize;
let maze = [];
let player = { x: 1, y: 1 };
let exit = { x: 0, y: 0 };
let level = 1;
let timer = null;
let seconds = 0;
let gameStarted = false;
let gameWon = false;

const levelDisplay = document.getElementById('level');
const timeDisplay = document.getElementById('time');
const bestDisplay = document.getElementById('best');

// Load best time
loadBest();

// Event listeners
document.addEventListener('keydown', handleKeydown);
document.getElementById('newMazeBtn').addEventListener('click', newMaze);
document.getElementById('resetBtn').addEventListener('click', resetPosition);

function handleKeydown(e) {
    if (gameWon) return;
    
    const key = e.key;
    let dx = 0, dy = 0;
    
    if (key === 'ArrowUp' || key === 'w' || key === 'W') {
        e.preventDefault();
        dy = -1;
    } else if (key === 'ArrowDown' || key === 's' || key === 'S') {
        e.preventDefault();
        dy = 1;
    } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        e.preventDefault();
        dx = -1;
    } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
        e.preventDefault();
        dx = 1;
    }
    
    if (dx !== 0 || dy !== 0) {
        if (!gameStarted) {
            startTimer();
            gameStarted = true;
        }
        movePlayer(dx, dy);
    }
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    
    if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize) {
        if (maze[newY][newX] !== 1) {
            player.x = newX;
            player.y = newY;
            draw();
            
            if (player.x === exit.x && player.y === exit.y) {
                winLevel();
            }
        }
    }
}

function resetPosition() {
    player.x = 1;
    player.y = 1;
    draw();
}

function newMaze() {
    // Remove overlay if exists
    const overlay = document.querySelector('.win-overlay');
    if (overlay) overlay.remove();
    
    level = 1;
    mazeSize = 15;
    generateNewMaze();
}

function nextLevel() {
    level++;
    mazeSize = Math.min(15 + Math.floor(level / 2) * 2, 31); // Max 31x31
    generateNewMaze();
}

function generateNewMaze() {
    stopTimer();
    seconds = 0;
    gameStarted = false;
    gameWon = false;
    
    levelDisplay.textContent = level;
    timeDisplay.textContent = '0:00';
    
    cellSize = Math.floor(canvas.width / mazeSize);
    
    // Initialize maze with walls
    maze = [];
    for (let y = 0; y < mazeSize; y++) {
        maze[y] = [];
        for (let x = 0; x < mazeSize; x++) {
            maze[y][x] = 1; // Wall
        }
    }
    
    // Generate maze using recursive backtracking
    generateMazeDFS(1, 1);
    
    // Set player start and exit
    player = { x: 1, y: 1 };
    exit = { x: mazeSize - 2, y: mazeSize - 2 };
    maze[exit.y][exit.x] = 0; // Ensure exit is open
    
    draw();
}

function generateMazeDFS(x, y) {
    maze[y][x] = 0; // Mark as path
    
    // Randomize directions
    const directions = [
        [0, -2], // Up
        [0, 2],  // Down
        [-2, 0], // Left
        [2, 0]   // Right
    ];
    shuffleArray(directions);
    
    for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        
        if (newX > 0 && newX < mazeSize - 1 && 
            newY > 0 && newY < mazeSize - 1 && 
            maze[newY][newX] === 1) {
            // Carve through wall
            maze[y + dy / 2][x + dx / 2] = 0;
            generateMazeDFS(newX, newY);
        }
    }
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const offsetX = (canvas.width - mazeSize * cellSize) / 2;
    const offsetY = (canvas.height - mazeSize * cellSize) / 2;
    
    // Draw maze
    for (let y = 0; y < mazeSize; y++) {
        for (let x = 0; x < mazeSize; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = '#2c3e50';
                ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
            }
        }
    }
    
    // Draw exit
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(
        offsetX + exit.x * cellSize + 2, 
        offsetY + exit.y * cellSize + 2, 
        cellSize - 4, 
        cellSize - 4
    );
    
    // Draw player with glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00d4ff';
    ctx.fillStyle = '#00d4ff';
    ctx.beginPath();
    ctx.arc(
        offsetX + player.x * cellSize + cellSize / 2,
        offsetY + player.y * cellSize + cellSize / 2,
        cellSize / 2 - 3,
        0, Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        timeDisplay.textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function formatTime(secs) {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
}

function loadBest() {
    const best = localStorage.getItem('mazeBest');
    bestDisplay.textContent = best ? formatTime(parseInt(best)) : '--';
}

function winLevel() {
    gameWon = true;
    stopTimer();
    
    // Save best time for level 1
    if (level === 1) {
        const best = localStorage.getItem('mazeBest');
        if (!best || seconds < parseInt(best)) {
            localStorage.setItem('mazeBest', seconds);
            bestDisplay.textContent = formatTime(seconds);
        }
    }
    
    // Show win overlay
    const overlay = document.createElement('div');
    overlay.className = 'win-overlay';
    overlay.innerHTML = `
        <div class="win-text">🎉 Level ${level} Complete!</div>
        <div class="win-stats">Time: ${formatTime(seconds)}</div>
        <button class="btn" onclick="this.parentElement.remove(); nextLevel();">Next Level</button>
    `;
    document.body.appendChild(overlay);
}

// Initialize
generateNewMaze();
