<template>
  <nav class="navbar glass">
    <div class="navbar-content">
      <router-link to="/" class="logo">
        <span class="logo-icon">🎮</span>
        <span class="logo-text">Game<span class="gradient-text">Hub</span></span>
      </router-link>
      
      <div class="search-container">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Search games..."
            class="search-input"
          />
          <div v-if="searchResults.length > 0 && searchQuery" class="search-dropdown">
            <router-link 
              v-for="game in searchResults" 
              :key="game.id"
              :to="`/game/${game.id}`"
              class="search-result"
              @click="clearSearch"
            >
              <span class="result-title">{{ game.title }}</span>
              <span class="result-category">{{ game.category }}</span>
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="nav-actions">
        <button class="nav-btn">
          <span class="nav-btn-icon">🔥</span>
          <span class="nav-btn-text">Popular</span>
        </button>
        <button class="nav-btn">
          <span class="nav-btn-icon">⭐</span>
          <span class="nav-btn-text">New</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { searchGames } from '../data/games'

const searchQuery = ref('')
const searchResults = ref([])

const handleSearch = () => {
  if (searchQuery.value.length >= 2) {
    searchResults.value = searchGames(searchQuery.value).slice(0, 5)
  } else {
    searchResults.value = []
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--navbar-height);
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  letter-spacing: -0.5px;
}

.search-container {
  flex: 1;
  max-width: 500px;
  margin: 0 40px;
  position: relative;
}

.search-box {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: all var(--transition-normal);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.search-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  transition: background var(--transition-fast);
}

.search-result:hover {
  background: var(--bg-card-hover);
}

.result-title {
  font-weight: 500;
}

.result-category {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: capitalize;
}

.nav-actions {
  display: flex;
  gap: 8px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-card);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all var(--transition-normal);
}

.nav-btn:hover {
  background: var(--bg-card-hover);
  transform: translateY(-2px);
}

.nav-btn-icon {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .nav-actions {
    display: none;
  }
  
  .search-container {
    margin: 0 20px;
  }
}
</style>
