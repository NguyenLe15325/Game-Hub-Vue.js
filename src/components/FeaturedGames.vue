<template>
  <section class="featured-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-icon">🔥</span>
        Featured Games
      </h2>
      <router-link to="/category/all" class="view-all">
        View All
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </router-link>
    </div>
    
    <div class="featured-slider">
      <button class="slider-btn prev" @click="prevSlide" :disabled="currentSlide === 0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
      
      <div class="slider-container">
        <div class="slider-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <router-link 
            v-for="game in featuredGames" 
            :key="game.id"
            :to="`/game/${game.id}`"
            class="featured-card"
            :style="{ background: getCardGradient(game.id) }"
          >
            <div class="featured-content">
              <span class="featured-badge">Featured</span>
              <h3 class="featured-title">{{ game.title }}</h3>
              <p class="featured-description">{{ game.description }}</p>
              <div class="featured-stats">
                <span>⭐ {{ game.rating }}</span>
                <span>👁️ {{ formatPlays(game.plays) }} plays</span>
              </div>
              <span class="featured-play">
                Play Now
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
            </div>
            <div class="featured-emoji">
              {{ getGameEmoji(game.id) }}
            </div>
          </router-link>
        </div>
      </div>
      
      <button class="slider-btn next" @click="nextSlide" :disabled="currentSlide >= featuredGames.length - 1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>
    
    <div class="slider-dots">
      <button 
        v-for="(_, index) in featuredGames" 
        :key="index"
        class="dot"
        :class="{ active: currentSlide === index }"
        @click="currentSlide = index"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { getFeaturedGames } from '../data/games'

const featuredGames = getFeaturedGames()
const currentSlide = ref(0)

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const nextSlide = () => {
  if (currentSlide.value < featuredGames.length - 1) {
    currentSlide.value++
  }
}

const getCardGradient = (id) => {
  const gradients = {
    snake: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #0f172a 100%)',
    tetris: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #0f172a 100%)',
    memory: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #0f172a 100%)',
    pong: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #0f172a 100%)',
    breakout: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #0f172a 100%)',
    flappy: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #0f172a 100%)'
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
    flappy: '🐦'
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
.featured-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 700;
}

.title-icon {
  font-size: 1.4rem;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--primary-light);
  font-weight: 500;
  transition: gap var(--transition-normal);
}

.view-all:hover {
  gap: 10px;
}

.view-all svg {
  width: 18px;
  height: 18px;
}

.featured-slider {
  display: flex;
  align-items: center;
  gap: 16px;
}

.slider-btn {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}

.slider-btn:hover:not(:disabled) {
  background: var(--primary);
  border-color: var(--primary);
}

.slider-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slider-btn svg {
  width: 24px;
  height: 24px;
}

.slider-container {
  flex: 1;
  overflow: hidden;
  border-radius: var(--radius-xl);
}

.slider-track {
  display: flex;
  transition: transform 0.5s ease;
}

.featured-card {
  flex: 0 0 100%;
  min-height: 280px;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.featured-content {
  max-width: 50%;
  z-index: 1;
}

.featured-badge {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.featured-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.2;
}

.featured-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  line-height: 1.5;
}

.featured-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
}

.featured-play {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: white;
  color: #1a1a2e;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: transform var(--transition-normal);
}

.featured-card:hover .featured-play {
  transform: scale(1.05);
}

.featured-play svg {
  width: 20px;
  height: 20px;
}

.featured-emoji {
  font-size: 12rem;
  opacity: 0.3;
  position: absolute;
  right: 40px;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
}

.slider-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.dot {
  width: 10px;
  height: 10px;
  background: var(--bg-card-hover);
  border-radius: 50%;
  transition: all var(--transition-normal);
}

.dot.active {
  background: var(--primary);
  width: 30px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .featured-card {
    padding: 24px;
    min-height: 220px;
  }
  
  .featured-content {
    max-width: 70%;
  }
  
  .featured-title {
    font-size: 1.5rem;
  }
  
  .featured-emoji {
    font-size: 6rem;
    right: 20px;
  }
  
  .slider-btn {
    display: none;
  }
}
</style>
