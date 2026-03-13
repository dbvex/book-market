<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="app-header__inner">
        <NuxtLink to="/" class="app-logo">
          <span class="app-logo__icon">📚</span>
          <span class="app-logo__name">Book Market</span>
        </NuxtLink>
        <div class="header-actions">
          <button
            v-if="isMounted"
            class="data-toggle"
            :class="{ 'data-toggle--mock': catalogStore.useMock }"
            :aria-label="catalogStore.useMock ? 'Switch to Live API' : 'Switch to Mock Data'"
            :title="catalogStore.useMock ? 'Using mock data — click to use Live API' : 'Using Live API — click to use Mock Data'"
            @click="switchDataSource"
          >
            {{ catalogStore.useMock ? '📊 Mock' : '🌐 Live' }}
          </button>
          <button
            class="cart-btn"
            :class="{ 'cart-btn--active': isCartOpen }"
            aria-label="Saved books"
            @click="isCartOpen = !isCartOpen"
          >
            🛒
            <span v-if="isMounted && cartStore.count > 0" class="cart-btn__badge">{{ cartStore.count }}</span>
          </button>
          <button class="theme-toggle" :aria-label="isDark ? 'Switch to light' : 'Switch to dark'" @click="toggleDark()">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
        </div>
      </div>
    </header>
    <NuxtPage />
    <CartDrawer :is-open="isCartOpen" @close="isCartOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { onMounted, ref } from 'vue';

import CartDrawer from '~/components/CartDrawer.vue';
import { useCartStore } from '~/stores/cart';
import { useCatalogStore } from '~/stores/catalog';

const isDark = useDark({ attribute: 'data-theme', valueDark: 'dark', valueLight: '' });
const toggleDark = useToggle(isDark);
const cartStore = useCartStore();
const catalogStore = useCatalogStore();
const isCartOpen = ref(false);

const isMounted = ref(false);
onMounted(() => { isMounted.value = true; });

async function switchDataSource() {
  catalogStore.useMock = !catalogStore.useMock;
  await catalogStore.fetchBooks();
}
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
  max-width: var(--page-max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2-5);
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

  &__icon {
    font-size: var(--text-xl);
    line-height: 1;
  }

  &__name {
    font-size: var(--text-lg);
    font-weight: 700;
    color: var(--color-text);
    letter-spacing: -0.02em;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.cart-btn {
  position: relative;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--text-lg);
  padding: var(--space-1-5) var(--space-2-5);
  line-height: 1;
  transition: border-color var(--transition), background var(--transition);

  &:hover { background: var(--color-bg); }

  &--active {
    background: var(--color-bg);
    border-color: var(--color-primary);
  }

  &__badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 18px;
    height: 18px;
    background: var(--color-primary);
    color: var(--color-text-on-primary);
    border-radius: var(--radius-full);
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
  }
}

.theme-toggle {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--text-lg);
  padding: var(--space-1-5) var(--space-2-5);
  line-height: 1;
  transition: border-color var(--transition), background var(--transition);

  &:hover {
    background: var(--color-bg);
  }
}

.data-toggle {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: 600;
  padding: var(--space-1-5) var(--space-3);
  line-height: 1;
  color: var(--color-text-secondary);
  transition: border-color var(--transition), background var(--transition), color var(--transition);

  &:hover {
    background: var(--color-bg);
    color: var(--color-text);
  }

  &--mock {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
}
</style>
