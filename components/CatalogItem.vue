<template>
  <div class="catalog-item" :class="{ 'catalog-item--list': isListLayout }">
    <div class="catalog-item__cover">
      <img :src="item.imgUrl" :alt="item.title" loading="lazy" />
    </div>
    <div class="catalog-item__body">
      <div class="catalog-item__content">
        <!-- eslint-disable-next-line vue/no-v-html -- safe: query is regex-escaped before inject -->
        <h3 class="catalog-item__title" v-html="highlightText(item.title, searchQuery)"></h3>
        <!-- eslint-disable-next-line vue/no-v-html -- safe: query is regex-escaped before inject -->
        <p class="catalog-item__author" v-html="highlightText(item.authors, searchQuery)"></p>
        <div class="catalog-item__meta">
          <span v-if="item.date" class="catalog-item__tag">{{ formatYear(item.date) }}</span>
          <span v-if="item.country" class="catalog-item__tag">{{ item.country }}</span>
        </div>
      </div>
      <NuxtLink class="catalog-item__link" :to="`/item/${item.id}`">View details →</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBook } from '~/types/book';
import { useCatalogStore } from '~/stores/catalog';
import { TypeLayout } from '~/types/book';

const catalogStore = useCatalogStore();
defineProps<{ item: IBook }>();

const searchQuery = computed(() => catalogStore.searchQuery);
const isListLayout = computed(() => catalogStore.activeTypeLayout === TypeLayout.List);

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
      gap: 16px;
    }

    .catalog-item__link {
      width: auto;
      flex-shrink: 0;
    }
  }
}

.catalog-item__cover {
  width: 100%;
  height: 160px;
  background: #f8fafc;
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
  padding: 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
}

.catalog-item__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.catalog-item__title {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  margin: 0;
}

.catalog-item__author {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.catalog-item__meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.catalog-item__tag {
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  background: var(--color-bg);
  padding: 2px 8px;
  border-radius: 100px;
}

.catalog-item__link {
  display: block;
  padding: 8px 14px;
  background: var(--color-primary);
  color: #fff;
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
  font-weight: 500;
  text-align: center;
  transition: background var(--transition);
  width: 100%;

  &:hover {
    background: var(--color-primary-hover);
    text-decoration: none;
    color: #fff;
  }
}

.highlight {
  background-color: var(--color-highlight);
  border-radius: 2px;
  padding: 0 1px;
}
</style>
