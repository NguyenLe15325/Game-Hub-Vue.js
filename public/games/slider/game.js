let gridSize = 3;
let tiles = [];
let emptyIndex;
let moves = 0;
let timer = null;
let seconds = 0;
let gameStarted = false;

const board = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
const bestDisplay = document.getElementById('best');

// Load best time
function loadBest() {
    const best = localStorage.getItem(`sliderBest${gridSize}`);
    bestDisplay.textContent = best ? formatTime(parseInt(best)) : '--';
}

// Initialize
loadBest();
initGame();

// Event listeners
document.getElementById('shuffleBtn').addEventListener('click', shuffleAndStart);
document.getElementById('solveBtn').addEventListener('click', showSolution);

document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gridSize = parseInt(btn.dataset.size);
        loadBest();
        initGame();
    });
});

function initGame() {
    stopTimer();
    moves = 0;
    seconds = 0;
    gameStarted = false;
    movesDisplay.textContent = '0';
    timeDisplay.textContent = '0:00';
    
    // Create solved state
    tiles = [];
    for (let i = 1; i < gridSize * gridSize; i++) {
        tiles.push(i);
    }
    tiles.push(0); // Empty tile
    emptyIndex = tiles.length - 1;
    
    renderBoard();
}

function shuffleAndStart() {
    initGame();
    shuffle();
    gameStarted = true;
    startTimer();
}

function shuffle() {
    // Make random valid moves to shuffle
    const numMoves = gridSize * gridSize * 20;
    for (let i = 0; i < numMoves; i++) {
        const neighbors = getNeighbors(emptyIndex);
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        swapTiles(randomNeighbor, emptyIndex, false);
    }
    renderBoard();
}

function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    
    if (row > 0) neighbors.push(index - gridSize); // Above
    if (row < gridSize - 1) neighbors.push(index + gridSize); // Below
    if (col > 0) neighbors.push(index - 1); // Left
    if (col < gridSize - 1) neighbors.push(index + 1); // Right
    
    return neighbors;
}

function swapTiles(fromIndex, toIndex, countMove = true) {
    [tiles[fromIndex], tiles[toIndex]] = [tiles[toIndex], tiles[fromIndex]];
    emptyIndex = fromIndex;
    
    if (countMove && gameStarted) {
        moves++;
        movesDisplay.textContent = moves;
    }
}

function renderBoard() {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    
    tiles.forEach((tile, index) => {
        const div = document.createElement('div');
        div.className = 'tile' + (tile === 0 ? ' empty' : '');
        div.textContent = tile === 0 ? '' : tile;
        
        // Check if tile is in correct position
        if (tile !== 0 && tile === index + 1) {
            div.classList.add('correct');
        }
        
        div.addEventListener('click', () => handleTileClick(index));
        board.appendChild(div);
    });
}

function handleTileClick(index) {
    if (!gameStarted) {
        shuffleAndStart();
        return;
    }
    
    const neighbors = getNeighbors(emptyIndex);
    if (neighbors.includes(index)) {
        swapTiles(index, emptyIndex);
        renderBoard();
        
        if (checkWin()) {
            handleWin();
        }
    }
}

function checkWin() {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] !== i + 1) return false;
    }
    return true;
}

function handleWin() {
    stopTimer();
    gameStarted = false;
    
    // Save best time
    const bestKey = `sliderBest${gridSize}`;
    const currentBest = localStorage.getItem(bestKey);
    if (!currentBest || seconds < parseInt(currentBest)) {
        localStorage.setItem(bestKey, seconds);
        bestDisplay.textContent = formatTime(seconds);
    }
    
    // Show win overlay
    const overlay = document.createElement('div');
    overlay.className = 'win-overlay';
    overlay.innerHTML = `
        <div class="win-text">🎉 Puzzle Solved! 🎉</div>
        <div class="win-stats">
            Moves: ${moves} | Time: ${formatTime(seconds)}
        </div>
        <button class="btn" onclick="this.parentElement.remove(); shuffleAndStart();">Play Again</button>
    `;
    document.body.appendChild(overlay);
}

function showSolution() {
    stopTimer();
    gameStarted = false;
    moves = 0;
    movesDisplay.textContent = '0';
    
    tiles = [];
    for (let i = 1; i < gridSize * gridSize; i++) {
        tiles.push(i);
    }
    tiles.push(0);
    emptyIndex = tiles.length - 1;
    
    renderBoard();
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
