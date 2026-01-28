const playerBoard = document.getElementById('playerBoard');
const enemyBoard = document.getElementById('enemyBoard');
const messageEl = document.getElementById('message');
const playerHitsEl = document.getElementById('playerHits');
const enemyHitsEl = document.getElementById('enemyHits');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const rotateBtn = document.getElementById('rotateBtn');
const shipBtns = document.querySelectorAll('.ship-btn');
const shipsToPlace = document.getElementById('shipsToPlace');

const GRID_SIZE = 10;
const SHIPS = [5, 4, 3, 3, 2];
const TOTAL_HITS = 17;

let playerGrid = [];
let enemyGrid = [];
let playerShips = [];
let enemyShips = [];
let isHorizontal = true;
let currentShipIndex = 0;
let gameStarted = false;
let playerTurn = true;
let playerHits = 0;
let enemyHits = 0;

function createGrid() {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
}

function renderBoard(boardEl, grid, isEnemy = false) {
  boardEl.innerHTML = '';
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      
      const val = grid[r][c];
      if (!isEnemy && val === 1) cell.classList.add('ship');
      if (val === 2) cell.classList.add('hit');
      if (val === 3) cell.classList.add('miss');
      if (val === 4) cell.classList.add('sunk');
      
      boardEl.appendChild(cell);
    }
  }
}

function canPlaceShip(grid, row, col, size, horizontal) {
  for (let i = 0; i < size; i++) {
    const r = horizontal ? row : row + i;
    const c = horizontal ? col + i : col;
    if (r >= GRID_SIZE || c >= GRID_SIZE || grid[r][c] !== 0) return false;
  }
  return true;
}

function placeShip(grid, ships, row, col, size, horizontal) {
  const ship = [];
  for (let i = 0; i < size; i++) {
    const r = horizontal ? row : row + i;
    const c = horizontal ? col + i : col;
    grid[r][c] = 1;
    ship.push({ r, c });
  }
  ships.push(ship);
}

function placeEnemyShips() {
  enemyGrid = createGrid();
  enemyShips = [];
  
  for (const size of SHIPS) {
    let placed = false;
    while (!placed) {
      const horizontal = Math.random() < 0.5;
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      if (canPlaceShip(enemyGrid, row, col, size, horizontal)) {
        placeShip(enemyGrid, enemyShips, row, col, size, horizontal);
        placed = true;
      }
    }
  }
}

function showPreview(row, col) {
  if (gameStarted || currentShipIndex >= SHIPS.length) return;
  
  const cells = playerBoard.querySelectorAll('.cell');
  cells.forEach(c => c.classList.remove('preview', 'invalid'));
  
  const size = SHIPS[currentShipIndex];
  const valid = canPlaceShip(playerGrid, row, col, size, isHorizontal);
  
  for (let i = 0; i < size; i++) {
    const r = isHorizontal ? row : row + i;
    const c = isHorizontal ? col + i : col;
    if (r < GRID_SIZE && c < GRID_SIZE) {
      const cell = playerBoard.querySelector(`[data-row="${r}"][data-col="${c}"]`);
      if (cell) {
        cell.classList.add('preview');
        if (!valid) cell.classList.add('invalid');
      }
    }
  }
}

function handlePlayerBoardClick(e) {
  if (gameStarted || currentShipIndex >= SHIPS.length) return;
  
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  if (isNaN(row)) return;
  
  const size = SHIPS[currentShipIndex];
  if (canPlaceShip(playerGrid, row, col, size, isHorizontal)) {
    placeShip(playerGrid, playerShips, row, col, size, isHorizontal);
    renderBoard(playerBoard, playerGrid);
    setupPlayerBoardEvents();
    
    shipBtns[currentShipIndex].classList.remove('selected');
    shipBtns[currentShipIndex].classList.add('placed');
    currentShipIndex++;
    
    if (currentShipIndex < SHIPS.length) {
      shipBtns[currentShipIndex].classList.add('selected');
    } else {
      startBtn.disabled = false;
      messageEl.textContent = 'All ships placed! Start the battle!';
    }
  }
}

function handleEnemyBoardClick(e) {
  if (!gameStarted || !playerTurn) return;
  
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  if (isNaN(row)) return;
  
  if (enemyGrid[row][col] >= 2) return; // Already attacked
  
  if (enemyGrid[row][col] === 1) {
    enemyGrid[row][col] = 2;
    playerHits++;
    playerHitsEl.textContent = playerHits;
    messageEl.textContent = 'Hit! 💥';
    checkSunk(enemyGrid, enemyShips);
    
    if (playerHits >= TOTAL_HITS) {
      endGame(true);
      return;
    }
  } else {
    enemyGrid[row][col] = 3;
    messageEl.textContent = 'Miss!';
  }
  
  renderBoard(enemyBoard, enemyGrid, true);
  setupEnemyBoardEvents();
  
  playerTurn = false;
  setTimeout(enemyTurn, 1000);
}

function enemyTurn() {
  if (!gameStarted) return;
  
  let row, col;
  do {
    row = Math.floor(Math.random() * GRID_SIZE);
    col = Math.floor(Math.random() * GRID_SIZE);
  } while (playerGrid[row][col] >= 2);
  
  if (playerGrid[row][col] === 1) {
    playerGrid[row][col] = 2;
    enemyHits++;
    enemyHitsEl.textContent = enemyHits;
    messageEl.textContent = 'Enemy hit your ship! 💥';
    checkSunk(playerGrid, playerShips);
    
    if (enemyHits >= TOTAL_HITS) {
      endGame(false);
      return;
    }
  } else {
    playerGrid[row][col] = 3;
    messageEl.textContent = 'Enemy missed! Your turn.';
  }
  
  renderBoard(playerBoard, playerGrid);
  playerTurn = true;
}

function checkSunk(grid, ships) {
  ships.forEach(ship => {
    const sunk = ship.every(({ r, c }) => grid[r][c] === 2);
    if (sunk) {
      ship.forEach(({ r, c }) => grid[r][c] = 4);
    }
  });
}

function endGame(playerWon) {
  gameStarted = false;
  if (playerWon) {
    messageEl.textContent = '🎉 Victory! You sank all enemy ships!';
    messageEl.className = 'message win';
  } else {
    messageEl.textContent = '💀 Defeat! Your fleet has been destroyed!';
    messageEl.className = 'message lose';
  }
  
  // Reveal enemy ships
  enemyShips.forEach(ship => {
    ship.forEach(({ r, c }) => {
      if (enemyGrid[r][c] === 1) enemyGrid[r][c] = 1;
    });
  });
  renderBoard(enemyBoard, enemyGrid, false);
}

function setupPlayerBoardEvents() {
  playerBoard.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handlePlayerBoardClick);
    cell.addEventListener('mouseenter', (e) => showPreview(parseInt(e.target.dataset.row), parseInt(e.target.dataset.col)));
  });
  playerBoard.addEventListener('mouseleave', () => {
    playerBoard.querySelectorAll('.cell').forEach(c => c.classList.remove('preview', 'invalid'));
  });
}

function setupEnemyBoardEvents() {
  enemyBoard.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleEnemyBoardClick);
  });
}

function init() {
  playerGrid = createGrid();
  playerShips = [];
  currentShipIndex = 0;
  gameStarted = false;
  playerTurn = true;
  playerHits = 0;
  enemyHits = 0;
  isHorizontal = true;
  
  playerHitsEl.textContent = '0';
  enemyHitsEl.textContent = '0';
  startBtn.disabled = true;
  messageEl.textContent = 'Place your ships!';
  messageEl.className = 'message';
  shipsToPlace.style.display = 'flex';
  
  shipBtns.forEach((btn, i) => {
    btn.classList.remove('placed', 'selected');
    if (i === 0) btn.classList.add('selected');
  });
  
  placeEnemyShips();
  renderBoard(playerBoard, playerGrid);
  renderBoard(enemyBoard, createGrid(), true);
  setupPlayerBoardEvents();
  setupEnemyBoardEvents();
}

startBtn.addEventListener('click', () => {
  gameStarted = true;
  shipsToPlace.style.display = 'none';
  messageEl.textContent = 'Battle started! Click enemy waters to attack!';
});

resetBtn.addEventListener('click', init);

rotateBtn.addEventListener('click', () => {
  isHorizontal = !isHorizontal;
  rotateBtn.textContent = isHorizontal ? 'Rotate (R) →' : 'Rotate (R) ↓';
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    isHorizontal = !isHorizontal;
    rotateBtn.textContent = isHorizontal ? 'Rotate (R) →' : 'Rotate (R) ↓';
  }
});

shipBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('placed')) return;
    shipBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentShipIndex = i;
  });
});

init();
