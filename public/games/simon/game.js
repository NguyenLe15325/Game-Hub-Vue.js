const buttons = document.querySelectorAll('.simon-btn');
const levelEl = document.getElementById('level');
const highScoreEl = document.getElementById('highScore');
const messageEl = document.getElementById('message');
const centerText = document.getElementById('centerText');
const startBtn = document.getElementById('startBtn');

const colors = ['green', 'red', 'yellow', 'blue'];
const sounds = {};

// Create audio context for sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const frequencies = { green: 392, red: 330, yellow: 262, blue: 220 };

function playSound(color) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = frequencies[color];
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.3);
}

let sequence = [];
let playerIndex = 0;
let level = 0;
let gameRunning = false;
let canClick = false;

let highScore = localStorage.getItem('simonHighScore') || 0;
highScoreEl.textContent = highScore;

function flashButton(color, duration = 300) {
  return new Promise(resolve => {
    const btn = document.getElementById(color);
    btn.classList.add('active');
    playSound(color);
    setTimeout(() => {
      btn.classList.remove('active');
      setTimeout(resolve, 100);
    }, duration);
  });
}

async function playSequence() {
  canClick = false;
  messageEl.textContent = 'Watch the pattern...';
  messageEl.className = 'message watching';
  centerText.textContent = 'WATCH';
  
  await new Promise(r => setTimeout(r, 500));
  
  for (const color of sequence) {
    await flashButton(color);
  }
  
  canClick = true;
  playerIndex = 0;
  messageEl.textContent = 'Your turn!';
  messageEl.className = 'message your-turn';
  centerText.textContent = 'GO!';
}

function nextLevel() {
  level++;
  levelEl.textContent = level;
  sequence.push(colors[Math.floor(Math.random() * 4)]);
  setTimeout(playSequence, 1000);
}

function handleClick(color) {
  if (!canClick || !gameRunning) return;
  
  flashButton(color, 200);
  
  if (color === sequence[playerIndex]) {
    playerIndex++;
    if (playerIndex === sequence.length) {
      canClick = false;
      messageEl.textContent = 'Correct! 🎉';
      centerText.textContent = '✓';
      nextLevel();
    }
  } else {
    gameOver();
  }
}

function gameOver() {
  gameRunning = false;
  canClick = false;
  messageEl.textContent = `Game Over! You reached level ${level}`;
  messageEl.className = 'message wrong';
  centerText.textContent = '✗';
  
  if (level > highScore) {
    highScore = level;
    localStorage.setItem('simonHighScore', highScore);
    highScoreEl.textContent = highScore;
  }
  
  // Flash all buttons red
  buttons.forEach(btn => {
    btn.style.background = '#ef4444';
    setTimeout(() => {
      btn.style.background = '';
    }, 500);
  });
  
  startBtn.textContent = 'Play Again';
  startBtn.disabled = false;
}

function startGame() {
  sequence = [];
  level = 0;
  playerIndex = 0;
  gameRunning = true;
  levelEl.textContent = '0';
  startBtn.textContent = 'Playing...';
  startBtn.disabled = true;
  centerText.textContent = 'SIMON';
  
  nextLevel();
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => handleClick(btn.dataset.color));
});

startBtn.addEventListener('click', startGame);
