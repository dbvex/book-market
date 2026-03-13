<template>
  <div class="page">
    <div
      v-if="catalogStore.apiNotice"
      class="api-notice"
      :class="`api-notice--${catalogStore.apiNotice.type}`"
    >
      <span class="api-notice__icon">{{ catalogStore.apiNotice.type === 'info' ? '📊' : '⚠️' }}</span>
      <span class="api-notice__message">{{ catalogStore.apiNotice.message }}</span>
      <button
        v-if="catalogStore.apiNotice.type === 'error'"
        class="api-notice__action"
        @click="switchToMock"
      >
        Use Mock Data
      </button>
      <button class="api-notice__close" aria-label="Dismiss" @click="catalogStore.apiNotice = null">✕</button>
    </div>
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

const pending = ref(true);
onMounted(async () => {
  await catalogStore.fetchBooks();
  pending.value = false;
});

const isInitialLoad = computed(() => pending.value);
const isRefetching = computed(() => !pending.value && catalogStore.isLoading);

let searchTimer: ReturnType<typeof setTimeout> | null = null;
watch(() => catalogStore.searchQuery, (query) => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    catalogStore.currentPage = 1;
    catalogStore.fetchBooks(query || 'Nuxt');
  }, 400);
});

async function switchToMock() {
  catalogStore.useMock = true;
  catalogStore.apiNotice = null;
  await catalogStore.fetchBooks();
}
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

.api-notice {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  margin: var(--space-4) 0;
  border-radius: var(--radius-base);
  font-size: var(--text-sm);

  &--info {
    background: var(--color-badge-bg);
    border: 1px solid var(--color-primary);

    .api-notice__message { color: var(--color-badge-text); }
    .api-notice__close   { color: var(--color-badge-text); }
  }

  &--error {
    background: var(--color-error-bg);
    border: 1px solid var(--color-error);

    .api-notice__message { color: var(--color-error); }
    .api-notice__close   { color: var(--color-error); }
  }

  &__icon { flex-shrink: 0; }

  &__message {
    flex: 1;
    font-weight: 500;
  }

  &__action {
    flex-shrink: 0;
    padding: var(--space-1-5) var(--space-3);
    background: var(--color-error);
    color: var(--color-text-on-primary);
    border: none;
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    font-weight: 600;
    cursor: pointer;
    transition: opacity var(--transition);

    &:hover { opacity: 0.85; }
  }

  &__close {
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    font-size: var(--text-base);
    padding: 0 var(--space-1);
    line-height: 1;
  }
}
</style>
