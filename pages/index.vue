<template>
  <div class="page">
    <SearchPanel :loading="isInitialLoad" />
    <CatalogList :initial-load="isInitialLoad" :refetching="isRefetching" />
    <div class="pagination-area">
      <AppPagination
        v-if="!isInitialLoad && totalPages > 1"
        :total-pages="totalPages"
        :current-page="catalogStore.currentPage"
        @change="catalogStore.setActiveStep"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';

import { useCatalogStore } from '@/stores/catalog';
import AppPagination from '~/components/AppPagination.vue';
import CatalogList from '~/components/CatalogList.vue';
import SearchPanel from '~/components/SearchPanel.vue';

definePageMeta({ ssr: false });

useSeoMeta({
  title: 'Book Market — Browse & Discover Books',
  description: 'Explore thousands of books via Google Books API. Built with Nuxt 3, Vue 3, Pinia and VueUse.',
  ogTitle: 'Book Market',
  ogDescription: 'Browse and discover books with live search, dark mode, and cart.'
});

const catalogStore = useCatalogStore();

const totalPages = computed(() =>
  Math.ceil((catalogStore.items?.length ?? 0) / catalogStore.perPage)
);

const { pending } = useLazyAsyncData('catalog-books', () => catalogStore.fetchBooks(), {
  getCachedData: () => undefined
});

const isInitialLoad = computed(() => pending.value);
const isRefetching = computed(() => !pending.value && catalogStore.isLoading);

watchDebounced(
  () => catalogStore.searchQuery,
  (query) => {
    catalogStore.currentPage = 1;
    catalogStore.fetchBooks(query || 'Nuxt');
  },
  { debounce: 400 }
);
</script>

<style scoped lang="scss">
.page {
  max-width: var(--page-max-width);
  margin: 0 auto;
  padding: 0 var(--space-6) var(--space-10);
}

.pagination-area {
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
