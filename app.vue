<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="app-header__inner">
        <NuxtLink to="/" class="app-logo">
          <span class="app-logo__icon">📚</span>
          <span class="app-logo__name">Book Market</span>
        </NuxtLink>
        <button class="theme-toggle" @click="toggleDark()" :aria-label="isDark ? 'Switch to light' : 'Switch to dark'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark({ attribute: 'data-theme', valueDark: 'dark', valueLight: '' });
const toggleDark = useToggle(isDark);
</script>

<style lang="scss">
.app-shell {
  min-height: 100vh;
  background-color: var(--color-bg);
  transition: background-color var(--transition), color var(--transition);
}

.app-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
  transition: background-color var(--transition), border-color var(--transition);
}

.app-header__inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

  &__icon {
    font-size: 1.4rem;
    line-height: 1;
  }

  &__name {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--color-text);
    letter-spacing: -0.02em;
  }
}

.theme-toggle {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 1.1rem;
  padding: 6px 10px;
  line-height: 1;
  transition: border-color var(--transition), background var(--transition);

  &:hover {
    background: var(--color-bg);
  }
}
</style>
