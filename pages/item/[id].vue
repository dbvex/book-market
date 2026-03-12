<template>
  <div class="book-detail">
    <NuxtLink class="back-link" to="/">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M10.06 3.47a.75.75 0 0 1 0 1.06L6.59 8l3.47 3.47a.75.75 1 1 1-1.06 1.06L4.47 8l5.59-4.53z"/>
      </svg>
      Back to catalog
    </NuxtLink>

    <div v-if="pending" class="book-skeleton">
      <div class="book-skeleton__cover skeleton-pulse"/>
      <div class="book-skeleton__info">
        <div class="skeleton-pulse" style="height:28px; width:70%; margin-bottom:10px; border-radius:6px;"/>
        <div class="skeleton-pulse" style="height:18px; width:50%; margin-bottom:24px; border-radius:6px;"/>
        <div class="skeleton-pulse" style="height:14px; width:40%; margin-bottom:8px; border-radius:6px;"/>
        <div class="skeleton-pulse" style="height:14px; width:35%; margin-bottom:8px; border-radius:6px;"/>
        <div class="skeleton-pulse" style="height:14px; width:45%; margin-bottom:32px; border-radius:6px;"/>
        <div class="skeleton-pulse" style="height:40px; width:160px; border-radius:8px;"/>
      </div>
    </div>

    <template v-else-if="book">
      <div class="book-card">
        <div class="book-card__cover-wrap">
          <img :src="coverUrl" :alt="book.volumeInfo.title" class="book-card__cover" />
        </div>

        <div class="book-card__info">
          <div class="book-card__header">
            <h1 class="book-card__title">{{ book.volumeInfo.title }}</h1>
            <p v-if="book.volumeInfo.subtitle" class="book-card__subtitle">{{ book.volumeInfo.subtitle }}</p>
          </div>

          <div class="book-card__meta">
            <div v-if="authors" class="meta-row">
              <span class="meta-label">Author</span>
              <span class="meta-value">{{ authors }}</span>
            </div>
            <div v-if="book.volumeInfo.publisher" class="meta-row">
              <span class="meta-label">Publisher</span>
              <span class="meta-value">{{ book.volumeInfo.publisher }}</span>
            </div>
            <div v-if="book.volumeInfo.publishedDate" class="meta-row">
              <span class="meta-label">Published</span>
              <span class="meta-value">{{ formatDate(book.volumeInfo.publishedDate) }}</span>
            </div>
            <div v-if="book.volumeInfo.pageCount" class="meta-row">
              <span class="meta-label">Pages</span>
              <span class="meta-value">{{ book.volumeInfo.pageCount }}</span>
            </div>
            <div v-if="book.volumeInfo.language" class="meta-row">
              <span class="meta-label">Language</span>
              <span class="meta-value">{{ formatLanguage(book.volumeInfo.language) }}</span>
            </div>
            <div v-if="isbn" class="meta-row">
              <span class="meta-label">ISBN</span>
              <span class="meta-value">{{ isbn }}</span>
            </div>
            <div v-if="book.saleInfo.isEbook" class="meta-row">
              <span class="meta-label">Format</span>
              <span class="meta-value meta-badge">eBook</span>
            </div>
          </div>

          <div v-if="book.volumeInfo.categories?.length" class="book-card__categories">
            <span
              v-for="cat in book.volumeInfo.categories"
              :key="cat"
              class="category-tag"
            >{{ cat.split('/').pop()?.trim() }}</span>
          </div>

          <div v-if="book.volumeInfo.averageRating" class="book-card__rating">
            <span class="rating-stars">{{ renderStars(book.volumeInfo.averageRating) }}</span>
            <span class="rating-value">{{ book.volumeInfo.averageRating }}</span>
            <span v-if="book.volumeInfo.ratingsCount" class="rating-count">({{ book.volumeInfo.ratingsCount }} ratings)</span>
          </div>

          <div class="book-card__actions">
            <a
              v-if="book.volumeInfo.previewLink"
              :href="book.volumeInfo.previewLink"
              target="_blank"
              rel="noopener"
              class="btn btn--primary"
            >Preview →</a>
            <a
              v-if="book.saleInfo.buyLink"
              :href="book.saleInfo.buyLink"
              target="_blank"
              rel="noopener"
              class="btn btn--secondary"
            >{{ buyLabel }}</a>
            <a
              v-else-if="book.accessInfo.webReaderLink && book.accessInfo.viewability !== 'NO_PAGES'"
              :href="book.accessInfo.webReaderLink"
              target="_blank"
              rel="noopener"
              class="btn btn--secondary"
            >Read online</a>
          </div>
        </div>
      </div>

      <div v-if="book.volumeInfo.description" class="book-description">
        <h2 class="book-description__title">About this book</h2>
        <p class="book-description__text">{{ book.volumeInfo.description }}</p>
      </div>
    </template>

    <div v-else class="not-found">
      <p>Book not found.</p>
      <NuxtLink to="/">← Back to catalog</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

import { http } from '#shared/api';
import type { IBookApi } from '~/types/book';

const route = useRoute();
const id = route.params.id as string;

const { data: book, pending } = await useAsyncData(`book-${id}`, async () => {
  const res = await http.get<IBookApi>(`/volumes/${id}`);
  return res.data;
});

const coverUrl = computed(() => {
  const links = book.value?.volumeInfo.imageLinks;
  const url = links?.medium || links?.small || links?.thumbnail || links?.smallThumbnail || '';
  return url.replace('http://', 'https://');
});

const authors = computed(() =>
  book.value?.volumeInfo.authors?.join(', ') || ''
);

const isbn = computed(() => {
  const ids = book.value?.volumeInfo.industryIdentifiers || [];
  return ids.find(i => i.type === 'ISBN_13')?.identifier
    || ids.find(i => i.type === 'ISBN_10')?.identifier
    || null;
});

const buyLabel = computed(() => {
  const price = book.value?.saleInfo.retailPrice;
  if (price) return `Buy · ${price.amount} ${price.currencyCode}`;
  return 'Buy';
});

const LANG_NAMES: Record<string, string> = {
  en: 'English', ru: 'Russian', de: 'German', fr: 'French',
  es: 'Spanish', ja: 'Japanese', zh: 'Chinese', pt: 'Portuguese',
  ko: 'Korean', it: 'Italian', nl: 'Dutch',
};
const formatLanguage = (code: string) => LANG_NAMES[code] || code.toUpperCase();

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  if (dateStr.length >= 10) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  }
  return dateStr;
};

const renderStars = (rating: number): string => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(5 - full - half);
};
</script>

<style scoped lang="scss">
@keyframes skeleton-shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}

.skeleton-pulse {
  background: linear-gradient(90deg, #e2e8f0 25%, #f8fafc 50%, #e2e8f0 75%);
  background-size: 1200px 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.book-detail {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 24px 60px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: $text-secondary;
  margin-bottom: 28px;
  transition: color var(--transition);

  &:hover {
    color: $primary;
    text-decoration: none;
  }
}

// Skeleton
.book-skeleton {
  display: flex;
  gap: 36px;

  &__cover {
    width: 180px;
    height: 260px;
    flex-shrink: 0;
    border-radius: var(--radius-md);
  }

  &__info {
    flex: 1;
    padding-top: 4px;
  }
}

// Book card
.book-card {
  display: flex;
  gap: 36px;
  align-items: flex-start;
}

.book-card__cover-wrap {
  flex-shrink: 0;
  width: 180px;
}

.book-card__cover {
  width: 100%;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  display: block;
}

.book-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.book-card__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.book-card__title {
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.25;
}

.book-card__subtitle {
  font-size: 0.95rem;
  color: $text-secondary;
  margin: 0;
  font-style: italic;
}

// Meta table
.book-card__meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-row {
  display: flex;
  gap: 12px;
  font-size: 0.875rem;
  align-items: baseline;
}

.meta-label {
  width: 86px;
  flex-shrink: 0;
  color: $text-secondary;
  font-weight: 500;
}

.meta-value {
  color: var(--color-text);
}

.meta-badge {
  display: inline-block;
  background: #dbeafe;
  color: #1d4ed8;
  padding: 1px 8px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
}

// Categories
.book-card__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.category-tag {
  font-size: 0.75rem;
  background: $background;
  color: $text-secondary;
  padding: 3px 10px;
  border-radius: 100px;
  border: 1px solid $border;
}

// Rating
.book-card__rating {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

.rating-stars { color: $accent; letter-spacing: 1px; }
.rating-value { font-weight: 600; }
.rating-count { color: $text-secondary; }

// Actions
.book-card__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background var(--transition), color var(--transition), border-color var(--transition);

  &--primary {
    background: $primary;
    color: $white;
    &:hover { background: $primary-hover; text-decoration: none; color: $white; }
  }

  &--secondary {
    background: $surface;
    color: $text;
    border: 1px solid $border;
    &:hover { border-color: $primary; color: $primary; text-decoration: none; }
  }
}

// Description
.book-description {
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid $border;

  &__title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 12px;
  }

  &__text {
    font-size: 0.9rem;
    color: $text-secondary;
    line-height: 1.75;
    margin: 0;
    white-space: pre-line;
  }
}

// Not found
.not-found {
  text-align: center;
  padding: 60px 24px;
  color: $text-secondary;
  p { margin-bottom: 12px; }
}

// Mobile
@media (max-width: 580px) {
  .book-card {
    flex-direction: column;
    align-items: center;
  }

  .book-card__cover-wrap { width: 140px; }
  .book-card__title { font-size: 1.25rem; }

  .book-skeleton {
    flex-direction: column;
    &__cover { width: 140px; height: 200px; }
  }
}
</style>
