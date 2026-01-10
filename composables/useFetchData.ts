import { ref } from 'vue';
import type { IBook } from '~/store/interface';
import { useCatalogStore } from '~/store/catalog';

export function useFetchData() {
  const catalogStore = useCatalogStore();
  const data = ref<IBook[] | null>(null);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  const fetchData = async () => {
    loading.value = true;
    try {
      await catalogStore.fetchBooks();
      data.value = catalogStore.books;
    } catch (err) {
      error.value = (err as Error).message || 'Error fetching data...';
    } finally {
      loading.value = false;
    }
  };

  return { data, error, loading, fetchData };
}
