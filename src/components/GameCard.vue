<template>
  <router-link :to="`/game/${game.id}`" class="game-card">
    <div class="card-image">
      <div class="card-thumbnail" :style="{ background: getThumbnailGradient(game.id) }">
        <span class="card-emoji">{{ getGameEmoji(game.id) }}</span>
      </div>
      <div class="card-overlay">
        <button class="play-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Play Now
        </button>
      </div>
      <div class="card-badges">
        <span v-if="game.featured" class="badge featured">🔥 Featured</span>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{{ game.title }}</h3>
      <p class="card-description">{{ game.description }}</p>
      
      <div class="card-meta">
        <div class="meta-item">
          <span class="meta-icon">⭐</span>
          <span class="meta-value">{{ game.rating }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">👁️</span>
          <span class="meta-value">{{ formatPlays(game.plays) }}</span>
        </div>
      </div>
      
      <div class="card-tags">
        <span v-for="tag in game.tags.slice(0, 3)" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  game: {
    type: Object,
    required: true
  }
})

const getThumbnailGradient = (id) => {
  const gradients = {
    snake: 'linear-gradient(135deg, #22c55e, #16a34a)',
    tetris: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    memory: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    pong: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
    breakout: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    flappy: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    '2048': 'linear-gradient(135deg, #eab308, #f97316)',
    tictactoe: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    connect4: 'linear-gradient(135deg, #ef4444, #f59e0b)',
    spaceinvaders: 'linear-gradient(135deg, #10b981, #059669)',
    whackamole: 'linear-gradient(135deg, #78350f, #a16207)',
    minesweeper: 'linear-gradient(135deg, #6b7280, #374151)',
    typing: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    checkers: 'linear-gradient(135deg, #dc2626, #1f2937)',
    rps: 'linear-gradient(135deg, #f472b6, #ec4899)',
    racing: 'linear-gradient(135deg, #dc2626, #991b1b)',
    simon: 'linear-gradient(135deg, #22c55e, #eab308)',
    battleship: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
    wordscramble: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
    airhockey: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    pingpong2p: 'linear-gradient(135deg, #f97316, #ea580c)',
    dino: 'linear-gradient(135deg, #84cc16, #65a30d)',
    slider: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    colormatch: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    hangman: 'linear-gradient(135deg, #64748b, #475569)',
    maze: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
  }
  return gradients[id] || 'linear-gradient(135deg, #6366f1, #ec4899)'
}

const getGameEmoji = (id) => {
  const emojis = {
    snake: '🐍',
    tetris: '🧱',
    memory: '🃏',
    pong: '🏓',
    breakout: '🧱',
    flappy: '🐦',
    '2048': '🔢',
    tictactoe: '⭕',
    connect4: '🔴',
    spaceinvaders: '👾',
    whackamole: '🔨',
    minesweeper: '💣',
    typing: '⌨️',
    checkers: '♟️',
    rps: '✊',
    racing: '🏎️',
    simon: '🎨',
    battleship: '🚢',
    wordscramble: '🔤',
    airhockey: '🏒',
    pingpong2p: '🏓',
    dino: '🦖',
    slider: '🧩',
    colormatch: '🎨',
    hangman: '💀',
    maze: '🌀'
  }
  return emojis[id] || '🎮'
}

const formatPlays = (plays) => {
  if (plays >= 1000) {
    return (plays / 1000).toFixed(1) + 'K'
  }
  return plays
}
</script>

<style scoped>
.game-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all var(--transition-normal);
}

.game-card:hover {
  transform: translateY(-8px);
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: var(--shadow-glow);
}

.card-image {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.card-thumbnail {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-emoji {
  font-size: 4rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.game-card:hover .card-overlay {
  opacity: 1;
}

.play-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: var(--gradient-primary);
  border-radius: var(--radius-md);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  transform: scale(0.9);
  transition: transform var(--transition-normal);
}

.game-card:hover .play-btn {
  transform: scale(1);
}

.play-btn svg {
  width: 20px;
  height: 20px;
}

.card-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
}

.badge {
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

.badge.featured {
  background: rgba(249, 115, 22, 0.9);
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
}

.card-description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 16px;
  padding-top: 4px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
}

.meta-icon {
  font-size: 0.9rem;
}

.meta-value {
  color: var(--text-secondary);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 4px;
}

.tag {
  padding: 4px 10px;
  background: rgba(99, 102, 241, 0.15);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--primary-light);
  text-transform: capitalize;
}
</style>
