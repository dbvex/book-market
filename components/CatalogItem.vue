<template>
  <div class="catalog-item" :class="{ 'catalog-item--list': isListLayout }">
    <div class="catalog-item__cover">
      <img :src="item.imgUrl" :alt="item.title" loading="lazy" />
    </div>
    <div class="catalog-item__body">
      <div class="catalog-item__content">
        <!-- eslint-disable-next-line vue/no-v-html -- safe: query is regex-escaped before inject -->
        <h3 class="catalog-item__title" v-html="highlightText(item.title, searchQuery)"/>
        <!-- eslint-disable-next-line vue/no-v-html -- safe: query is regex-escaped before inject -->
        <p class="catalog-item__author" v-html="highlightText(item.authors, searchQuery)"/>
        <div class="catalog-item__meta">
          <span v-if="item.date" class="catalog-item__tag">{{ formatYear(item.date) }}</span>
          <span v-if="item.country" class="catalog-item__tag">{{ item.country }}</span>
        </div>
      </div>
      <div class="catalog-item__actions">
        <NuxtLink class="catalog-item__link" :to="`/item/${item.id}`">View details →</NuxtLink>
        <button
          class="catalog-item__cart"
          :class="{ 'catalog-item__cart--active': inCart }"
          :aria-label="inCart ? 'Remove from cart' : 'Add to cart'"
          @click.prevent="cartStore.toggle({ id: item.id, title: item.title, authors: item.authors, imgUrl: item.imgUrl })"
        >
          {{ inCart ? '✓' : '+' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { useCatalogStore } from '~/stores/catalog';
import type { IBook } from '~/types/book';
import { TypeLayout } from '~/types/book';

const catalogStore = useCatalogStore();
const cartStore = useCartStore();
const props = defineProps<{ item: IBook }>();

const searchQuery = computed(() => catalogStore.searchQuery);
const isListLayout = computed(() => catalogStore.activeTypeLayout === TypeLayout.List);

// Defer cart state to client-only to prevent SSR hydration mismatch
// (localStorage is unavailable on server, so we read it only after mount)
const isMounted = ref(false);
onMounted(() => { isMounted.value = true; });
const inCart = computed(() => isMounted.value && cartStore.isInCart(props.item.id));

const highlightText = (text: string, query: string): string => {
  if (!query || !text) return text || '';
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(escaped, 'gi'), (match) => `<span class="highlight">${match}</span>`);
};

const formatYear = (dateStr: string): string => {
  return dateStr?.slice(0, 4) || '—';
};
</script>

<style lang="scss">
.catalog-item {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow var(--transition), transform var(--transition);

  &:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-2px);
  }

  &--list {
    flex-direction: row;
    align-items: stretch;

    .catalog-item__cover {
      width: 80px;
      height: auto;
      min-height: 106px;
      flex-shrink: 0;
    }

    .catalog-item__body {
      flex-direction: row;
      align-items: center;
      gap: var(--space-4);
    }

    .catalog-item__link {
      width: auto;
      flex-shrink: 0;
    }
  }
}

.catalog-item__cover {
  width: 100%;
  height: var(--cover-height);
  background: var(--color-cover-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }
}

.catalog-item__body {
  padding: var(--space-3-5);
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--space-2);
}

.catalog-item__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.catalog-item__title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: var(--leading-snug);
  margin: 0;
}

.catalog-item__author {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.catalog-item__meta {
  display: flex;
  gap: var(--space-1-5);
  flex-wrap: wrap;
  margin-top: var(--space-1);
}

.catalog-item__tag {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  background: var(--color-bg);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
}

.catalog-item__actions {
  display: flex;
  gap: var(--space-1-5);
  align-items: stretch;
}

.catalog-item__link {
  display: block;
  padding: var(--space-2) var(--space-3-5);
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  text-align: center;
  transition: background var(--transition);
  flex: 1;

  &:hover {
    background: var(--color-primary-hover);
    text-decoration: none;
    color: var(--color-text-on-primary);
  }
}

.catalog-item__cart {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--btn-size);
  flex-shrink: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition), border-color var(--transition), color var(--transition);

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  &--active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-text-on-primary);

    &:hover {
      background: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
      color: var(--color-text-on-primary);
    }
  }
}

.highlight {
  background-color: var(--color-highlight);
  border-radius: 2px;
  padding: 0 1px;
}
</style>
