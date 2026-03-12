<template>
  <div class="search-panel">
    <div class="search-panel__field">
      <input
        v-model="catalogStore.searchQuery"
        class="app-input"
        type="text"
        placeholder="Search by title, author..."
      />
      <p v-if="!catalogStore.isLoading" class="search-hint">
        {{ totalCount }} {{ totalCount === 1 ? 'book' : 'books' }} found
      </p>
    </div>
    <LayoutToggle v-model="layout" />
  </div>
</template>

<script lang="ts" setup>
import LayoutToggle from '~/components/LayoutToggle.vue';
import { useCatalogStore } from '~/stores/catalog';
import { TypeLayout } from '~/types/book';

const catalogStore = useCatalogStore();

const totalCount = computed(() => catalogStore.items?.length ?? 0);

const layout = computed({
  get: () => catalogStore.activeTypeLayout ?? TypeLayout.Grid,
  set: (val: TypeLayout) => catalogStore.setTypeLayout(val),
});
</script>

<style lang="scss" scoped>
.search-panel {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 0 8px;
}

.search-panel__field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.app-input {
  width: 100%;
  padding: 12px 20px;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--color-surface);
  font-size: 15px;
  color: var(--color-text);
  outline: none;
  transition: border-color var(--transition), box-shadow var(--transition);

  &:focus,
  &:focus-visible {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
}

.search-hint {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  margin: 0;
  padding-left: 4px;
}
</style>
