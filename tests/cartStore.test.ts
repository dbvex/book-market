import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import type { CartItem } from '~/stores/cart';
import { useCartStore } from '~/stores/cart';

const mockBook: CartItem = {
  id: 'book-1',
  title: 'Vue 3 Deep Dive',
  authors: 'Evan You',
  imgUrl: 'https://example.com/cover.jpg'
};

const anotherBook: CartItem = {
  id: 'book-2',
  title: 'Nuxt 3 Mastery',
  authors: 'Daniel Roe',
  imgUrl: ''
};

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('starts empty', () => {
    const cart = useCartStore();
    expect(cart.items).toHaveLength(0);
    expect(cart.count).toBe(0);
  });

  it('adds a book to cart', () => {
    const cart = useCartStore();
    cart.add(mockBook);
    expect(cart.items).toHaveLength(1);
    expect(cart.count).toBe(1);
    expect(cart.isInCart('book-1')).toBe(true);
  });

  it('does not add duplicates', () => {
    const cart = useCartStore();
    cart.add(mockBook);
    cart.add(mockBook);
    expect(cart.items).toHaveLength(1);
  });

  it('adds multiple different books', () => {
    const cart = useCartStore();
    cart.add(mockBook);
    cart.add(anotherBook);
    expect(cart.items).toHaveLength(2);
    expect(cart.count).toBe(2);
  });

  it('removes a book from cart', () => {
    const cart = useCartStore();
    cart.add(mockBook);
    cart.remove('book-1');
    expect(cart.items).toHaveLength(0);
    expect(cart.isInCart('book-1')).toBe(false);
  });

  it('remove is idempotent for unknown id', () => {
    const cart = useCartStore();
    cart.remove('non-existent');
    expect(cart.items).toHaveLength(0);
  });

  it('toggle adds when not in cart', () => {
    const cart = useCartStore();
    cart.toggle(mockBook);
    expect(cart.isInCart('book-1')).toBe(true);
  });

  it('toggle removes when already in cart', () => {
    const cart = useCartStore();
    cart.add(mockBook);
    cart.toggle(mockBook);
    expect(cart.isInCart('book-1')).toBe(false);
  });

  it('clear empties the cart', () => {
    const cart = useCartStore();
    cart.add(mockBook);
    cart.add(anotherBook);
    cart.clear();
    expect(cart.items).toHaveLength(0);
    expect(cart.count).toBe(0);
  });

  it('isInCart returns false for unknown id', () => {
    const cart = useCartStore();
    expect(cart.isInCart('unknown')).toBe(false);
  });
});
