const board = document.getElementById('gameBoard');
const minesLeftEl = document.getElementById('minesLeft');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const diffButtons = document.querySelectorAll('.btn-diff');

let grid = [];
let size = 9;
let mines = 10;
let minesLeft = 10;
let revealed = 0;
let gameOver = false;
let firstClick = true;
let timer = 0;
let timerInterval;

function init() {
  grid = [];
  revealed = 0;
  gameOver = false;
  firstClick = true;
  minesLeft = mines;
  timer = 0;
  
  clearInterval(timerInterval);
  timerEl.textContent = '0';
  minesLeftEl.textContent = mines;
  
  board.style.gridTemplateColumns = `repeat(${size}, 28px)`;
  board.innerHTML = '';
  
  for (let r = 0; r < size; r++) {
    grid[r] = [];
    for (let c = 0; c < size; c++) {
      grid[r][c] = { mine: false, revealed: false, flagged: false, count: 0 };
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', handleClick);
      cell.addEventListener('contextmenu', handleRightClick);
      board.appendChild(cell);
    }
  }
}

function placeMines(excludeR, excludeC) {
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    if (!grid[r][c].mine && !(r === excludeR && c === excludeC)) {
      grid[r][c].mine = true;
      placed++;
    }
  }
  
  // Calculate numbers
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c].mine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc].mine) {
              count++;
            }
          }
        }
        grid[r][c].count = count;
      }
    }
  }
}

function handleClick(e) {
  if (gameOver) return;
  
  const r = parseInt(e.target.dataset.row);
  const c = parseInt(e.target.dataset.col);
  const cell = grid[r][c];
  
  if (cell.flagged || cell.revealed) return;
  
  if (firstClick) {
    firstClick = false;
    placeMines(r, c);
    timerInterval = setInterval(() => {
      timer++;
      timerEl.textContent = timer;
    }, 1000);
  }
  
  reveal(r, c);
}

function reveal(r, c) {
  if (r < 0 || r >= size || c < 0 || c >= size) return;
  const cell = grid[r][c];
  if (cell.revealed || cell.flagged) return;
  
  cell.revealed = true;
  revealed++;
  
  const cellEl = board.children[r * size + c];
  cellEl.classList.add('revealed');
  
  if (cell.mine) {
    cellEl.classList.add('mine');
    cellEl.textContent = '💣';
    endGame(false);
    return;
  }
  
  if (cell.count > 0) {
    cellEl.textContent = cell.count;
    cellEl.dataset.num = cell.count;
  } else {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        reveal(r + dr, c + dc);
      }
    }
  }
  
  if (revealed === size * size - mines) {
    endGame(true);
  }
}

function handleRightClick(e) {
  e.preventDefault();
  if (gameOver) return;
  
  const r = parseInt(e.target.dataset.row);
  const c = parseInt(e.target.dataset.col);
  const cell = grid[r][c];
  
  if (cell.revealed) return;
  
  cell.flagged = !cell.flagged;
  e.target.classList.toggle('flagged');
  minesLeft += cell.flagged ? -1 : 1;
  minesLeftEl.textContent = minesLeft;
}

function endGame(won) {
  gameOver = true;
  clearInterval(timerInterval);
  
  // Reveal all mines
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c].mine) {
        const cellEl = board.children[r * size + c];
        cellEl.classList.add('revealed');
        if (!won) cellEl.classList.add('mine');
        cellEl.textContent = won ? '🚩' : '💣';
      }
    }
  }
  
  setTimeout(() => {
    alert(won ? `You Won! Time: ${timer}s` : 'Game Over!');
  }, 100);
}

diffButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    diffButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    size = parseInt(btn.dataset.size);
    mines = parseInt(btn.dataset.mines);
    init();
  });
});

startBtn.addEventListener('click', init);
init();
