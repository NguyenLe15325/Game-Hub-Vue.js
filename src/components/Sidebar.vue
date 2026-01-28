<template>
  <aside class="sidebar">
    <div class="sidebar-section">
      <h3 class="sidebar-title">Categories</h3>
      <nav class="sidebar-nav">
        <router-link 
          v-for="category in categories" 
          :key="category.id"
          :to="category.id === 'all' ? '/' : `/category/${category.id}`"
          class="sidebar-link"
          :class="{ active: isActive(category.id) }"
        >
          <span class="link-icon">{{ category.icon }}</span>
          <span class="link-text">{{ category.name }}</span>
        </router-link>
      </nav>
    </div>
    
    <div class="sidebar-section">
      <h3 class="sidebar-title">Quick Links</h3>
      <nav class="sidebar-nav">
        <a href="#" class="sidebar-link">
          <span class="link-icon">🏆</span>
          <span class="link-text">Leaderboards</span>
        </a>
        <a href="#" class="sidebar-link">
          <span class="link-icon">❤️</span>
          <span class="link-text">Favorites</span>
        </a>
        <a href="#" class="sidebar-link">
          <span class="link-icon">🕐</span>
          <span class="link-text">Recently Played</span>
        </a>
      </nav>
    </div>
    
    <div class="sidebar-banner">
      <div class="banner-content">
        <span class="banner-icon">🎉</span>
        <h4 class="banner-title">New Games Weekly!</h4>
        <p class="banner-text">Check back every week for fresh games.</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { categories } from '../data/games'

const route = useRoute()

const isActive = (categoryId) => {
  if (categoryId === 'all' && route.path === '/') return true
  return route.params.id === categoryId
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: var(--navbar-height);
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--bg-sidebar);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  padding: 24px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  padding: 0 12px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 500;
  transition: all var(--transition-normal);
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.sidebar-link.active {
  background: var(--gradient-primary);
  color: white;
}

.link-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.sidebar-banner {
  margin-top: auto;
  background: var(--gradient-glow);
  border-radius: var(--radius-lg);
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.banner-content {
  text-align: center;
}

.banner-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 10px;
}

.banner-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.banner-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}
</style>
