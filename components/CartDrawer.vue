<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="cart-overlay" role="dialog" aria-modal="true" aria-label="Saved books">
        <div class="cart-overlay__backdrop" @click="emit('close')" />
        <div class="cart-drawer">
          <div class="cart-drawer__header">
            <h2 class="cart-drawer__title">
              Saved books
              <span class="cart-drawer__count">{{ cartStore.count }}</span>
            </h2>
            <button class="cart-drawer__close" aria-label="Close" @click="emit('close')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
              </svg>
            </button>
          </div>

          <div v-if="cartStore.items.length === 0" class="cart-drawer__empty">
            <span class="cart-drawer__empty-icon">📚</span>
            <p class="cart-drawer__empty-text">No saved books yet</p>
            <p class="cart-drawer__empty-hint">Press <strong>+</strong> on any book to save it</p>
          </div>

          <ul v-else class="cart-drawer__list">
            <li v-for="item in cartStore.items" :key="item.id" class="cart-book">
              <div class="cart-book__cover">
                <img v-if="item.imgUrl" :src="item.imgUrl" :alt="item.title" />
                <span v-else class="cart-book__cover-placeholder">📖</span>
              </div>
              <div class="cart-book__info">
                <NuxtLink
                  class="cart-book__title"
                  :to="`/item/${item.id}`"
                  @click="emit('close')"
                >
                  {{ item.title }}
                </NuxtLink>
                <p class="cart-book__author">{{ item.authors }}</p>
              </div>
              <button
                class="cart-book__remove"
                aria-label="Remove from saved"
                @click="cartStore.remove(item.id)"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
                </svg>
              </button>
            </li>
          </ul>

          <div v-if="cartStore.items.length > 0" class="cart-drawer__footer">
            <button class="cart-drawer__clear" @click="cartStore.clear()">
              Clear all
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';

import { useCartStore } from '~/stores/cart';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ close: [] }>();

const cartStore = useCartStore();

// Close on Escape key
useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) emit('close');
});
</script>

<style scoped lang="scss">
// Transition: backdrop fades, panel slides from right
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;

  .cart-drawer {
    transition: transform 0.25s ease;
  }
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  .cart-drawer {
    transform: translateX(100%);
  }
}

.cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  justify-content: flex-end;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
  }
}

.cart-drawer {
  position: relative;
  width: 360px;
  max-width: 100vw;
  height: 100%;
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-5) var(--space-6);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  &__title {
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  &__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 var(--space-1-5);
    background: var(--color-primary);
    color: var(--color-text-on-primary);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: 700;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: background var(--transition), color var(--transition);

    &:hover {
      background: var(--color-bg);
      color: var(--color-text);
    }
  }

  &__empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-10);
    text-align: center;
  }

  &__empty-icon {
    font-size: 3rem;
    line-height: 1;
    opacity: 0.4;
  }

  &__empty-text {
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }

  &__empty-hint {
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    margin: 0;
  }

  &__list {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-3) 0;
    margin: 0;
    list-style: none;
  }

  &__footer {
    padding: var(--space-4) var(--space-6);
    border-top: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  &__clear {
    width: 100%;
    padding: var(--space-2) var(--space-4);
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: background var(--transition), border-color var(--transition), color var(--transition);

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }
}

.cart-book {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-6);
  transition: background var(--transition);

  &:hover {
    background: var(--color-bg);
  }

  &__cover {
    width: 44px;
    height: 60px;
    flex-shrink: 0;
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--color-bg);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__cover-placeholder {
    font-size: var(--text-xl);
    opacity: 0.5;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__title {
    display: block;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-text);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
    transition: color var(--transition);

    &:hover {
      color: var(--color-primary);
      text-decoration: none;
    }
  }

  &__author {
    font-size: var(--text-xs);
    color: var(--color-text-secondary);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__remove {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: none;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--color-text-secondary);
    transition: background var(--transition), border-color var(--transition), color var(--transition);

    &:hover {
      background: var(--color-bg);
      border-color: var(--color-border);
      color: var(--color-text);
    }
  }
}
</style>
