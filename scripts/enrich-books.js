/**
 * Book Data Enrichment Script
 *
 * Fetches book metadata from Google Books API and enriches local data with:
 * - Cover images
 * - Genres/categories
 * - Page counts
 * - Descriptions
 * - ISBNs
 *
 * Usage: node scripts/enrich-books.js
 */

const fs = require('fs');
const path = require('path');

// Read current shelf data
const shelfDataPath = path.join(__dirname, '../data/shelf.ts');
const shelfDataContent = fs.readFileSync(shelfDataPath, 'utf-8');

// Extract books array from TypeScript file
const booksMatch = shelfDataContent.match(/books: \[([\s\S]*?)\],\s*games:/);
if (!booksMatch) {
  console.error('Could not parse books from shelf.ts');
  process.exit(1);
}

// Parse book titles and authors (simple regex approach)
const bookRegex = /{\s*title: "(.*?)",\s*author: "(.*?)",\s*dateFinished: "(.*?)"/g;
const books = [];
let match;
while ((match = bookRegex.exec(booksMatch[1])) !== null) {
  books.push({
    title: match[1],
    author: match[2],
    dateFinished: match[3]
  });
}

console.log(`Found ${books.length} books to enrich\n`);

// Function to search Google Books API
async function fetchBookData(title, author) {
  const query = encodeURIComponent(`${title} ${author}`);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const book = data.items[0].volumeInfo;

    return {
      coverUrl: book.imageLinks?.thumbnail?.replace('http://', 'https://') || book.imageLinks?.smallThumbnail?.replace('http://', 'https://'),
      genres: book.categories || [],
      pageCount: book.pageCount,
      description: book.description,
      isbn: book.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ||
             book.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier,
      publishedDate: book.publishedDate
    };
  } catch (error) {
    console.error(`Error fetching ${title}:`, error.message);
    return null;
  }
}

// Enrich all books
async function enrichBooks() {
  const enrichedBooks = [];

  for (const book of books) {
    console.log(`Fetching data for: ${book.title}`);
    const metadata = await fetchBookData(book.title, book.author);

    enrichedBooks.push({
      ...book,
      ...metadata
    });

    // Rate limit - wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return enrichedBooks;
}

// Generate TypeScript code
function generateShelfData(enrichedBooks) {
  const booksCode = enrichedBooks.map(book => {
    const fields = [
      `      title: "${book.title}"`,
      `      author: "${book.author}"`,
      `      dateFinished: "${book.dateFinished}"`
    ];

    if (book.coverUrl) {
      fields.push(`      coverUrl: "${book.coverUrl}"`);
    }

    if (book.isbn) {
      fields.push(`      isbn: "${book.isbn}"`);
    }

    if (book.genres && book.genres.length > 0) {
      const genresStr = book.genres.map(g => `"${g}"`).join(', ');
      fields.push(`      genres: [${genresStr}]`);
    }

    if (book.pageCount) {
      fields.push(`      pageCount: ${book.pageCount}`);
    }

    if (book.description) {
      // Escape quotes and limit description length
      const desc = book.description
        .replace(/"/g, '\\"')
        .substring(0, 300);
      fields.push(`      description: "${desc}${book.description.length > 300 ? '...' : ''}"`);
    }

    return `    {\n${fields.join(',\n')}\n    }`;
  }).join(',\n');

  return `export interface Book {
  title: string;
  author: string;
  dateFinished: string; // Date when finished reading (YYYY-MM-DD format)
  rating?: number; // Optional personal rating out of 10
  description?: string;
  link?: string;
  coverUrl?: string; // Book cover image URL
  isbn?: string; // ISBN for fetching cover if no coverUrl
  genres?: string[]; // Book genres/categories
  pageCount?: number; // Number of pages
}

export interface Game {
  title: string;
  description: string;
  playLink: string;
  thumbnail?: string;
}

export interface ShelfData {
  books: Book[];
  games: Game[];
}

export const shelfData: ShelfData = {
  books: [
${booksCode}
  ],
  games: [
    {
      title: "Cosmic Drift",
      description: "Navigate through space avoiding asteroids",
      playLink: "/projects/cosmic-drift"
    }
  ]
};
`;
}

// Main execution
(async () => {
  console.log('🔍 Starting book enrichment...\n');

  const enrichedBooks = await enrichBooks();

  console.log('\n✅ Enrichment complete!');
  console.log(`📚 Enriched ${enrichedBooks.length} books`);

  // Count successfully enriched books
  const withCovers = enrichedBooks.filter(b => b.coverUrl).length;
  const withGenres = enrichedBooks.filter(b => b.genres && b.genres.length > 0).length;
  const withPageCounts = enrichedBooks.filter(b => b.pageCount).length;

  console.log(`\n📊 Stats:`);
  console.log(`  - Books with covers: ${withCovers}/${enrichedBooks.length}`);
  console.log(`  - Books with genres: ${withGenres}/${enrichedBooks.length}`);
  console.log(`  - Books with page counts: ${withPageCounts}/${enrichedBooks.length}`);

  // Generate new TypeScript file
  const newContent = generateShelfData(enrichedBooks);

  // Write to file
  fs.writeFileSync(shelfDataPath, newContent, 'utf-8');

  console.log(`\n💾 Updated ${shelfDataPath}`);
  console.log('\n✨ Done! Your shelf data is now enriched with metadata.');
})();
