const playerChoiceEl = document.getElementById('playerChoice');
const computerChoiceEl = document.getElementById('computerChoice');
const resultEl = document.getElementById('result');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const drawScoreEl = document.getElementById('drawScore');
const choiceBtns = document.querySelectorAll('.choice-btn');
const modeButtons = document.querySelectorAll('.btn-mode');
const resetBtn = document.getElementById('resetBtn');

const emojis = { rock: '✊', paper: '✋', scissors: '✌️' };
let scores = { player: 0, computer: 0, draw: 0 };
let gameMode = 'endless';
let roundsToWin = Infinity;

function play(playerChoice) {
  const choices = ['rock', 'paper', 'scissors'];
  const computerChoice = choices[Math.floor(Math.random() * 3)];
  
  // Animation
  playerChoiceEl.textContent = '❓';
  computerChoiceEl.textContent = '❓';
  playerChoiceEl.classList.add('shake');
  computerChoiceEl.classList.add('shake');
  playerChoiceEl.classList.remove('win', 'lose');
  computerChoiceEl.classList.remove('win', 'lose');
  resultEl.textContent = '';
  resultEl.className = 'result';
  
  setTimeout(() => {
    playerChoiceEl.classList.remove('shake');
    computerChoiceEl.classList.remove('shake');
    playerChoiceEl.textContent = emojis[playerChoice];
    computerChoiceEl.textContent = emojis[computerChoice];
    
    const result = getResult(playerChoice, computerChoice);
    
    if (result === 'win') {
      scores.player++;
      resultEl.textContent = 'You Win! 🎉';
      resultEl.className = 'result win';
      playerChoiceEl.classList.add('win');
      computerChoiceEl.classList.add('lose');
    } else if (result === 'lose') {
      scores.computer++;
      resultEl.textContent = 'You Lose! 😢';
      resultEl.className = 'result lose';
      playerChoiceEl.classList.add('lose');
      computerChoiceEl.classList.add('win');
    } else {
      scores.draw++;
      resultEl.textContent = "It's a Draw! 🤝";
      resultEl.className = 'result draw';
    }
    
    updateScores();
    checkGameOver();
  }, 500);
}

function getResult(player, computer) {
  if (player === computer) return 'draw';
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')
  ) {
    return 'win';
  }
  return 'lose';
}

function updateScores() {
  playerScoreEl.textContent = scores.player;
  computerScoreEl.textContent = scores.computer;
  drawScoreEl.textContent = scores.draw;
}

function checkGameOver() {
  if (gameMode === 'endless') return;
  
  if (scores.player >= roundsToWin) {
    resultEl.textContent = '🏆 You Win the Match! 🏆';
    disableButtons();
  } else if (scores.computer >= roundsToWin) {
    resultEl.textContent = '😢 Computer Wins the Match! 😢';
    disableButtons();
  }
}

function disableButtons() {
  choiceBtns.forEach(btn => btn.disabled = true);
  setTimeout(() => {
    resetScores();
    choiceBtns.forEach(btn => btn.disabled = false);
  }, 2000);
}

function resetScores() {
  scores = { player: 0, computer: 0, draw: 0 };
  updateScores();
  playerChoiceEl.textContent = '❓';
  computerChoiceEl.textContent = '❓';
  playerChoiceEl.classList.remove('win', 'lose');
  computerChoiceEl.classList.remove('win', 'lose');
  resultEl.textContent = '';
  resultEl.className = 'result';
}

function setMode(mode) {
  gameMode = mode;
  switch (mode) {
    case 'best3': roundsToWin = 2; break;
    case 'best5': roundsToWin = 3; break;
    default: roundsToWin = Infinity;
  }
  modeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
  resetScores();
}

choiceBtns.forEach(btn => {
  btn.addEventListener('click', () => play(btn.dataset.choice));
});

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => setMode(btn.dataset.mode));
});

resetBtn.addEventListener('click', resetScores);
