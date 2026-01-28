// Games database - easily extendable
export const games = [
  {
    id: 'snake',
    title: 'Snake Classic',
    description: 'Classic snake game. Eat food, grow longer, avoid walls and yourself!',
    thumbnail: '/games/snake/thumbnail.svg',
    category: 'arcade',
    tags: ['classic', 'arcade', 'casual'],
    plays: 15420,
    rating: 4.5,
    featured: true
  },
  {
    id: 'tetris',
    title: 'Block Puzzle',
    description: 'Arrange falling blocks to complete lines. How long can you survive?',
    thumbnail: '/games/tetris/thumbnail.svg',
    category: 'puzzle',
    tags: ['puzzle', 'classic', 'strategy'],
    plays: 23150,
    rating: 4.8,
    featured: true
  },
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Test your memory by matching pairs of cards. Train your brain!',
    thumbnail: '/games/memory/thumbnail.svg',
    category: 'puzzle',
    tags: ['puzzle', 'memory', 'casual'],
    plays: 8930,
    rating: 4.3,
    featured: false
  },
  {
    id: 'pong',
    title: 'Pong Battle',
    description: 'The original arcade classic. Beat the AI in this ping-pong showdown!',
    thumbnail: '/games/pong/thumbnail.svg',
    category: 'arcade',
    tags: ['classic', 'arcade', 'sports', 'multiplayer'],
    plays: 12680,
    rating: 4.2,
    featured: true
  },
  {
    id: 'breakout',
    title: 'Brick Breaker',
    description: 'Destroy all bricks with your bouncing ball. Classic breakout action!',
    thumbnail: '/games/breakout/thumbnail.svg',
    category: 'arcade',
    tags: ['classic', 'arcade', 'action'],
    plays: 9840,
    rating: 4.4,
    featured: false
  },
  {
    id: 'flappy',
    title: 'Flappy Jump',
    description: 'Navigate through obstacles by jumping at the right moment!',
    thumbnail: '/games/flappy/thumbnail.svg',
    category: 'arcade',
    tags: ['arcade', 'casual', 'endless'],
    plays: 31200,
    rating: 4.1,
    featured: true
  },
  {
    id: '2048',
    title: '2048',
    description: 'Slide tiles and combine numbers to reach 2048. Addictive puzzle game!',
    thumbnail: '/games/2048/thumbnail.svg',
    category: 'puzzle',
    tags: ['puzzle', 'numbers', 'strategy', 'brain'],
    plays: 45200,
    rating: 4.7,
    featured: true
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    description: 'Classic X and O game. Play against a friend or the computer!',
    thumbnail: '/games/tictactoe/thumbnail.svg',
    category: 'puzzle',
    tags: ['classic', 'strategy', 'multiplayer', '2player'],
    plays: 18300,
    rating: 4.0,
    featured: false,
    multiplayer: true
  },
  {
    id: 'connect4',
    title: 'Connect Four',
    description: 'Drop discs to connect four in a row. Challenge a friend or AI!',
    thumbnail: '/games/connect4/thumbnail.svg',
    category: 'puzzle',
    tags: ['strategy', 'multiplayer', '2player', 'classic'],
    plays: 22100,
    rating: 4.5,
    featured: true,
    multiplayer: true
  },
  {
    id: 'spaceinvaders',
    title: 'Space Invaders',
    description: 'Defend Earth from alien invasion! Shoot down waves of enemies.',
    thumbnail: '/games/spaceinvaders/thumbnail.svg',
    category: 'action',
    tags: ['shooter', 'classic', 'arcade', 'action'],
    plays: 28400,
    rating: 4.6,
    featured: true
  },
  {
    id: 'whackamole',
    title: 'Whack-a-Mole',
    description: 'Test your reflexes! Click moles as fast as they pop up.',
    thumbnail: '/games/whackamole/thumbnail.svg',
    category: 'arcade',
    tags: ['arcade', 'reflex', 'casual', 'fun'],
    plays: 16800,
    rating: 4.2,
    featured: false
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    description: 'Classic bomb-sweeping puzzle. Use logic to avoid the mines!',
    thumbnail: '/games/minesweeper/thumbnail.svg',
    category: 'puzzle',
    tags: ['puzzle', 'logic', 'classic', 'strategy'],
    plays: 19500,
    rating: 4.4,
    featured: false
  },
  {
    id: 'typing',
    title: 'Typing Speed Test',
    description: 'Test and improve your typing speed. How fast can you type?',
    thumbnail: '/games/typing/thumbnail.svg',
    category: 'education',
    tags: ['educational', 'typing', 'skill', 'test'],
    plays: 12400,
    rating: 4.3,
    featured: false
  },
  {
    id: 'checkers',
    title: 'Checkers',
    description: 'Classic board game. Jump over opponents to win! 2 player mode.',
    thumbnail: '/games/checkers/thumbnail.svg',
    category: 'puzzle',
    tags: ['board', 'strategy', 'multiplayer', '2player', 'classic'],
    plays: 14200,
    rating: 4.4,
    featured: true,
    multiplayer: true
  },
  {
    id: 'rps',
    title: 'Rock Paper Scissors',
    description: 'The timeless hand game. Beat the computer in best of series!',
    thumbnail: '/games/rps/thumbnail.svg',
    category: 'arcade',
    tags: ['casual', 'classic', 'quick', 'fun'],
    plays: 21000,
    rating: 3.9,
    featured: false
  },
  {
    id: 'racing',
    title: 'Car Racing',
    description: 'Race through traffic! Dodge cars and survive as long as you can.',
    thumbnail: '/games/racing/thumbnail.svg',
    category: 'racing',
    tags: ['racing', 'cars', 'endless', 'action'],
    plays: 25600,
    rating: 4.3,
    featured: true
  },
  {
    id: 'simon',
    title: 'Simon Says',
    description: 'Memory pattern game. Watch, remember, and repeat the sequence!',
    thumbnail: '/games/simon/thumbnail.svg',
    category: 'puzzle',
    tags: ['memory', 'pattern', 'classic', 'brain'],
    plays: 11800,
    rating: 4.2,
    featured: false
  },
  {
    id: 'battleship',
    title: 'Battleship',
    description: 'Naval combat strategy game. Sink enemy ships before they sink yours!',
    thumbnail: '/games/battleship/thumbnail.svg',
    category: 'strategy',
    tags: ['strategy', 'board', 'classic', 'naval'],
    plays: 17300,
    rating: 4.5,
    featured: true
  },
  {
    id: 'wordscramble',
    title: 'Word Scramble',
    description: 'Unscramble letters to form words. Test your vocabulary!',
    thumbnail: '/games/wordscramble/thumbnail.svg',
    category: 'education',
    tags: ['word', 'educational', 'vocabulary', 'puzzle'],
    plays: 9800,
    rating: 4.1,
    featured: false
  },
  {
    id: 'airhockey',
    title: 'Air Hockey',
    description: 'Fast-paced table hockey! Play against a friend or computer.',
    thumbnail: '/games/airhockey/thumbnail.svg',
    category: 'sports',
    tags: ['sports', 'multiplayer', '2player', 'action'],
    plays: 20100,
    rating: 4.6,
    featured: true,
    multiplayer: true
  },
  {
    id: 'pingpong2p',
    title: 'Ping Pong 2P',
    description: 'Classic ping pong for two players! First to 10 wins!',
    thumbnail: '/games/pingpong2p/thumbnail.svg',
    category: 'sports',
    tags: ['sports', 'multiplayer', '2player', 'classic', 'local'],
    plays: 18500,
    rating: 4.7,
    featured: true,
    multiplayer: true
  },
  {
    id: 'dino',
    title: 'Dino Runner',
    description: 'Chrome dinosaur game! Jump over cacti and duck under birds.',
    thumbnail: '/games/dino/thumbnail.svg',
    category: 'arcade',
    tags: ['endless', 'runner', 'arcade', 'classic'],
    plays: 42000,
    rating: 4.5,
    featured: true
  },
  {
    id: 'slider',
    title: 'Puzzle Slider',
    description: 'Classic sliding puzzle. Arrange tiles in the correct order!',
    thumbnail: '/games/slider/thumbnail.svg',
    category: 'puzzle',
    tags: ['puzzle', 'classic', 'brain', 'logic'],
    plays: 11200,
    rating: 4.2,
    featured: false
  },
  {
    id: 'colormatch',
    title: 'Color Match',
    description: 'Does the color match the word? Test your reaction speed!',
    thumbnail: '/games/colormatch/thumbnail.svg',
    category: 'arcade',
    tags: ['reflex', 'brain', 'speed', 'fun'],
    plays: 15800,
    rating: 4.3,
    featured: false
  },
  {
    id: 'hangman',
    title: 'Hangman',
    description: 'Guess the word before the hangman is complete! Multiple categories.',
    thumbnail: '/games/hangman/thumbnail.svg',
    category: 'education',
    tags: ['word', 'classic', 'educational', 'vocabulary'],
    plays: 19400,
    rating: 4.4,
    featured: false
  },
  {
    id: 'maze',
    title: 'Maze Runner',
    description: 'Navigate through increasingly difficult mazes. Find the exit!',
    thumbnail: '/games/maze/thumbnail.svg',
    category: 'puzzle',
    tags: ['maze', 'puzzle', 'logic', 'adventure'],
    plays: 13600,
    rating: 4.3,
    featured: false
  }
]

export const categories = [
  { id: 'all', name: 'All Games', icon: '🎮' },
  { id: 'arcade', name: 'Arcade', icon: '👾' },
  { id: 'puzzle', name: 'Puzzle', icon: '🧩' },
  { id: 'action', name: 'Action', icon: '⚔️' },
  { id: 'strategy', name: 'Strategy', icon: '♟️' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'racing', name: 'Racing', icon: '🏎️' },
  { id: 'education', name: 'Educational', icon: '📚' },
  { id: 'multiplayer', name: 'Multiplayer', icon: '👥' }
]

export function getGameById(id) {
  return games.find(game => game.id === id)
}

export function getGamesByCategory(category) {
  if (category === 'all') return games
  if (category === 'multiplayer') return games.filter(game => game.multiplayer === true || game.tags.includes('multiplayer'))
  return games.filter(game => game.category === category)
}

export function getFeaturedGames() {
  return games.filter(game => game.featured)
}

export function getMultiplayerGames() {
  return games.filter(game => game.multiplayer === true)
}

export function searchGames(query) {
  const lowerQuery = query.toLowerCase()
  return games.filter(game => 
    game.title.toLowerCase().includes(lowerQuery) ||
    game.description.toLowerCase().includes(lowerQuery) ||
    game.tags.some(tag => tag.includes(lowerQuery))
  )
}
