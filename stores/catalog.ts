import { useLocalStorage } from '@vueuse/core';
import { defineStore, skipHydrate } from 'pinia';
import { computed,ref } from 'vue';

import { http } from '#shared/api';
import { bookMapper } from '~/stores/bookMapper';
import type { IBook, TypeLayout } from '~/types/book';

const DEFAULT_SEARCH_TEXT = 'Nuxt';
const COUNT_PER_PAGE = 10;

export const useCatalogStore = defineStore('catalog', () => {
  const books = ref<IBook[]>([]);
  const searchQuery = ref('');
  const activeTypeLayout = useLocalStorage<TypeLayout>('book-market:layout', 0);
  const currentPage = ref(1);
  const perPage = ref(COUNT_PER_PAGE);
  const isLoading = ref(false);

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
    isLoading.value = true;
    try {
      const { data } = await http.get(`/volumes?q=intitle:${query}&maxResults=40`);
      books.value = bookMapper(data.items ?? []);
    } catch (error) {
      console.error('Error in fetching data:', error);
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
    currentPage,
    perPage,
    isLoading,
    items,
    itemsWithPagination,
    fetchBooks,
    setTypeLayout,
    setActiveStep
  };
});
