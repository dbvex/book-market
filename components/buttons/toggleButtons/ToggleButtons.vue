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
  buttons: [
    {
      text: string,
      value: unknown
    }
  ],
  active: unknown
}
>();

const emits = defineEmits<{
  (event: 'select', value: unknown): void
}>();

</script>
<style lang="scss" scoped>

.app-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  background-color: $background;
  color: $text;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 5px;

  &:hover {
    background-color: $button-hover;
    color: $light-text;
    transform: translateY(-2px);
  }

  &.active {
    background-color: $primary;
    color: $light-text;
    border-color: $primary;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(2px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.5);
  }
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>

