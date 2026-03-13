import axios from 'axios';
import { useLocalStorage } from '@vueuse/core';
import { defineStore, skipHydrate } from 'pinia';
import { computed, ref } from 'vue';

import { http } from '#shared/api';
import { generateMockBooks } from '~/shared/mocks/generateBooks';
import { bookMapper } from '~/stores/bookMapper';
import type { IBook, TypeLayout } from '~/types/book';

const DEFAULT_SEARCH_TEXT = 'Nuxt';
const COUNT_PER_PAGE = 10;

export type ApiNotice = { type: 'info' | 'error'; message: string };

export const useCatalogStore = defineStore('catalog', () => {
  const books = ref<IBook[]>([]);
  const searchQuery = ref('');
  const activeTypeLayout = useLocalStorage<TypeLayout>('book-market:layout', 0);
  const useMock = useLocalStorage('book-market:mock', false);
  const currentPage = ref(1);
  const perPage = ref(COUNT_PER_PAGE);
  const isLoading = ref(false);
  const apiNotice = ref<ApiNotice | null>(null);

  const items = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return books.value.filter((item: IBook) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
  });

  const itemsWithPagination = computed<IBook[] | undefined>(() => {
    const start = (currentPage.value - 1) * perPage.value;
    return items.value.slice(start, start + perPage.value);
  });

  async function fetchBooks(query = DEFAULT_SEARCH_TEXT): Promise<IBook[]> {
    apiNotice.value = null;

    if (useMock.value) {
      if (books.value.length === 0) books.value = generateMockBooks();
      return books.value;
    }

    isLoading.value = true;
    try {
      const { data } = await http.get(`/volumes?q=intitle:${query}&maxResults=40`);
      books.value = bookMapper(data.items ?? []);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        useMock.value = true;
        books.value = generateMockBooks();
        apiNotice.value = {
          type: 'info',
          message: 'API rate limit reached — switched to mock data automatically.'
        };
      } else {
        apiNotice.value = {
          type: 'error',
          message: error instanceof Error ? error.message : String(error)
        };
        console.error('Error in fetching data:', error);
      }
    } finally {
      isLoading.value = false;
    }
    return books.value;
  }

  function setTypeLayout(type: TypeLayout) {
    activeTypeLayout.value = type;
  }

  function setActiveStep(page: number) {
    currentPage.value = page;
  }

  return {
    books,
    searchQuery,
    activeTypeLayout: skipHydrate(activeTypeLayout),
    useMock: skipHydrate(useMock),
    currentPage,
    perPage,
    isLoading,
    apiNotice,
    items,
    itemsWithPagination,
    fetchBooks,
    setTypeLayout,
    setActiveStep
  };
});
