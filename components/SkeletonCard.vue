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
@keyframes skeleton-shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}

.skeleton-pulse {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-shine) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 1200px 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

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
  height: 160px;
  border-radius: 0;
}

.skeleton-card__body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  height: 34px;
  margin-top: 6px;
  border-radius: var(--radius-sm);
}
</style>
