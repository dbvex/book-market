<template>
  <nav class="pagination" aria-label="Pagination">
    <button
      class="pagination__btn pagination__btn--nav"
      :disabled="currentPage === 1"
      @click="emit('change', currentPage - 1)"
      aria-label="Previous page"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M10.06 3.47a.75.75 0 0 1 0 1.06L6.59 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L4.47 8 8.94 3.53a.75.75 0 0 1 1.06 0z"/>
      </svg>
    </button>

    <template v-for="(page, index) in displayedPages" :key="index">
      <span v-if="page === '...'" class="pagination__ellipsis">…</span>
      <button
        v-else
        class="pagination__btn"
        :class="{ 'pagination__btn--active': page === currentPage }"
        @click="emit('change', page as number)"
      >
        {{ page }}
      </button>
    </template>

    <button
      class="pagination__btn pagination__btn--nav"
      :disabled="currentPage === totalPages"
      @click="emit('change', currentPage + 1)"
      aria-label="Next page"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M5.94 3.47a.75.75 0 0 0 0 1.06L9.41 8 5.94 11.47a.75.75 0 1 0 1.06 1.06L11.53 8 7.06 3.53a.75.75 0 0 0-1.06 0z"/>
      </svg>
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  totalPages: number;
  currentPage: number;
}>();

const emit = defineEmits<{ change: [page: number] }>();

const displayedPages = computed((): (number | string)[] => {
  const { totalPages: total, currentPage: cur } = props;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  if (cur <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('...');
    pages.push(total);
  } else if (cur >= total - 3) {
    pages.push(1);
    pages.push('...');
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push('...');
    for (let i = cur - 1; i <= cur + 1; i++) pages.push(i);
    pages.push('...');
    pages.push(total);
  }

  return pages;
});
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 6px;
  border: 1px solid $border;
  border-radius: 8px;
  background: $surface;
  color: $text;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--transition), border-color var(--transition), color var(--transition);

  &:hover:not(:disabled) {
    background: $background;
    border-color: $primary;
    color: $primary;
  }

  &--active {
    background: $primary;
    border-color: $primary;
    color: $white;
    pointer-events: none;

    &:hover {
      background: $primary;
    }
  }

  &--nav {
    color: $text-secondary;

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }
}

.pagination__ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  color: $text-secondary;
  font-size: 0.875rem;
  user-select: none;
}
</style>
