// @nuxt/eslint generates .nuxt/eslint.config.mjs after `npm run postinstall`
import withNuxt from './.nuxt/eslint.config.mjs';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default withNuxt(
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      // ── Imports ──────────────────────────────────────────────────────────
      // Auto-sort: external → aliases (~/@/#) → relative → types last
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Force `import type { X }` for type-only imports (autofix)
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],

      // ── TypeScript ────────────────────────────────────────────────────────
      // Unused vars: prefix with _ to suppress (e.g. _unused)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Disallow `any` — use `unknown` instead
      '@typescript-eslint/no-explicit-any': 'warn',

      // ── General ───────────────────────────────────────────────────────────
      'prefer-const': 'error',
      // Allow console.error / console.warn, flag console.log
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      // Highlight TODO / FIXME / HACK in code
      'no-warning-comments': ['warn', { terms: ['todo', 'fixme', 'hack', 'xxx'] }],

      // ── Vue ───────────────────────────────────────────────────────────────
      // Self-close all components and void elements
      'vue/html-self-closing': [
        'error',
        { html: { void: 'always', normal: 'always', component: 'always' } },
      ],
      // Enforce PascalCase for components in templates
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      // No extra spaces in template
      'vue/no-multi-spaces': 'error',
      // Force defineProps<Type>() syntax (not object form)
      'vue/define-props-declaration': ['error', 'type-based'],
      // v-html is XSS risk — warn, use eslint-disable-next-line where needed
      'vue/no-v-html': 'warn',
    },
  },

  // Ignore generated and build output
  {
    ignores: ['.nuxt/**', '.output/**', 'dist/**', 'node_modules/**'],
  },
);
