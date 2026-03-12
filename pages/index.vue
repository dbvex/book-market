<template>
  <div class="page">
    <SearchPanel />
    <CatalogList />
    <AppPagination
      v-if="!catalogStore.isLoading && totalPages > 1"
      :total-pages="totalPages"
      :current-page="catalogStore.currentPage"
      @change="catalogStore.setActiveStep"
    />
  </div>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import { useCatalogStore } from '@/store/catalog';
import SearchPanel from '~/components/SearchPanel.vue';
import AppPagination from '~/components/AppPagination.vue';

const catalogStore = useCatalogStore();

const totalPages = computed(() =>
  Math.ceil((catalogStore.items?.length ?? 0) / catalogStore.perPage)
);

await useAsyncData('catalog-books', () => catalogStore.fetchBooks());

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
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 40px;
}
</style>
