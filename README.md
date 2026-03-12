# Book Market

> Book catalog SPA — Nuxt 3 · Google Books API · SSR · Pinia · VueUse · Design Tokens

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt.js&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-2-ffd859)
![VueUse](https://img.shields.io/badge/VueUse-11-4FC08D)
![Vitest](https://img.shields.io/badge/Vitest-27_tests-6E9F18)

**[Live Demo →](https://bizhev.github.io/book-market/)**

---

## What this demonstrates

| Skill | How |
|-------|-----|
| **Nuxt 3 · SSR** | `useAsyncData` on catalog + detail page — renders on server, not in browser |
| **Pinia** | `useCatalogStore` (search, filter, pagination) · `useCartStore` (cart with localStorage persist) |
| **VueUse** | `useLocalStorage` · `useDark` · `watchDebounced` · `useBreakpoints` — all from `@vueuse/core` |
| **SCSS Design Tokens** | Two-layer: `_tokens.scss` (SCSS vars) → `global.scss` (CSS vars) → components use `var()` only |
| **Dark mode** | CSS `[data-theme="dark"]` attribute switching via `useDark`, zero JS color logic |
| **TypeScript strict** | `strict: true`, typed API responses, no `any` |
| **Vitest** | 27 unit tests — store logic, mapper, cart — coverage 70%+ |

---

## Architecture

```
pages/index.vue
  └── useAsyncData('catalog-books')   ← SSR: server renders book list
  └── watchDebounced(searchQuery)     ← VueUse: debounced re-fetch on search

pages/item/[id].vue
  └── useAsyncData(`book-${id}`)      ← SSR + cached by key
  └── useSeoMeta(...)                 ← OG tags from book data

stores/catalog.ts (Pinia)
  └── fetchBooks()                    ← calls shared/api/http
  └── items (computed)                ← client-side filter
  └── itemsWithPagination (computed)  ← paginated slice
  └── activeTypeLayout                ← useLocalStorage (VueUse)

stores/cart.ts (Pinia)
  └── items                           ← useLocalStorage (VueUse) — persists across sessions
  └── add / remove / toggle / clear

composables/useAdaptiveLayout.ts
  └── useBreakpoints(tailwind)        ← auto-switch grid↔list on mobile (<768px)

assets/styles/
  _tokens.scss   ← SCSS vars ($color-primary, $space-4, ...)
  global.scss    ← CSS custom properties :root + [data-theme="dark"]
  _base.scss     ← reset, skeleton-pulse @keyframes (global utility)
```

**Why `useAsyncData` instead of `onMounted` fetch:**
Page content is rendered on the server. Google indexes real books, not a spinner.
`key = book-${id}` means Nuxt reuses the cached response on client navigation.

**Why two-layer design tokens (SCSS → CSS vars):**
SCSS `_tokens.scss` is the single source of truth for raw values.
`global.scss` maps them to CSS custom properties on `:root`.
Dark theme overrides only a subset of CSS vars on `[data-theme="dark"]` — no SCSS recompile needed.

**Why `useLocalStorage` from VueUse:**
Handles serialization, SSR hydration safety, and cross-tab sync.
Cart + layout preference survive refresh without extra boilerplate.

---

## Tech Stack

| | Tech | Version |
|--|------|---------|
| Framework | Nuxt 3 | 3.14 |
| UI | Vue 3 Composition API | 3.5 |
| State | Pinia (setup stores) | 2.3 |
| Composables | VueUse | 11 |
| Language | TypeScript strict | 5.x |
| Styles | SCSS + CSS Custom Properties | sass 1.82 |
| Tests | Vitest + Vue Test Utils + @pinia/testing | 2.x |
| API | Google Books API v1 | — |
| Deploy | GitHub Pages | — |

---

## Getting Started

```bash
git clone https://github.com/doletbizhev/book-market.git
cd book-market

npm install

# Add Google Books API key
cp .env.example .env
# VITE_GOOGLE_BOOKS_API_KEY=your_key_here

npm run dev          # → http://localhost:3000/book-market/
npm test             # run all unit tests
npm run test:coverage  # tests + coverage report
npm run generate     # static build for GitHub Pages
```

---

## Project Structure

```
book-market/
├── app.vue                      # Root: dark mode + cart badge
├── pages/
│   ├── index.vue                # Catalog: useAsyncData + debounced search
│   └── item/[id].vue            # Detail: useAsyncData + useSeoMeta
├── components/
│   ├── CatalogItem.vue          # Book card: highlight + add to cart
│   ├── CatalogList.vue          # Grid/List wrapper + skeleton state
│   ├── SearchPanel.vue          # Search input (watchDebounced)
│   ├── LayoutToggle.vue         # Grid/List toggle
│   ├── AppPagination.vue        # Pagination controls
│   └── SkeletonCard.vue         # Loading skeleton (global .skeleton-pulse)
├── stores/
│   ├── catalog.ts               # Pinia: list, search filter, pagination
│   ├── cart.ts                  # Pinia: cart with useLocalStorage persist
│   └── bookMapper.ts            # IBookApi → IBook domain mapper
├── composables/
│   └── useAdaptiveLayout.ts     # useBreakpoints: auto grid↔list on mobile
├── shared/api/
│   └── http.ts                  # Axios instance — Google Books API
├── types/book.ts                # TypeScript interfaces + enums
├── assets/styles/
│   ├── _tokens.scss             # Design tokens source (SCSS vars)
│   ├── global.scss              # CSS custom properties + dark theme
│   ├── _base.scss               # Reset + skeleton-pulse utility
│   └── _mixins.scss             # Breakpoint mixins
└── tests/
    ├── bookMapper.test.ts       # 5 tests — mapper logic
    ├── catalogStore.test.ts     # 12 tests — filter, pagination, layout
    └── cartStore.test.ts        # 10 tests — add/remove/toggle/persist
```
