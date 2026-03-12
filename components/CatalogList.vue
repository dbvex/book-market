<template>
  <div class="catalog-area">
    <div v-if="showSkeletons" :class="layoutClass">
      <SkeletonCard v-for="n in 10" :key="n" />
    </div>
    <div v-else-if="showEmpty" class="empty-state">
      <div class="empty-state__icon">🔍</div>
      <p class="empty-state__title">Nothing found</p>
      <p class="empty-state__hint">Try a different search query</p>
    </div>
    <div v-else :class="[layoutClass, { 'catalog--refetching': refetching }]">
      <CatalogItem
        v-for="item in items"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCatalogStore } from '@/stores/catalog';
import { TypeLayout } from '~/types/book';

const props = defineProps<{ initialLoad: boolean; refetching: boolean }>();

const catalogStore = useCatalogStore();

const items = computed(() => catalogStore.itemsWithPagination);
const hasItems = computed(() => !!items.value && items.value.length > 0);

// Show skeletons when:
// 1. First ever load (no data yet)
// 2. Refetching but previous result was empty — nothing to dim
const showSkeletons = computed(() =>
  props.initialLoad || (props.refetching && !hasItems.value)
);

// Show empty state only when settled (not loading) and truly empty
const showEmpty = computed(() =>
  !props.initialLoad && !props.refetching && !hasItems.value
);

const layoutClass = computed(() =>
  catalogStore.activeTypeLayout === TypeLayout.Grid ? 'catalog-grid' : 'catalog-list'
);
</script>

<style scoped lang="scss">
.catalog-area {
  min-height: 640px;
  margin-top: var(--space-4);
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: var(--space-4);
}

.catalog-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.catalog--refetching {
  opacity: 0.45;
  pointer-events: none;
  transition: opacity var(--transition);
}

.empty-state {
  min-height: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);

  &__icon {
    font-size: 3rem;
    margin-bottom: var(--space-4);
  }

  &__title {
    font-size: var(--text-lg);
    font-weight: 600;
    margin: 0 0 var(--space-2);
    color: var(--color-text);
  }

  &__hint {
    font-size: var(--text-sm);
    margin: 0;
  }
}
</style>
