import { describe, expect,it } from 'vitest';

import { bookMapper } from '~/stores/bookMapper';
import type { IBookApi } from '~/types/book';

const mockBookApi: IBookApi = {
  kind: 'books#volume',
  id: 'abc123',
  etag: 'etag',
  selfLink: 'https://books.googleapis.com/books/v1/volumes/abc123',
  volumeInfo: {
    title: 'Clean Code',
    subtitle: '',
    authors: ['Robert C. Martin'],
    publishedDate: '2008-08-01',
    industryIdentifiers: [],
    readingModes: { text: true, image: false },
    pageCount: 431,
    printType: 'BOOK',
    maturityRating: 'NOT_MATURE',
    allowAnonLogging: false,
    contentVersion: '1.0',
    panelizationSummary: { containsEpubBubbles: false, containsImageBubbles: false },
    imageLinks: {
      smallThumbnail: 'https://books.google.com/thumbnail.jpg',
      thumbnail: 'https://books.google.com/thumbnail-large.jpg'
    },
    language: 'en',
    previewLink: '',
    infoLink: '',
    canonicalVolumeLink: ''
  },
  saleInfo: {
    country: 'US',
    saleability: 'FOR_SALE',
    isEbook: false,
    buyLink: ''
  },
  accessInfo: {
    country: 'US',
    viewability: 'PARTIAL',
    embeddable: true,
    publicDomain: true,
    textToSpeechPermission: 'ALLOWED',
    epub: { isAvailable: true, downloadLink: '' },
    pdf: { isAvailable: false },
    webReaderLink: '',
    accessViewStatus: 'SAMPLE',
    quoteSharingAllowed: false
  }
};

describe('bookMapper', () => {
  it('maps API response to IBook format', () => {
    const result = bookMapper([mockBookApi]);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('abc123');
    expect(result[0].title).toBe('Clean Code');
    expect(result[0].authors).toBe('Robert C. Martin');
    expect(result[0].date).toBe('2008-08-01');
    expect(result[0].country).toBe('US');
    expect(result[0].imgUrl).toBe('https://books.google.com/thumbnail.jpg');
  });

  it('joins multiple authors with comma', () => {
    const bookWithMultipleAuthors = {
      ...mockBookApi,
      volumeInfo: {
        ...mockBookApi.volumeInfo,
        authors: ['Author One', 'Author Two', 'Author Three']
      }
    };

    const result = bookMapper([bookWithMultipleAuthors]);
    expect(result[0].authors).toBe('Author One, Author Two, Author Three');
  });

  it('uses default image when imageLinks is missing', () => {
    const bookWithoutImage = {
      ...mockBookApi,
      volumeInfo: {
        ...mockBookApi.volumeInfo,
        imageLinks: { smallThumbnail: '', thumbnail: '' }
      }
    };

    const result = bookMapper([bookWithoutImage]);
    expect(result[0].imgUrl).toContain('books.google.com');
  });

  it('handles missing authors and returns "Unknown"', () => {
    const bookWithoutAuthors = {
      ...mockBookApi,
      volumeInfo: {
        ...mockBookApi.volumeInfo,
        authors: null as unknown as string[]
      }
    };

    const result = bookMapper([bookWithoutAuthors]);
    expect(result[0].authors).toBe('Unknown');
  });

  it('maps an array of books correctly', () => {
    const secondBook = { ...mockBookApi, id: 'xyz789' };
    const result = bookMapper([mockBookApi, secondBook]);

    expect(result).toHaveLength(2);
    expect(result[1].id).toBe('xyz789');
  });
});
