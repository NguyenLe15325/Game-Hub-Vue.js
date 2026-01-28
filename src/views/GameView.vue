<template>
  <div class="game-view">
    <div v-if="game" class="game-container">
      <!-- Game Header -->
      <div class="game-header">
        <router-link to="/" class="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Games
        </router-link>
        
        <div class="game-info">
          <h1 class="game-title">{{ game.title }}</h1>
          <div class="game-meta">
            <span class="meta-item">
              <span class="meta-icon">⭐</span> {{ game.rating }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">👁️</span> {{ formatPlays(game.plays) }} plays
            </span>
            <span class="meta-item category">{{ game.category }}</span>
          </div>
        </div>
        
        <div class="game-actions">
          <button class="action-btn" @click="toggleFullscreen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
          <button class="action-btn favorite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Game Frame -->
      <div class="game-frame-container" ref="gameContainer">
        <iframe 
          :src="`/games/${game.id}/index.html`"
          class="game-frame"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
      
      <!-- Game Description -->
      <div class="game-details">
        <div class="details-section">
          <h3>About This Game</h3>
          <p>{{ game.description }}</p>
        </div>
        
        <div class="details-section">
          <h3>Tags</h3>
          <div class="tags-list">
            <span v-for="tag in game.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        
        <div class="details-section controls">
          <h3>Controls</h3>
          <div class="controls-info">
            <div class="control-item">
              <span class="control-key">Arrow Keys</span>
              <span class="control-desc">Move / Navigate</span>
            </div>
            <div class="control-item">
              <span class="control-key">Space</span>
              <span class="control-desc">Action / Pause</span>
            </div>
            <div class="control-item">
              <span class="control-key">R</span>
              <span class="control-desc">Restart Game</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Not Found -->
    <div v-else class="not-found">
      <span class="not-found-icon">🎮</span>
      <h2>Game Not Found</h2>
      <p>The game you're looking for doesn't exist.</p>
      <router-link to="/" class="back-home">Back to Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getGameById } from '../data/games'

const route = useRoute()
const gameContainer = ref(null)

const game = computed(() => {
  return getGameById(route.params.id)
})

const formatPlays = (plays) => {
  if (plays >= 1000) {
    return (plays / 1000).toFixed(1) + 'K'
  }
  return plays
}

const toggleFullscreen = () => {
  if (gameContainer.value) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      gameContainer.value.requestFullscreen()
    }
  }
}
</script>

<style scoped>
.game-view {
  animation: fadeIn 0.3s ease;
}

.game-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 500;
  transition: all var(--transition-normal);
}

.back-btn:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.game-info {
  flex: 1;
}

.game-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.game-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.meta-item.category {
  background: rgba(99, 102, 241, 0.15);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  color: var(--primary-light);
  text-transform: capitalize;
}

.game-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 44px;
  height: 44px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}

.action-btn:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.action-btn.favorite:hover {
  color: #ec4899;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.game-frame-container {
  background: #000;
  border-radius: var(--radius-xl);
  overflow: hidden;
  aspect-ratio: 16 / 9;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.game-frame {
  width: 100%;
  height: 100%;
}

.game-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.details-section {
  background: var(--bg-card);
  padding: 24px;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.details-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.details-section p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 6px 14px;
  background: rgba(99, 102, 241, 0.15);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--primary-light);
  text-transform: capitalize;
}

.controls-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-key {
  padding: 6px 12px;
  background: var(--bg-card-hover);
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.9rem;
  min-width: 80px;
  text-align: center;
}

.control-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.not-found {
  text-align: center;
  padding: 80px 20px;
}

.not-found-icon {
  font-size: 5rem;
  display: block;
  margin-bottom: 24px;
  opacity: 0.5;
}

.not-found h2 {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.not-found p {
  color: var(--text-muted);
  margin-bottom: 24px;
}

.back-home {
  display: inline-flex;
  padding: 12px 24px;
  background: var(--gradient-primary);
  border-radius: var(--radius-md);
  font-weight: 600;
}
</style>
