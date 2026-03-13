import type { IBook, IBookApi } from '~/types/book';

const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Susan', 'Richard', 'Jessica', 'Thomas', 'Sarah',
  'Charles', 'Karen', 'Christopher', 'Lisa', 'Mark', 'Betty', 'Donald', 'Dorothy',
  'George', 'Sandra', 'Kenneth', 'Ashley', 'Steven', 'Kimberly'
];
const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];
const PREFIXES = [
  'The Art of', 'Introduction to', 'Advanced', 'Mastering',
  'The Complete Guide to', 'Practical', 'Modern', 'Learning',
  'Professional', 'Essential', 'Beginning', 'Expert',
  'Deep Dive into', 'Hands-On', 'Building with'
];
const TOPICS = [
  'JavaScript', 'TypeScript', 'Vue.js', 'React', 'Angular', 'Node.js', 'Python',
  'Machine Learning', 'Data Science', 'Web Development', 'Cloud Computing', 'DevOps',
  'Docker', 'Kubernetes', 'Go', 'Rust', 'System Design', 'Algorithms', 'Clean Code',
  'Software Architecture', 'Security', 'Database Design', 'REST APIs', 'Microservices',
  'Automated Testing', 'UX Design', 'Product Management', 'Leadership', 'Entrepreneurship',
  'Finance', 'Economics', 'Psychology', 'Philosophy', 'History', 'Biology', 'Physics',
  'Mathematics', 'Chemistry', 'Literature', 'Art History', 'GraphQL', 'Swift', 'Kotlin',
  'Java', 'C#', '.NET', 'CSS', 'Tailwind CSS', 'Three.js', 'WebGL'
];
const COUNTRIES = ['US', 'GB', 'DE', 'FR', 'JP', 'CA', 'AU', 'NL', 'SE', 'CH'];

const UNIQUE = PREFIXES.length * TOPICS.length;

const PUBLISHERS = ["O'Reilly", 'Packt', 'Manning', 'No Starch Press', 'Apress'];
const CATEGORIES = ['Computers & Technology', 'Programming', 'Software Engineering', 'Web Development', 'Data Science'];

let cache: IBook[] | null = null;

export function generateMockBooks(count = 10000): IBook[] {
  if (cache) return cache;

  const books: IBook[] = [];

  for (let i = 0; i < count; i++) {
    const prefix = PREFIXES[i % PREFIXES.length];
    const topic = TOPICS[Math.floor(i / PREFIXES.length) % TOPICS.length];
    const edition = Math.floor(i / UNIQUE) + 1;
    const title = edition > 1 ? `${prefix} ${topic} (${edition}nd Ed.)` : `${prefix} ${topic}`;

    books.push({
      id: `mock-${i}`,
      title,
      authors: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length]}`,
      date: `${2000 + (i % 24)}-${String((i % 12) + 1).padStart(2, '0')}-01`,
      country: COUNTRIES[i % COUNTRIES.length],
      imgUrl: `https://picsum.photos/seed/book${i}/128/196`
    });
  }

  cache = books;
  return books;
}

export function getMockBookApi(id: string): IBookApi | null {
  const index = parseInt(id.replace('mock-', ''), 10);
  if (isNaN(index)) return null;

  const books = generateMockBooks();
  const book = books[index];
  if (!book) return null;

  const topic = book.title.split(' ').pop() ?? 'this subject';
  const lang = { JP: 'ja', DE: 'de', FR: 'fr', RU: 'ru' }[book.country] ?? 'en';

  return {
    kind: 'books#volume',
    id: book.id,
    etag: `mock-etag-${index}`,
    selfLink: '',
    volumeInfo: {
      title: book.title,
      authors: book.authors.split(', '),
      publisher: PUBLISHERS[index % PUBLISHERS.length],
      publishedDate: book.date,
      description: `A comprehensive guide covering all aspects of ${topic}. `
        + `Written for developers at all levels, this book walks through practical examples, `
        + `real-world patterns and best practices to help you build production-ready applications. `
        + `From foundational concepts to advanced techniques, every chapter is packed with actionable insights.`,
      industryIdentifiers: [{ type: 'ISBN_13', identifier: `978${String(index).padStart(10, '0')}` }],
      readingModes: { text: true, image: true },
      pageCount: 200 + (index % 600),
      printType: 'BOOK',
      categories: [CATEGORIES[index % CATEGORIES.length]],
      averageRating: parseFloat((3.5 + (index % 3) * 0.5).toFixed(1)),
      ratingsCount: 10 + (index % 490),
      maturityRating: 'NOT_MATURE',
      allowAnonLogging: true,
      contentVersion: '1.0.0',
      panelizationSummary: { containsEpubBubbles: false, containsImageBubbles: false },
      imageLinks: { thumbnail: book.imgUrl, smallThumbnail: book.imgUrl },
      language: lang,
      previewLink: '',
      infoLink: '',
      canonicalVolumeLink: ''
    },
    saleInfo: {
      country: book.country,
      saleability: 'FOR_SALE',
      isEbook: index % 3 === 0,
      retailPrice: index % 2 === 0 ? { amount: parseFloat((19.99 + (index % 40)).toFixed(2)), currencyCode: 'USD' } : undefined
    },
    accessInfo: {
      country: book.country,
      viewability: 'PARTIAL',
      embeddable: true,
      publicDomain: false,
      textToSpeechPermission: 'ALLOWED',
      epub: { isAvailable: false },
      pdf: { isAvailable: false },
      webReaderLink: '',
      accessViewStatus: 'SAMPLE',
      quoteSharingAllowed: false
    }
  };
}
