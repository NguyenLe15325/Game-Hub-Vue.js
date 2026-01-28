<template>
  <div id="app">
    <Navbar />
    <Sidebar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<style>
@import './assets/styles/main.css';

#app {
  min-height: 100vh;
}

.main-content {
  margin-left: var(--sidebar-width);
  margin-top: var(--navbar-height);
  padding: 32px;
  min-height: calc(100vh - var(--navbar-height));
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding: 24px 16px;
  }
}
</style>
