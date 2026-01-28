# 🎮 Game Hub Vue

A professional game portal built with Vue 3 + Vite, featuring 26+ standalone HTML5 games. Similar to Y8 or other game websites, with a modern dark theme UI.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

## 🌐 Live Demo

**[Play Now on GitHub Pages](https://nguyenle15325.github.io/Game-Hub-Vue.js/)**

## ✨ Features

- 🎯 **26+ Games** - Arcade, Puzzle, Action, Sports, Racing, Educational
- 👥 **Multiplayer Support** - Local 2-player games (Ping Pong, Air Hockey, Checkers, etc.)
- 🎨 **Modern Dark Theme** - Beautiful gradient UI with glowing effects
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔍 **Search & Filter** - Find games by name or category
- ⭐ **Featured Games** - Highlighted popular games
- 💾 **High Scores** - Persistent scores using localStorage
- 🎮 **Standalone Games** - Each game runs independently with vanilla JS

## 🎮 Game List

| Category | Games |
|----------|-------|
| **Arcade** | Snake, Pong, Breakout, Flappy Jump, Space Invaders, Whack-a-Mole, Dino Runner, Color Match, Rock Paper Scissors |
| **Puzzle** | Tetris, Memory Match, 2048, Tic Tac Toe, Connect Four, Minesweeper, Checkers, Simon Says, Puzzle Slider, Maze Runner |
| **Sports** | Air Hockey, Ping Pong 2P |
| **Racing** | Car Racing |
| **Strategy** | Battleship |
| **Educational** | Typing Speed Test, Word Scramble, Hangman |

### 👥 Multiplayer Games (Local 2-Player)
- **Ping Pong 2P** - Player 1: W/S | Player 2: ↑/↓
- **Air Hockey** - Player 1: WASD | Player 2: Arrow Keys
- **Tic Tac Toe** - Turn-based
- **Connect Four** - Turn-based
- **Checkers** - Turn-based

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/NguyenLe15325/Game-Hub-Vue.js.git

# Navigate to project directory
cd Game-Hub-Vue.js

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
game-hub-vue/
├── public/
│   └── games/                    # All standalone games
│       ├── snake/
│       │   ├── index.html        # Game HTML
│       │   ├── style.css         # Game styles
│       │   ├── game.js           # Game logic
│       │   └── thumbnail.svg     # Game thumbnail
│       ├── tetris/
│       ├── memory/
│       └── ... (26 games)
├── src/
│   ├── assets/                   # Global styles
│   ├── components/               # Vue components
│   │   ├── Navbar.vue
│   │   ├── Sidebar.vue
│   │   ├── GameCard.vue
│   │   └── FeaturedGames.vue
│   ├── views/                    # Page views
│   │   ├── HomeView.vue
│   │   ├── GameView.vue
│   │   └── CategoryView.vue
│   ├── data/
│   │   └── games.js              # Games database
│   ├── router/
│   │   └── index.js              # Vue Router config
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
└── package.json
```

## 🎯 How to Add a New Game

### Step 1: Create Game Folder

Create a new folder in `public/games/` with your game name:

```
public/games/yourgame/
├── index.html
├── style.css
├── game.js
└── thumbnail.svg
```

### Step 2: Game HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Game - Game Hub</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="game-container">
        <a href="/" class="back-btn">← Back to Games</a>
        <h1>🎮 Your Game Title</h1>
        
        <div class="stats">
            <div class="stat">
                <span class="label">Score</span>
                <span id="score" class="value">0</span>
            </div>
        </div>
        
        <canvas id="gameCanvas" width="600" height="400"></canvas>
        
        <div class="controls">
            <button id="startBtn" class="btn">Start Game</button>
        </div>
        
        <div class="info">
            <p>Game instructions here</p>
        </div>
    </div>
    <script src="game.js"></script>
</body>
</html>
```

### Step 3: Game CSS Template

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    overflow: hidden;
    height: 100%;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.game-container {
    text-align: center;
}

.back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    color: #00d4ff;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.3s;
}

.back-btn:hover {
    color: #00ff88;
}

h1 {
    color: #fff;
    margin-bottom: 20px;
    font-size: 2rem;
    text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

.stats {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-bottom: 20px;
}

.stat {
    display: flex;
    flex-direction: column;
}

.label {
    color: #888;
    font-size: 0.9rem;
}

.value {
    color: #00d4ff;
    font-size: 2rem;
    font-weight: bold;
}

#gameCanvas {
    background: #0a0a0a;
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
}

.btn {
    padding: 15px 40px;
    font-size: 1.1rem;
    background: linear-gradient(135deg, #00d4ff, #00ff88);
    border: none;
    border-radius: 25px;
    color: #1a1a2e;
    cursor: pointer;
    font-weight: bold;
    margin-top: 20px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

.info {
    margin-top: 20px;
    color: #888;
}
```

### Step 4: Game JavaScript Template

```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let gameRunning = false;
let highScore = localStorage.getItem('yourgameHighScore') || 0;

// Prevent arrow keys from scrolling
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
    // Handle game input here
});

document.getElementById('startBtn').addEventListener('click', startGame);

function startGame() {
    gameRunning = true;
    score = 0;
    // Initialize game state
    gameLoop();
}

function update() {
    // Game logic here
}

function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw game elements
}

function gameLoop() {
    if (gameRunning) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

function gameOver() {
    gameRunning = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('yourgameHighScore', highScore);
    }
}

// Initial draw
draw();
```

### Step 5: Create Thumbnail (SVG)

Create a 100x100 SVG thumbnail:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#bg)" rx="15"/>
  <!-- Add your game icon/preview here -->
  <text x="50" y="55" text-anchor="middle" fill="#00d4ff" font-size="12">GAME</text>
</svg>
```

### Step 6: Register in Games Database

Add your game to `src/data/games.js`:

```javascript
{
  id: 'yourgame',           // Must match folder name
  title: 'Your Game',
  description: 'A brief description of your game.',
  thumbnail: '/games/yourgame/thumbnail.svg',
  category: 'arcade',       // arcade, puzzle, action, sports, racing, education, strategy
  tags: ['tag1', 'tag2', 'multiplayer'],  // Add 'multiplayer' for 2P games
  plays: 0,
  rating: 4.5,
  featured: false,          // Set true to show in featured section
  multiplayer: false        // Set true for 2-player games
}
```

## 🌐 Deploy to GitHub Pages

### Method 1: GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. Update `vite.config.js` for GitHub Pages:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/Game-Hub-Vue.js/',  // Your repo name
})
```

3. Push to GitHub and enable Pages in repository settings:
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

### Method 2: Manual Deploy

```bash
# Build the project
npm run build

# The dist folder contains the built files
# Upload contents of dist/ to your hosting service
```

## 🛠️ Customization

### Change Theme Colors

Edit `src/assets/main.css`:

```css
:root {
  --primary-color: #00d4ff;
  --secondary-color: #00ff88;
  --background-dark: #1a1a2e;
  --background-light: #16213e;
}
```

### Add New Category

In `src/data/games.js`, add to categories array:

```javascript
export const categories = [
  // ... existing categories
  { id: 'newcategory', name: 'New Category', icon: '🆕' }
]
```

### Modify Game Card Appearance

Edit `src/components/GameCard.vue`

### Change Layout

Edit `src/App.vue` and view files in `src/views/`

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewGame`)
3. Commit your changes (`git commit -m 'Add NewGame'`)
4. Push to the branch (`git push origin feature/NewGame`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- Icons from various emoji sets
- Inspired by Y8, Miniclip, and classic web game portals

---

⭐ **Star this repo if you like it!**

🎮 **[Play Now](https://nguyenle15325.github.io/Game-Hub-Vue.js/)**
