# Book Market

Online bookstore catalog built with Nuxt 3, Vue 3, TypeScript and Pinia.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D)](https://vuejs.org/)

**[Live Demo →](https://doletbizhev.github.io/book-market/)**

---

## Features

- **Book search** — real-time filtering across title, author, date, country
- **Grid / List layout toggle** — switch between card grid and list view
- **Pagination** — configurable items per page
- **Book detail page** — individual page for each book with cover and metadata
- **Google Books API** — live data, 40 books per search query
- **Search highlight** — matching text highlighted in results

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 3.14, Vue 3 |
| Language | TypeScript (strict) |
| State | Pinia (Options + Setup store) |
| Styling | SCSS with variables and mixins |
| HTTP | Axios with base URL config |
| Testing | Vitest |
| Build | Vite (via Nuxt) |
| Deploy | GitHub Pages (static) |

## Architecture

The app follows a layered data flow:

```
Google Books API
    ↓
shared/api/http (axios instance)
    ↓
catalog store (Pinia) — fetchBooks → bookMapper → IBook[]
    ↓
composables / computed getters (search, pagination, layout)
    ↓
CatalogList → CatalogItem → SearchPanel
```

Key decisions:
- **bookMapper** — transforms raw API response (`IBookApi`) into a clean domain model (`IBook`), decoupling the UI from the API shape
- **Pinia getters** — `items` (filtered by search) and `itemsWithPagination` (sliced) keep the component layer thin
- **TypeScript strict mode** — all API and domain types explicitly defined in `store/interface.ts`

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
# Set VITE_BASE_URL=https://www.googleapis.com/books/v1/
```

## Project Structure

```
├── components/
│   ├── CatalogItem.vue       # Book card with search highlight
│   ├── CatalogList.vue       # Grid/list wrapper
│   ├── SearchPanel.vue       # Search input + pagination + layout toggle
│   └── buttons/
│       └── toggleButtons/    # Reusable toggle button group
├── composables/
│   └── useFetchData.ts       # Data fetching composable
├── pages/
│   ├── index.vue             # Catalog page
│   └── item/[id].vue         # Book detail page
├── shared/
│   └── api/                  # Axios HTTP client
├── store/
│   ├── catalog.ts            # Pinia store (state, getters, actions)
│   ├── bookMapper.ts         # API → domain model transformer
│   └── interface.ts          # TypeScript types and enums
└── tests/
    └── bookMapper.test.ts    # Unit tests for data mapper
```
