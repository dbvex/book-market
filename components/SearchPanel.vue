<template>
  <div class="search-panel">
    <div class="search-panel__field">
      <input
        v-model="catalogStore.searchQuery"
        class="app-input"
        type="text"
        placeholder="Search by title, author..."
      />
      <p class="search-hint" :class="{ 'search-hint--hidden': props.loading }">
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

const props = defineProps<{ loading: boolean }>();

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
  gap: var(--space-3);
  padding: var(--space-5) 0 var(--space-2);
}

.search-panel__field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1-5);
}

.app-input {
  width: 100%;
  padding: var(--space-3) var(--space-5);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-input);
  background-color: var(--color-surface);
  font-size: var(--text-base);
  color: var(--color-text);
  outline: none;
  transition: border-color var(--transition), box-shadow var(--transition);

  &:focus,
  &:focus-visible {
    border-color: var(--color-primary);
    box-shadow: var(--focus-ring);
  }

  &::placeholder {
    color: var(--color-placeholder);
  }
}

.search-hint {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin: 0;
  padding-left: var(--space-1);
  opacity: 1;
  transition: opacity var(--transition);

  &--hidden {
    opacity: 0;
  }
}
</style>
