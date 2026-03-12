<template>
  <div class="skeleton-card">
    <div class="skeleton-card__cover skeleton-pulse"/>
    <div class="skeleton-card__body">
      <div class="skeleton-card__title skeleton-pulse"/>
      <div class="skeleton-card__line skeleton-pulse"/>
      <div class="skeleton-card__line skeleton-card__line--short skeleton-pulse"/>
      <div class="skeleton-card__btn skeleton-pulse"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// .skeleton-pulse и @keyframes skeleton-shimmer определены глобально в _base.scss

.skeleton-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.skeleton-card__cover {
  width: 100%;
  height: var(--cover-height);
  border-radius: 0;
}

.skeleton-card__body {
  padding: var(--space-3-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2-5);
}

.skeleton-card__title {
  height: 15px;
  width: 90%;
}

.skeleton-card__line {
  height: 12px;
  width: 75%;

  &--short {
    width: 45%;
  }
}

.skeleton-card__btn {
  height: var(--btn-size);
  margin-top: var(--space-1-5);
  border-radius: var(--radius-sm);
}
</style>
