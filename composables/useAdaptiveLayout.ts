import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { watch } from 'vue';

import { useCatalogStore } from '~/stores/catalog';
import { TypeLayout } from '~/types/book';

/**
 * Auto-switches catalog layout based on screen size.
 * Uses VueUse `useBreakpoints` with Tailwind breakpoints.
 * Mobile (<768px) → List layout; Desktop → Grid layout.
 */
export function useAdaptiveLayout() {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isMobile = breakpoints.smaller('md');
  const catalogStore = useCatalogStore();

  watch(
    isMobile,
    (mobile) => {
      catalogStore.setTypeLayout(mobile ? TypeLayout.List : TypeLayout.Grid);
    },
    { immediate: true }
  );

  return { isMobile };
}
