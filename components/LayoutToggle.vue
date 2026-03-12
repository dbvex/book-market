<template>
  <div class="layout-toggle">
    <button
      class="layout-toggle__btn"
      :class="{ 'layout-toggle__btn--active': modelValue === TypeLayout.Grid }"
      @click="emit('update:modelValue', TypeLayout.Grid)"
      title="Grid view"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="0" y="0" width="6.5" height="6.5" rx="1"/>
        <rect x="9.5" y="0" width="6.5" height="6.5" rx="1"/>
        <rect x="0" y="9.5" width="6.5" height="6.5" rx="1"/>
        <rect x="9.5" y="9.5" width="6.5" height="6.5" rx="1"/>
      </svg>
    </button>
    <button
      class="layout-toggle__btn"
      :class="{ 'layout-toggle__btn--active': modelValue === TypeLayout.List }"
      @click="emit('update:modelValue', TypeLayout.List)"
      title="List view"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="0" y="1" width="16" height="2.5" rx="1"/>
        <rect x="0" y="6.75" width="16" height="2.5" rx="1"/>
        <rect x="0" y="12.5" width="16" height="2.5" rx="1"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { TypeLayout } from '~/types/book';

defineProps<{ modelValue: TypeLayout | null }>();
const emit = defineEmits<{ 'update:modelValue': [value: TypeLayout] }>();
</script>

<style lang="scss" scoped>
.layout-toggle {
  display: flex;
  background: $background;
  border: 1px solid $border;
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

.layout-toggle__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: $text-secondary;
  cursor: pointer;
  transition: background var(--transition), color var(--transition);

  &:hover {
    background: $surface;
    color: $text;
  }

  &--active {
    background: $surface;
    color: $primary;
    box-shadow: var(--shadow-sm);
  }
}
</style>
