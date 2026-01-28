<template>
  <section class="game-grid-section">
    <div class="section-header" v-if="title">
      <h2 class="section-title">
        <span v-if="icon" class="title-icon">{{ icon }}</span>
        {{ title }}
      </h2>
      <span class="game-count">{{ games.length }} games</span>
    </div>
    
    <div class="game-grid">
      <GameCard 
        v-for="game in games" 
        :key="game.id" 
        :game="game"
        class="animate-slide-up"
        :style="{ animationDelay: `${games.indexOf(game) * 0.05}s` }"
      />
    </div>
    
    <div v-if="games.length === 0" class="empty-state">
      <span class="empty-icon">🎮</span>
      <h3>No games found</h3>
      <p>Try a different category or search term</p>
    </div>
  </section>
</template>

<script setup>
import GameCard from './GameCard.vue'

defineProps({
  games: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.game-grid-section {
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

.game-count {
  font-size: 0.9rem;
  color: var(--text-muted);
  background: var(--bg-card);
  padding: 6px 14px;
  border-radius: var(--radius-sm);
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.3rem;
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .game-grid {
    grid-template-columns: 1fr;
  }
}
</style>
