<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="app-header__inner">
        <NuxtLink to="/" class="app-logo">
          <span class="app-logo__icon">📚</span>
          <span class="app-logo__name">Book Market</span>
        </NuxtLink>
      </div>
    </header>
    <NuxtPage />
  </div>
</template>

<style lang="scss">
.app-shell {
  min-height: 100vh;
  background-color: $background;
}

.app-header {
  background: $surface;
  border-bottom: 1px solid $border;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.app-header__inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

  &__icon {
    font-size: 1.4rem;
    line-height: 1;
  }

  &__name {
    font-size: 1.15rem;
    font-weight: 700;
    color: $text;
    letter-spacing: -0.02em;
  }
}
</style>
