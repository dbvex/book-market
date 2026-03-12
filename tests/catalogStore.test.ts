import { createPinia,setActivePinia } from 'pinia';
import { beforeEach,describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';

import { http } from '#shared/api';
import { useCatalogStore } from '~/stores/catalog';
import type { IBook } from '~/types/book';
import { TypeLayout } from '~/types/book';

// Mock @vueuse/core — avoid localStorage dependency in node environment
vi.mock('@vueuse/core', () => ({
  useLocalStorage: <T>(_key: string, initialValue: T) => ref(initialValue)
}));

// Mock HTTP client — avoid network calls in tests
vi.mock('#shared/api', () => ({
  http: {
    get: vi.fn()
  }
}));

const mockBooks: IBook[] = [
  { id: '1', title: 'Vue.js Guide', authors: 'Evan You', date: '2023-01-01', country: 'US', imgUrl: '' },
  { id: '2', title: 'TypeScript Deep Dive', authors: 'Basarat Ali', date: '2022-06-15', country: 'US', imgUrl: '' },
  { id: '3', title: 'Nuxt Cookbook', authors: 'Debbie O', date: '2024-03-10', country: 'UK', imgUrl: '' },
  { id: '4', title: 'Clean Code', authors: 'Robert Martin', date: '2008-08-01', country: 'US', imgUrl: '' }
];

describe('useCatalogStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('items — filtered computed', () => {
    it('returns all books when searchQuery is empty', () => {
      const store = useCatalogStore();
      store.books = mockBooks;
      expect(store.items).toHaveLength(4);
    });

    it('filters by title (case-insensitive)', () => {
      const store = useCatalogStore();
      store.books = mockBooks;
      store.searchQuery = 'vue';
      expect(store.items).toHaveLength(1);
      expect(store.items[0].title).toBe('Vue.js Guide');
    });

    it('filters by author', () => {
      const store = useCatalogStore();
      store.books = mockBooks;
      store.searchQuery = 'basarat';
      expect(store.items).toHaveLength(1);
      expect(store.items[0].authors).toBe('Basarat Ali');
    });

    it('returns empty array when nothing matches', () => {
      const store = useCatalogStore();
      store.books = mockBooks;
      store.searchQuery = 'xyz-nonexistent';
      expect(store.items).toHaveLength(0);
    });
  });

  describe('itemsWithPagination', () => {
    it('returns first page correctly', () => {
      const store = useCatalogStore();
      store.books = mockBooks;
      store.perPage = 2;
      store.currentPage = 1;
      expect(store.itemsWithPagination).toHaveLength(2);
      expect(store.itemsWithPagination![0].id).toBe('1');
    });

    it('returns second page correctly', () => {
      const store = useCatalogStore();
      store.books = mockBooks;
      store.perPage = 2;
      store.currentPage = 2;
      expect(store.itemsWithPagination).toHaveLength(2);
      expect(store.itemsWithPagination![0].id).toBe('3');
    });

    it('returns remaining items on last page', () => {
      const store = useCatalogStore();
      store.books = mockBooks;
      store.perPage = 3;
      store.currentPage = 2;
      expect(store.itemsWithPagination).toHaveLength(1);
      expect(store.itemsWithPagination![0].id).toBe('4');
    });
  });

  describe('setTypeLayout', () => {
    it('switches to List layout', () => {
      const store = useCatalogStore();
      store.setTypeLayout(TypeLayout.List);
      expect(store.activeTypeLayout).toBe(TypeLayout.List);
    });

    it('switches back to Grid layout', () => {
      const store = useCatalogStore();
      store.setTypeLayout(TypeLayout.List);
      store.setTypeLayout(TypeLayout.Grid);
      expect(store.activeTypeLayout).toBe(TypeLayout.Grid);
    });
  });

  describe('setActiveStep', () => {
    it('updates currentPage', () => {
      const store = useCatalogStore();
      store.setActiveStep(3);
      expect(store.currentPage).toBe(3);
    });
  });

  describe('fetchBooks', () => {
    it('sets isLoading during fetch and clears on success', async () => {
      const store = useCatalogStore();
      vi.mocked(http.get).mockResolvedValueOnce({ data: { items: [] } });

      const fetchPromise = store.fetchBooks('test');
      expect(store.isLoading).toBe(true);
      await fetchPromise;
      expect(store.isLoading).toBe(false);
    });

    it('handles fetch error gracefully', async () => {
      const store = useCatalogStore();
      vi.mocked(http.get).mockRejectedValueOnce(new Error('Network error'));

      await store.fetchBooks('test');
      expect(store.isLoading).toBe(false);
      expect(store.books).toHaveLength(0);
    });
  });
});
