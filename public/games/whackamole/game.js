const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const highScoreEl = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');

let score = 0;
let timeLeft = 30;
let gameRunning = false;
let gameInterval, timerInterval, moleTimeout;
let lastHole = -1;

let highScore = localStorage.getItem('whackamoleHighScore') || 0;
highScoreEl.textContent = highScore;

function randomHole() {
  let idx;
  do {
    idx = Math.floor(Math.random() * 9);
  } while (idx === lastHole);
  lastHole = idx;
  return idx;
}

function showMole() {
  if (!gameRunning) return;
  
  moles.forEach(m => m.classList.remove('up'));
  
  const idx = randomHole();
  moles[idx].classList.add('up');
  
  const time = Math.max(600, 1200 - score * 20);
  moleTimeout = setTimeout(() => {
    moles[idx].classList.remove('up');
    if (gameRunning) showMole();
  }, time);
}

function whack(e) {
  if (!gameRunning) return;
  
  const mole = e.target;
  if (!mole.classList.contains('up')) return;
  
  mole.classList.remove('up');
  mole.classList.add('whacked');
  setTimeout(() => mole.classList.remove('whacked'), 100);
  
  score++;
  scoreEl.textContent = score;
}

function startGame() {
  score = 0;
  timeLeft = 30;
  gameRunning = true;
  
  scoreEl.textContent = '0';
  timerEl.textContent = '30';
  startBtn.disabled = true;
  startBtn.textContent = 'Playing...';
  
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
  
  showMole();
}

function endGame() {
  gameRunning = false;
  clearInterval(timerInterval);
  clearTimeout(moleTimeout);
  moles.forEach(m => m.classList.remove('up'));
  
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('whackamoleHighScore', highScore);
    highScoreEl.textContent = highScore;
  }
  
  startBtn.disabled = false;
  startBtn.textContent = 'Play Again';
}

moles.forEach(mole => mole.addEventListener('click', whack));
startBtn.addEventListener('click', startGame);
