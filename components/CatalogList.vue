<template>
  <div v-if="isLoading" :class="layoutClass">
    <SkeletonCard v-for="n in 10" :key="n" />
  </div>
  <div v-else-if="isEmpty" class="empty-state">
    <div class="empty-state__icon">🔍</div>
    <p class="empty-state__title">Nothing found</p>
    <p class="empty-state__hint">Try a different search query</p>
  </div>
  <div v-else :class="layoutClass">
    <CatalogItem
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script setup lang="ts">
import CatalogItem from './CatalogItem.vue';
import SkeletonCard from './SkeletonCard.vue';
import { useCatalogStore } from '@/stores/catalog';
import { TypeLayout } from '~/types/book';

const catalogStore = useCatalogStore();

const items = computed(() => catalogStore.itemsWithPagination);
const isLoading = computed(() => catalogStore.isLoading);
const isEmpty = computed(() => !isLoading.value && (!items.value || items.value.length === 0));
const layoutClass = computed(() =>
  catalogStore.activeTypeLayout === TypeLayout.Grid ? 'catalog-grid' : 'catalog-list'
);
</script>

<style scoped lang="scss">
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.catalog-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
  color: $text-secondary;

  &__icon {
    font-size: 3rem;
    margin-bottom: 16px;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 8px;
    color: $text;
  }

  &__hint {
    font-size: 0.875rem;
    margin: 0;
  }
}
</style>
