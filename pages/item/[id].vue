<template>
  <div class="book-detail">
    <NuxtLink class="back-link" to="/">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M10.06 3.47a.75.75 0 0 1 0 1.06L6.59 8l3.47 3.47a.75.75 0 1 1-1.06 1.06L4.47 8l5.59-4.53z"/>
      </svg>
      Back to catalog
    </NuxtLink>
    <div v-if="pending" class="book-skeleton">
      <div class="book-skeleton__cover skeleton-pulse"/>
      <div class="book-skeleton__info">
        <div class="skeleton-line skeleton-line--heading skeleton-pulse"/>
        <div class="skeleton-line skeleton-line--subheading skeleton-pulse"/>
        <div class="skeleton-line skeleton-line--meta skeleton-line--w40 skeleton-pulse"/>
        <div class="skeleton-line skeleton-line--meta skeleton-line--w35 skeleton-pulse"/>
        <div class="skeleton-line skeleton-line--meta skeleton-line--w45 skeleton-pulse"/>
        <div class="skeleton-line skeleton-line--action skeleton-pulse"/>
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
            <div v-if="authors" class="meta-row"><span class="meta-label">Author</span><span class="meta-value">{{ authors }}</span></div>
            <div v-if="book.volumeInfo.publisher" class="meta-row"><span class="meta-label">Publisher</span><span class="meta-value">{{ book.volumeInfo.publisher }}</span></div>
            <div v-if="book.volumeInfo.publishedDate" class="meta-row"><span class="meta-label">Published</span><span class="meta-value">{{ formatDate(book.volumeInfo.publishedDate) }}</span></div>
            <div v-if="book.volumeInfo.pageCount" class="meta-row"><span class="meta-label">Pages</span><span class="meta-value">{{ book.volumeInfo.pageCount }}</span></div>
            <div v-if="book.volumeInfo.language" class="meta-row"><span class="meta-label">Language</span><span class="meta-value">{{ formatLanguage(book.volumeInfo.language) }}</span></div>
            <div v-if="isbn" class="meta-row"><span class="meta-label">ISBN</span><span class="meta-value">{{ isbn }}</span></div>
            <div v-if="book.saleInfo.isEbook" class="meta-row"><span class="meta-label">Format</span><span class="meta-value meta-badge">eBook</span></div>
          </div>
          <div v-if="book.volumeInfo.categories?.length" class="book-card__categories">
            <span v-for="cat in book.volumeInfo.categories" :key="cat" class="category-tag">
              {{ cat.split('/').pop()?.trim() }}
            </span>
          </div>
          <div v-if="book.volumeInfo.averageRating" class="book-card__rating">
            <span class="rating-stars">{{ renderStars(book.volumeInfo.averageRating) }}</span>
            <span class="rating-value">{{ book.volumeInfo.averageRating }}</span>
            <span v-if="book.volumeInfo.ratingsCount" class="rating-count">({{ book.volumeInfo.ratingsCount }} ratings)</span>
          </div>
          <div class="book-card__actions">
            <a v-if="book.volumeInfo.previewLink" :href="book.volumeInfo.previewLink" target="_blank" rel="noopener" class="btn btn--primary">Preview &#8594;</a>
            <a v-if="book.saleInfo.buyLink" :href="book.saleInfo.buyLink" target="_blank" rel="noopener" class="btn btn--secondary">{{ buyLabel }}</a>
            <a v-else-if="book.accessInfo.webReaderLink && book.accessInfo.viewability !== 'NO_PAGES'" :href="book.accessInfo.webReaderLink" target="_blank" rel="noopener" class="btn btn--secondary">Read online</a>
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
      <NuxtLink to="/">&#8592; Back to catalog</NuxtLink>
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

const authors = computed(() => book.value?.volumeInfo.authors?.join(', ') || '');

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
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
// .skeleton-pulse и @keyframes — глобально в _base.scss

.book-detail {
  max-width: var(--detail-max-width);
  margin: 0 auto;
  padding: var(--space-6) var(--space-6) var(--space-15);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1-5);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-7);
  transition: color var(--transition);
  &:hover { color: var(--color-primary); text-decoration: none; }
}

.book-skeleton {
  display: flex;
  gap: var(--space-9);
  &__cover { width: var(--book-cover-width); height: 260px; flex-shrink: 0; border-radius: var(--radius-md); }
  &__info  { flex: 1; padding-top: var(--space-1); }
}

.skeleton-line {
  border-radius: var(--radius-sm);
  &--heading    { height: 28px; width: 70%; margin-bottom: var(--space-2-5); }
  &--subheading { height: 18px; width: 50%; margin-bottom: var(--space-6); }
  &--meta       { height: 14px; margin-bottom: var(--space-2); }
  &--w35        { width: 35%; }
  &--w40        { width: 40%; }
  &--w45        { width: 45%; margin-bottom: var(--space-8); }
  &--action     { height: 40px; width: 160px; }
}

.book-card { display: flex; gap: var(--space-9); align-items: flex-start; }
.book-card__cover-wrap { flex-shrink: 0; width: var(--book-cover-width); }
.book-card__cover { width: 100%; border-radius: var(--radius-md); box-shadow: var(--shadow-md); display: block; }
.book-card__info { flex: 1; display: flex; flex-direction: column; gap: var(--space-5); }
.book-card__header { display: flex; flex-direction: column; gap: var(--space-1-5); }

.book-card__title { font-size: var(--text-xl); font-weight: 700; color: var(--color-text); line-height: var(--leading-snug); }
.book-card__subtitle { font-size: var(--text-base); color: var(--color-text-secondary); margin: 0; font-style: italic; }
.book-card__meta { display: flex; flex-direction: column; gap: var(--space-2); }
.meta-row { display: flex; gap: var(--space-3); font-size: var(--text-sm); align-items: baseline; }
.meta-label { width: var(--meta-label-width); flex-shrink: 0; color: var(--color-text-secondary); font-weight: 500; }
.meta-value { color: var(--color-text); }

.meta-badge {
  display: inline-block;
  background: var(--color-badge-bg);
  color: var(--color-badge-text);
  padding: 1px var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 500;
}

.book-card__categories { display: flex; flex-wrap: wrap; gap: var(--space-1-5); }
.category-tag {
  font-size: var(--text-xs);
  background: var(--color-bg);
  color: var(--color-text-secondary);
  padding: 3px var(--space-2-5);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
}

.book-card__rating { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-sm); }
.rating-stars { color: var(--color-accent); letter-spacing: 1px; }
.rating-value { font-weight: 600; }
.rating-count { color: var(--color-text-secondary); }
.book-card__actions { display: flex; gap: var(--space-2-5); flex-wrap: wrap; }

.btn {
  display: inline-block;
  padding: var(--space-2-5) var(--space-5);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 500;
  text-decoration: none;
  transition: background var(--transition), color var(--transition), border-color var(--transition);
  &--primary {
    background: var(--color-primary);
    color: var(--color-text-on-primary);
    &:hover { background: var(--color-primary-hover); text-decoration: none; color: var(--color-text-on-primary); }
  }
  &--secondary {
    background: var(--color-surface);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    &:hover { border-color: var(--color-primary); color: var(--color-primary); text-decoration: none; }
  }
}

.book-description {
  margin-top: var(--space-9);
  padding-top: var(--space-7);
  border-top: 1px solid var(--color-border);
  &__title { font-size: var(--text-base); font-weight: 600; color: var(--color-text); margin-bottom: var(--space-3); }
  &__text  { font-size: var(--text-sm); color: var(--color-text-secondary); line-height: var(--leading-relaxed); margin: 0; white-space: pre-line; }
}

.not-found {
  text-align: center;
  padding: var(--space-15) var(--space-6);
  color: var(--color-text-secondary);
  p { margin-bottom: var(--space-3); }
}

@media (max-width: 580px) {
  .book-card { flex-direction: column; align-items: center; }
  .book-card__cover-wrap { width: 140px; }
  .book-card__title { font-size: var(--text-lg); }
  .book-skeleton { flex-direction: column; }
  .book-skeleton__cover { width: 140px; height: 200px; }
}
</style>
