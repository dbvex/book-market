# Book Market

Online bookstore catalog built with Nuxt 3, Vue 3, TypeScript and Pinia.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D)](https://vuejs.org/)
[![VueUse](https://img.shields.io/badge/VueUse-11.x-41B883)](https://vueuse.org/)

**[Live Demo →](https://doletbizhev.github.io/book-market/)**

---

## Features

- **Book search** — real-time filtering across title, author, date, country
- **Dark mode** — persistent theme toggle via `useDark` (VueUse)
- **Grid / List layout** — toggle persisted to localStorage via `useLocalStorage`
- **Pagination** — configurable items per page
- **Book detail page** — individual page with cover, metadata, rating, buy link
- **Google Books API** — live data, 40 books per search query
- **Search highlight** — matching text highlighted in results

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 3.14, Vue 3 |
| Language | TypeScript (strict) |
| State | Pinia (Setup store) |
| Utilities | VueUse — `useDark`, `useLocalStorage`, `watchDebounced` |
| Styling | SCSS + CSS custom properties (runtime theming) |
| HTTP | Axios with base URL config |
| Testing | Vitest + @pinia/testing — 17 unit tests |
| Build | Vite (via Nuxt) |
| Deploy | GitHub Pages via pnpm + GitHub Actions |

## Architecture

```
Google Books API
    ↓
shared/api/http (axios instance)
    ↓
stores/catalog.ts (Pinia setup store) — fetchBooks → bookMapper → IBook[]
    ↓
computed getters — items (filtered) → itemsWithPagination (paginated)
    ↓
CatalogList → CatalogItem → SearchPanel
```

Key decisions:
- **bookMapper** — transforms raw `IBookApi` into clean `IBook` domain model, decoupling UI from API shape
- **Pinia setup store** — `items` and `itemsWithPagination` as computed keep components thin
- **CSS custom properties** — theming via `[data-theme="dark"]` overrides; SCSS used only for compile-time utilities
- **VueUse** — `watchDebounced` replaces manual `setTimeout`, `useLocalStorage` persists layout preference
- **TypeScript strict** — all types in `types/book.ts`

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Run tests
npm test

# Build static site
npm run generate
```

### Environment

```bash
cp .env.example .env
# Set VITE_GOOGLE_BOOKS_API_KEY=your_key_here
```

## Project Structure

```
├── app.vue                   # Root layout with dark mode toggle
├── components/
│   ├── CatalogItem.vue       # Book card with search highlight
│   ├── CatalogList.vue       # Grid/list wrapper with skeleton loading
│   ├── SearchPanel.vue       # Search input + layout toggle
│   ├── LayoutToggle.vue      # Grid/List toggle buttons
│   ├── AppPagination.vue     # Pagination controls
│   └── SkeletonCard.vue      # Loading skeleton
├── pages/
│   ├── index.vue             # Catalog page
│   └── item/[id].vue         # Book detail page
├── stores/
│   ├── catalog.ts            # Pinia setup store (state, computed, actions)
│   └── bookMapper.ts         # IBookApi → IBook transformer
├── types/
│   └── book.ts               # TypeScript interfaces and enums
├── shared/
│   └── api/                  # Axios HTTP client
├── assets/styles/
│   ├── global.scss           # CSS custom properties + dark theme tokens
│   └── _variables.scss       # SCSS compile-time variables
└── tests/
    ├── bookMapper.test.ts    # Data mapper unit tests (5 tests)
    └── catalogStore.test.ts  # Pinia store unit tests (12 tests)
```
