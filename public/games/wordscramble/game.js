const scrambledWordEl = document.getElementById('scrambledWord');
const guessInput = document.getElementById('guessInput');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const streakEl = document.getElementById('streak');
const hintEl = document.getElementById('hint');
const startBtn = document.getElementById('startBtn');
const skipBtn = document.getElementById('skipBtn');
const hintBtn = document.getElementById('hintBtn');

const words = [
  { word: 'javascript', hint: 'Programming language for web' },
  { word: 'computer', hint: 'Electronic device for computing' },
  { word: 'keyboard', hint: 'Input device with keys' },
  { word: 'internet', hint: 'Global network of computers' },
  { word: 'algorithm', hint: 'Step-by-step problem solving' },
  { word: 'database', hint: 'Organized collection of data' },
  { word: 'function', hint: 'Reusable block of code' },
  { word: 'variable', hint: 'Container for storing data' },
  { word: 'software', hint: 'Programs running on computer' },
  { word: 'hardware', hint: 'Physical computer components' },
  { word: 'network', hint: 'Connected computers' },
  { word: 'browser', hint: 'Software for viewing websites' },
  { word: 'password', hint: 'Secret access code' },
  { word: 'download', hint: 'Transfer data to device' },
  { word: 'upload', hint: 'Transfer data from device' },
  { word: 'program', hint: 'Set of instructions' },
  { word: 'memory', hint: 'Data storage in computer' },
  { word: 'display', hint: 'Visual output device' },
  { word: 'server', hint: 'Computer that serves data' },
  { word: 'coding', hint: 'Writing computer programs' },
  { word: 'python', hint: 'Snake-named programming language' },
  { word: 'website', hint: 'Collection of web pages' },
  { word: 'digital', hint: 'Electronic numeric data' },
  { word: 'mobile', hint: 'Portable device' },
  { word: 'gaming', hint: 'Playing video games' }
];

let currentWord = null;
let score = 0;
let streak = 0;
let timeLeft = 60;
let gameRunning = false;
let timerInterval;
let hintUsed = false;

function scrambleWord(word) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Make sure it's actually scrambled
  if (arr.join('') === word) return scrambleWord(word);
  return arr.join('');
}

function displayScrambled(word) {
  scrambledWordEl.innerHTML = '';
  word.split('').forEach((letter, i) => {
    const letterEl = document.createElement('div');
    letterEl.className = 'letter';
    letterEl.textContent = letter;
    letterEl.style.animationDelay = `${i * 0.05}s`;
    scrambledWordEl.appendChild(letterEl);
  });
}

function nextWord() {
  const remaining = words.filter(w => w !== currentWord);
  currentWord = remaining[Math.floor(Math.random() * remaining.length)];
  const scrambled = scrambleWord(currentWord.word);
  displayScrambled(scrambled);
  hintEl.textContent = '';
  hintUsed = false;
  guessInput.value = '';
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
}

function checkAnswer() {
  const guess = guessInput.value.toLowerCase().trim();
  if (!guess) return;
  
  if (guess === currentWord.word) {
    const points = hintUsed ? 7 : 10;
    score += points + streak;
    streak++;
    scoreEl.textContent = score;
    streakEl.textContent = streak;
    feedbackEl.textContent = `Correct! +${points + streak - 1} points 🎉`;
    feedbackEl.className = 'feedback correct';
    setTimeout(nextWord, 1000);
  } else {
    streak = 0;
    streakEl.textContent = streak;
    feedbackEl.textContent = 'Wrong! Try again';
    feedbackEl.className = 'feedback wrong';
    guessInput.value = '';
  }
}

function showHint() {
  if (hintUsed) return;
  hintUsed = true;
  score = Math.max(0, score - 3);
  scoreEl.textContent = score;
  hintEl.textContent = `Hint: ${currentWord.hint}`;
}

function skipWord() {
  score = Math.max(0, score - 5);
  scoreEl.textContent = score;
  streak = 0;
  streakEl.textContent = streak;
  feedbackEl.textContent = `Skipped! The word was: ${currentWord.word.toUpperCase()}`;
  feedbackEl.className = 'feedback wrong';
  setTimeout(nextWord, 1500);
}

function startGame() {
  score = 0;
  streak = 0;
  timeLeft = 60;
  gameRunning = true;
  
  scoreEl.textContent = '0';
  streakEl.textContent = '0';
  timerEl.textContent = '60';
  
  guessInput.disabled = false;
  skipBtn.disabled = false;
  hintBtn.disabled = false;
  startBtn.textContent = 'Playing...';
  startBtn.disabled = true;
  
  guessInput.focus();
  nextWord();
  
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(timerInterval);
  
  guessInput.disabled = true;
  skipBtn.disabled = true;
  hintBtn.disabled = true;
  startBtn.disabled = false;
  startBtn.textContent = 'Play Again';
  
  scrambledWordEl.innerHTML = '';
  feedbackEl.textContent = `Time's up! Final Score: ${score}`;
  feedbackEl.className = 'feedback';
  hintEl.textContent = '';
}

guessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && gameRunning) {
    checkAnswer();
  }
});

startBtn.addEventListener('click', startGame);
skipBtn.addEventListener('click', () => gameRunning && skipWord());
hintBtn.addEventListener('click', () => gameRunning && showHint());
