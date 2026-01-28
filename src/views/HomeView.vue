<template>
  <div class="home-view">
    <FeaturedGames />
    <GameGrid 
      :games="games" 
      title="All Games" 
      icon="🎮"
    />
  </div>
</template>

<script setup>
import { games } from '../data/games'
import FeaturedGames from '../components/FeaturedGames.vue'
import GameGrid from '../components/GameGrid.vue'
</script>

<style scoped>
.home-view {
  animation: fadeIn 0.3s ease;
}
</style>
