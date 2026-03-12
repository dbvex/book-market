import { useLocalStorage } from '@vueuse/core';
import { defineStore, skipHydrate } from 'pinia';
import { computed } from 'vue';

import type { IBook } from '~/types/book';

export type CartItem = Pick<IBook, 'id' | 'title' | 'authors' | 'imgUrl'>;

export const useCartStore = defineStore('cart', () => {
  // Persisted in localStorage via VueUse — survives page refresh
  const items = useLocalStorage<CartItem[]>('book-market:cart', []);

  const count = computed(() => items.value.length);

  const isInCart = (id: string): boolean =>
    items.value.some((item) => item.id === id);

  function add(book: CartItem): void {
    if (!isInCart(book.id)) {
      items.value = [...items.value, book];
    }
  }

  function remove(id: string): void {
    items.value = items.value.filter((item) => item.id !== id);
  }

  function toggle(book: CartItem): void {
    if (isInCart(book.id)) {
      remove(book.id);
    } else {
      add(book);
    }
  }

  function clear(): void {
    items.value = [];
  }

  return { items: skipHydrate(items), count, isInCart, add, remove, toggle, clear };
});
