<template>
  <div class="category-view">
    <div class="category-header">
      <div class="category-info">
        <span class="category-icon">{{ categoryData?.icon || '🎮' }}</span>
        <div>
          <h1 class="category-title">{{ categoryData?.name || 'Games' }}</h1>
          <p class="category-subtitle">{{ filteredGames.length }} games available</p>
        </div>
      </div>
    </div>
    
    <GameGrid :games="filteredGames" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getGamesByCategory, categories } from '../data/games'
import GameGrid from '../components/GameGrid.vue'

const route = useRoute()

const categoryData = computed(() => {
  return categories.find(cat => cat.id === route.params.id)
})

const filteredGames = computed(() => {
  return getGamesByCategory(route.params.id)
})
</script>

<style scoped>
.category-view {
  animation: fadeIn 0.3s ease;
}

.category-header {
  margin-bottom: 32px;
  padding: 32px;
  background: var(--gradient-glow);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.category-icon {
  font-size: 3.5rem;
  background: var(--bg-card);
  padding: 20px;
  border-radius: var(--radius-lg);
}

.category-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.category-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}
</style>
