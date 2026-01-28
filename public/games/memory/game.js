// Memory Match Game
// Can run standalone with Live Server

const gameBoard = document.getElementById('gameBoard');
const startBtn = document.getElementById('startBtn');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const matchesEl = document.getElementById('matches');

// Card emojis (8 pairs)
const EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎢', '🎡', '🎠'];

// Game State
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = null;
let seconds = 0;
let isLocked = false;

// Shuffle array
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create cards
function createCards() {
  const pairs = [...EMOJIS, ...EMOJIS];
  cards = shuffle(pairs);
  
  gameBoard.innerHTML = '';
  
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    
    card.innerHTML = `
      <div class="card-face card-front"></div>
      <div class="card-face card-back">${emoji}</div>
    `;
    
    card.addEventListener('click', () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

// Flip card
function flipCard(card) {
  if (isLocked) return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;
  if (flippedCards.length >= 2) return;
  
  card.classList.add('flipped');
  flippedCards.push(card);
  
  if (flippedCards.length === 2) {
    moves++;
    movesEl.textContent = moves;
    checkMatch();
  }
}

// Check for match
function checkMatch() {
  const [card1, card2] = flippedCards;
  const match = card1.dataset.emoji === card2.dataset.emoji;
  
  if (match) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    matchesEl.textContent = matchedPairs;
    flippedCards = [];
    
    if (matchedPairs === EMOJIS.length) {
      setTimeout(gameWon, 500);
    }
  } else {
    isLocked = true;
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      isLocked = false;
    }, 1000);
  }
}

// Start timer
function startTimer() {
  seconds = 0;
  timer = setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  }, 1000);
}

// Stop timer
function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

// Game won
function gameWon() {
  stopTimer();
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="trophy">🏆</div>
      <h2>You Won!</h2>
      <p class="stats">Moves: ${moves}</p>
      <p class="stats">Time: ${timerEl.textContent}</p>
      <button class="btn btn-primary" onclick="this.closest('.modal').remove(); startGame();">
        Play Again
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
}

// Start game
function startGame() {
  stopTimer();
  moves = 0;
  matchedPairs = 0;
  flippedCards = [];
  isLocked = false;
  
  movesEl.textContent = '0';
  matchesEl.textContent = '0';
  timerEl.textContent = '0:00';
  
  createCards();
  startTimer();
  
  startBtn.textContent = 'Restart';
}

// Event listeners
startBtn.addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r') {
    startGame();
  }
});

// Initial setup
createCards();
