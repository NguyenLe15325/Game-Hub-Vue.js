const words = {
    animals: [
        { word: 'ELEPHANT', hint: 'Largest land animal' },
        { word: 'GIRAFFE', hint: 'Tallest animal' },
        { word: 'PENGUIN', hint: 'Cannot fly but swims' },
        { word: 'DOLPHIN', hint: 'Intelligent sea mammal' },
        { word: 'KANGAROO', hint: 'Hops and has a pouch' },
        { word: 'BUTTERFLY', hint: 'Beautiful flying insect' },
        { word: 'CROCODILE', hint: 'Dangerous reptile' },
        { word: 'SQUIRREL', hint: 'Collects nuts' },
        { word: 'CHEETAH', hint: 'Fastest land animal' },
        { word: 'OCTOPUS', hint: 'Eight arms' }
    ],
    countries: [
        { word: 'AUSTRALIA', hint: 'Land down under' },
        { word: 'BRAZIL', hint: 'Famous for carnival' },
        { word: 'CANADA', hint: 'Maple leaf flag' },
        { word: 'GERMANY', hint: 'Known for cars' },
        { word: 'JAPAN', hint: 'Land of the rising sun' },
        { word: 'MEXICO', hint: 'Famous for tacos' },
        { word: 'EGYPT', hint: 'Home of pyramids' },
        { word: 'FRANCE', hint: 'Eiffel Tower' },
        { word: 'INDIA', hint: 'Taj Mahal' },
        { word: 'ITALY', hint: 'Pizza originated here' }
    ],
    foods: [
        { word: 'SPAGHETTI', hint: 'Italian pasta dish' },
        { word: 'HAMBURGER', hint: 'Fast food classic' },
        { word: 'CHOCOLATE', hint: 'Sweet brown treat' },
        { word: 'SANDWICH', hint: 'Between two slices' },
        { word: 'BROCCOLI', hint: 'Green vegetable' },
        { word: 'PINEAPPLE', hint: 'Tropical fruit' },
        { word: 'PANCAKES', hint: 'Breakfast favorite' },
        { word: 'MUSHROOM', hint: 'Fungus we eat' },
        { word: 'AVOCADO', hint: 'Green and creamy' },
        { word: 'STRAWBERRY', hint: 'Red berry' }
    ],
    sports: [
        { word: 'BASKETBALL', hint: 'Hoops and dunks' },
        { word: 'FOOTBALL', hint: 'Touchdown sport' },
        { word: 'SWIMMING', hint: 'Water sport' },
        { word: 'TENNIS', hint: 'Racket sport' },
        { word: 'BASEBALL', hint: 'Home runs' },
        { word: 'VOLLEYBALL', hint: 'Beach or court' },
        { word: 'GYMNASTICS', hint: 'Flips and balance' },
        { word: 'WRESTLING', hint: 'Grappling sport' },
        { word: 'BADMINTON', hint: 'Shuttlecock sport' },
        { word: 'ARCHERY', hint: 'Bow and arrow' }
    ]
};

let currentWord = '';
let currentHint = '';
let guessedLetters = [];
let wrongGuesses = 0;
let maxWrong = 6;
let category = 'animals';
let wins = parseInt(localStorage.getItem('hangmanWins')) || 0;
let losses = parseInt(localStorage.getItem('hangmanLosses')) || 0;
let gameOver = false;
let hintUsed = false;

const wordDisplay = document.getElementById('wordDisplay');
const wrongLettersDisplay = document.getElementById('wrongLetters');
const keyboard = document.getElementById('keyboard');
const hintDisplay = document.getElementById('hint');
const winsDisplay = document.getElementById('wins');
const lossesDisplay = document.getElementById('losses');

winsDisplay.textContent = wins;
lossesDisplay.textContent = losses;

// Create keyboard
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
letters.split('').forEach(letter => {
    const key = document.createElement('button');
    key.className = 'key';
    key.textContent = letter;
    key.addEventListener('click', () => guessLetter(letter));
    keyboard.appendChild(key);
});

// Category buttons
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        category = btn.dataset.cat;
        newGame();
    });
});

document.getElementById('newGameBtn').addEventListener('click', newGame);
document.getElementById('hintBtn').addEventListener('click', showHint);

// Keyboard input
document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    if (letters.includes(key) && !gameOver) {
        guessLetter(key);
    }
});

function newGame() {
    // Remove overlay if exists
    const overlay = document.querySelector('.game-over-overlay');
    if (overlay) overlay.remove();
    
    // Reset game state
    const wordObj = words[category][Math.floor(Math.random() * words[category].length)];
    currentWord = wordObj.word;
    currentHint = wordObj.hint;
    guessedLetters = [];
    wrongGuesses = 0;
    gameOver = false;
    hintUsed = false;
    hintDisplay.textContent = '';
    
    // Reset keyboard
    document.querySelectorAll('.key').forEach(key => {
        key.disabled = false;
        key.classList.remove('correct', 'wrong');
    });
    
    // Reset hangman
    document.querySelectorAll('.body-part').forEach(part => {
        part.classList.remove('show');
    });
    
    updateDisplay();
}

function guessLetter(letter) {
    if (gameOver || guessedLetters.includes(letter)) return;
    
    guessedLetters.push(letter);
    const keyBtn = [...document.querySelectorAll('.key')].find(k => k.textContent === letter);
    keyBtn.disabled = true;
    
    if (currentWord.includes(letter)) {
        keyBtn.classList.add('correct');
    } else {
        keyBtn.classList.add('wrong');
        wrongGuesses++;
        showBodyPart(wrongGuesses);
    }
    
    updateDisplay();
    checkGameEnd();
}

function showBodyPart(num) {
    const parts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
    if (num <= parts.length) {
        document.querySelector(`.${parts[num - 1]}`).classList.add('show');
    }
}

function updateDisplay() {
    // Update word display
    wordDisplay.innerHTML = '';
    currentWord.split('').forEach(letter => {
        const box = document.createElement('div');
        box.className = 'letter-box';
        if (guessedLetters.includes(letter)) {
            box.textContent = letter;
            box.classList.add('revealed');
        }
        wordDisplay.appendChild(box);
    });
    
    // Update wrong letters
    const wrongLetters = guessedLetters.filter(l => !currentWord.includes(l));
    wrongLettersDisplay.textContent = wrongLetters.length > 0 ? 
        `Wrong: ${wrongLetters.join(' ')}` : '';
}

function showHint() {
    if (!hintUsed && !gameOver) {
        hintDisplay.textContent = `💡 Hint: ${currentHint}`;
        hintUsed = true;
    }
}

function checkGameEnd() {
    // Check win
    const allLettersGuessed = currentWord.split('').every(l => guessedLetters.includes(l));
    
    if (allLettersGuessed) {
        gameOver = true;
        wins++;
        localStorage.setItem('hangmanWins', wins);
        winsDisplay.textContent = wins;
        showResult(true);
    } else if (wrongGuesses >= maxWrong) {
        gameOver = true;
        losses++;
        localStorage.setItem('hangmanLosses', losses);
        lossesDisplay.textContent = losses;
        showResult(false);
    }
}

function showResult(won) {
    const overlay = document.createElement('div');
    overlay.className = 'game-over-overlay';
    overlay.innerHTML = `
        <div class="result-text ${won ? 'win' : 'lose'}">
            ${won ? '🎉 You Won!' : '💀 Game Over!'}
        </div>
        <div class="answer-reveal">
            The word was: <span>${currentWord}</span>
        </div>
        <button class="btn" onclick="newGame()">Play Again</button>
    `;
    document.body.appendChild(overlay);
}

// Start game
newGame();
