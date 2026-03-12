import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['stores/**/*.ts', 'composables/**/*.ts'],
      thresholds: {
        lines: 70,
        functions: 70
      }
    }
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '@': resolve(__dirname, '.'),
      '#shared/api': resolve(__dirname, './shared/api')
    }
  }
});
