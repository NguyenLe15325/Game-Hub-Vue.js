const textDisplay = document.getElementById('textDisplay');
const inputArea = document.getElementById('inputArea');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const durationSelect = document.getElementById('duration');
const resultsDiv = document.getElementById('results');

const texts = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
  "Programming is the art of telling a computer what to do through a set of instructions.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do. If you haven't found it, keep looking.",
  "In the middle of difficulty lies opportunity. Life is what happens when you're busy making plans.",
  "Technology is best when it brings people together. Innovation distinguishes leaders from followers.",
  "The future belongs to those who believe in the beauty of their dreams. Stay hungry, stay foolish.",
  "Code is like humor. When you have to explain it, it's bad. Simple is better than complex.",
  "Every moment is a fresh beginning. The secret of getting ahead is getting started today.",
  "Learning never exhausts the mind. The more that you read, the more things you will know."
];

let currentText = '';
let charIndex = 0;
let errors = 0;
let totalTyped = 0;
let timeLeft = 60;
let timerInterval;
let gameRunning = false;

function getRandomText() {
  const shuffled = [...texts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).join(' ');
}

function renderText() {
  textDisplay.innerHTML = currentText.split('').map((char, i) => {
    let className = '';
    if (i < charIndex) {
      className = inputArea.value[i] === char ? 'correct' : 'incorrect';
    } else if (i === charIndex) {
      className = 'current';
    }
    return `<span class="${className}">${char}</span>`;
  }).join('');
}

function startGame() {
  currentText = getRandomText();
  charIndex = 0;
  errors = 0;
  totalTyped = 0;
  timeLeft = parseInt(durationSelect.value);
  gameRunning = true;
  
  inputArea.value = '';
  inputArea.disabled = false;
  inputArea.focus();
  
  resultsDiv.style.display = 'none';
  timerEl.textContent = timeLeft;
  wpmEl.textContent = '0';
  accuracyEl.textContent = '100';
  
  renderText();
  startBtn.textContent = 'Restart';
  
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    updateStats();
    
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function updateStats() {
  const duration = parseInt(durationSelect.value);
  const timeElapsed = (duration - timeLeft) / 60;
  const wordsTyped = inputArea.value.trim().split(/\s+/).filter(w => w).length;
  const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
  const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
  
  wpmEl.textContent = wpm;
  accuracyEl.textContent = Math.max(0, accuracy);
}

function endGame() {
  gameRunning = false;
  clearInterval(timerInterval);
  inputArea.disabled = true;
  
  const duration = parseInt(durationSelect.value);
  const timeElapsed = duration / 60;
  const wordsTyped = inputArea.value.trim().split(/\s+/).filter(w => w).length;
  const wpm = Math.round(wordsTyped / timeElapsed);
  const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
  
  document.getElementById('finalWpm').textContent = wpm;
  document.getElementById('finalAccuracy').textContent = Math.max(0, accuracy) + '%';
  document.getElementById('finalChars').textContent = totalTyped;
  document.getElementById('finalErrors').textContent = errors;
  
  resultsDiv.style.display = 'block';
  startBtn.textContent = 'Try Again';
}

inputArea.addEventListener('input', (e) => {
  if (!gameRunning) return;
  
  const typed = e.target.value;
  charIndex = typed.length;
  totalTyped = typed.length;
  
  // Count errors
  errors = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== currentText[i]) errors++;
  }
  
  renderText();
  updateStats();
  
  // Check if completed
  if (typed.length >= currentText.length) {
    endGame();
  }
});

inputArea.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') e.preventDefault();
});

startBtn.addEventListener('click', startGame);

// Initial render
textDisplay.innerHTML = '<span style="color: #6b7280;">Click "Start Test" to begin...</span>';
