const colors = [
    { name: 'RED', hex: '#ff4444' },
    { name: 'BLUE', hex: '#4444ff' },
    { name: 'GREEN', hex: '#44ff44' },
    { name: 'YELLOW', hex: '#ffff44' },
    { name: 'PURPLE', hex: '#ff44ff' },
    { name: 'ORANGE', hex: '#ff8844' },
    { name: 'CYAN', hex: '#44ffff' },
    { name: 'PINK', hex: '#ff88cc' }
];

let score = 0;
let timeLeft = 30;
let gameRunning = false;
let timer = null;
let currentWord = '';
let currentColor = '';
let isMatch = false;
let highScore = localStorage.getItem('colorMatchHigh') || 0;

const colorWord = document.getElementById('colorWord');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const highScoreDisplay = document.getElementById('highScore');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const startBtn = document.getElementById('startBtn');

highScoreDisplay.textContent = highScore;

// Event listeners
startBtn.addEventListener('click', startGame);
yesBtn.addEventListener('click', () => answer(true));
noBtn.addEventListener('click', () => answer(false));

document.addEventListener('keydown', (e) => {
    if (!gameRunning) {
        if (e.code === 'Space') {
            e.preventDefault();
            startGame();
        }
        return;
    }
    
    if (e.key === 'ArrowLeft' || e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        answer(true);
    } else if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        answer(false);
    }
});

function startGame() {
    // Remove any overlay
    const overlay = document.querySelector('.game-over');
    if (overlay) overlay.remove();
    
    score = 0;
    timeLeft = 30;
    gameRunning = true;
    
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    startBtn.textContent = 'Playing...';
    
    yesBtn.classList.add('active');
    noBtn.classList.add('active');
    
    generateQuestion();
    startTimer();
}

function generateQuestion() {
    // Pick random word
    const wordIndex = Math.floor(Math.random() * colors.length);
    currentWord = colors[wordIndex].name;
    
    // Decide if match or not (50/50)
    isMatch = Math.random() < 0.5;
    
    if (isMatch) {
        currentColor = colors[wordIndex].hex;
    } else {
        // Pick different color
        let colorIndex;
        do {
            colorIndex = Math.floor(Math.random() * colors.length);
        } while (colorIndex === wordIndex);
        currentColor = colors[colorIndex].hex;
    }
    
    colorWord.textContent = currentWord;
    colorWord.style.color = currentColor;
}

function answer(playerSaidYes) {
    if (!gameRunning) return;
    
    const correct = (playerSaidYes === isMatch);
    const btn = playerSaidYes ? yesBtn : noBtn;
    
    if (correct) {
        score++;
        scoreDisplay.textContent = score;
        btn.classList.add('correct');
        setTimeout(() => btn.classList.remove('correct'), 200);
    } else {
        // Penalty: lose 2 seconds
        timeLeft = Math.max(0, timeLeft - 2);
        timeDisplay.textContent = timeLeft;
        btn.classList.add('wrong');
        setTimeout(() => btn.classList.remove('wrong'), 200);
    }
    
    generateQuestion();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    gameRunning = false;
    startBtn.textContent = 'Play Again';
    
    yesBtn.classList.remove('active');
    noBtn.classList.remove('active');
    colorWord.textContent = 'GAME OVER';
    colorWord.style.color = '#ff6b6b';
    
    let isNewRecord = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('colorMatchHigh', highScore);
        highScoreDisplay.textContent = highScore;
        isNewRecord = true;
    }
    
    // Show game over overlay
    const overlay = document.createElement('div');
    overlay.className = 'game-over';
    overlay.innerHTML = `
        <div class="game-over-text">⏱️ Time's Up!</div>
        <div class="final-score">Final Score: ${score}</div>
        ${isNewRecord ? '<div class="new-record">🎉 New High Score! 🎉</div>' : ''}
        <button class="btn" onclick="startGame()">Play Again</button>
    `;
    document.body.appendChild(overlay);
}
