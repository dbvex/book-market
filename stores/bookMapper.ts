import type { IBook, IBookApi } from '~/types/book';

const DEFAULT_IMG_URL = 'http://books.google.com/books/content?id=6bRrNbLHyrQC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api';

const getAuthors = (authors: string[] | null) =>
  authors && authors.join(', ') || 'Unknown';
const getImgUrl = (url: string | null) => url || DEFAULT_IMG_URL;

export const bookMapper = (books: IBookApi[]): IBook[] => {
  return books.map(book => ({
    id: book.id,
    authors: getAuthors(book.volumeInfo.authors),
    date: book.volumeInfo.publishedDate,
    country: book.saleInfo.country,
    imgUrl: getImgUrl(book.volumeInfo.imageLinks?.smallThumbnail ?? null),
    title: book.volumeInfo.title
  }));
};
