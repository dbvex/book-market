import {defineStore} from 'pinia';
import {http} from "#shared/api";
import type {IBook, TypeLayout} from "~/store/interface";
import {bookMapper} from "~/store/bookMapper";

const DEFAULT_SEARCH_TEXT = 'Nuxt'
const COUNT_PER_PAGE = 10;

type CatalogState = {
  books: IBook[]
  searchQuery: string
  activeTypeLayout: TypeLayout | null,
  currentPage: number,
  perPage: number,
  isLoading: boolean,
}
export const useCatalogStore = defineStore('catalog', {
  state: (): CatalogState => ({
    books: [],
    searchQuery: '',
    activeTypeLayout: 0,
    perPage: COUNT_PER_PAGE,
    currentPage: 1,
    isLoading: false,
  }),
  getters: {
    items: (state) => {
      const query = state.searchQuery.toLowerCase();
      return state.books.filter((item: IBook) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      );
    },
    itemsWithPagination(): IBook[] | undefined {
      if (this.currentPage && this.perPage) {
        const startIndex = (this.currentPage - 1) * this.perPage;
        const endIndex = startIndex + this.perPage;
        return this.items.slice(startIndex, endIndex);
      }
    }
  },
  actions: {
    async fetchBooks(query = DEFAULT_SEARCH_TEXT) {
      this.isLoading = true;
      try {
        const {data} = await http.get(`/volumes?q=intitle:${query}&maxResults=40`)
        this.books = bookMapper(data.items ?? []);
      } catch (error) {
        console.error('Error in fetching data:', error);
      } finally {
        this.isLoading = false;
      }
    },
    setTypeLayout(type: TypeLayout) {
      this.activeTypeLayout = type;
    },
    setActiveStep(currentPage: number) {
      this.currentPage = currentPage;
    }
  },
});
