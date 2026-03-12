<template>
  <div class="button-container">
    <button
        v-for="button in buttons"
        :key="button.value"
        class="app-button"
        :class="{ active: button.value === active }"
        @click="emits('select', button.value)"
    >
      {{ button.text }}
    </button>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  buttons: { text: string, value: string | number }[],
  active: string | number | null
}>();

const emits = defineEmits<{
  (event: 'select', value: string | number): void
}>();
</script>
<style lang="scss" scoped>
.app-button {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition);
  box-shadow: var(--shadow-sm);
  margin: var(--space-1);

  &:hover {
    background-color: var(--color-primary-hover);
    color: var(--color-text-on-primary);
    transform: translateY(-2px);
  }

  &.active {
    background-color: var(--color-primary);
    color: var(--color-text-on-primary);
    border-color: var(--color-primary);
    box-shadow: var(--shadow-md);
    transform: translateY(2px);
  }

  &:focus {
    outline: none;
    box-shadow: var(--focus-ring);
  }
}

.button-container {
  display: flex;
  justify-content: center;
  gap: var(--space-2-5);
  flex-wrap: wrap;
}
</style>
