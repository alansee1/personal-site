---
description: Add a new book to the shelf with automatic Google Books API enrichment
---

# /add-book - Book Addition Wizard

Add a new book to your reading shelf with automatic metadata fetching from Google Books API.

## Overview

Adds a new book entry to `data/shelf.ts` with enriched metadata (cover, genres, page count, description, ISBN).

## Step 1: Gather Book Information

Ask the user for the following:

```
📚 Let's add a new book to your shelf!

Title:
Author:
Date Finished (YYYY-MM-DD):
Rating (optional, 0-10):
```

**Wait for user response.**

**Validation:**
- Date must be YYYY-MM-DD format
- Rating must be 0-10 (can be decimal like 8.5)
- Rating is optional

## Step 2: Fetch Metadata from Google Books API

Search Google Books API:

```bash
cat > /tmp/fetch-book.js << 'EOF'
async function fetchBook(title, author) {
  const query = encodeURIComponent(`${title} ${author}`);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=3`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    console.log(JSON.stringify({ found: false }));
    return;
  }

  const results = data.items.slice(0, 3).map((item, i) => {
    const book = item.volumeInfo;
    return {
      index: i + 1,
      title: book.title,
      authors: book.authors?.join(', ') || 'Unknown',
      publishedDate: book.publishedDate,
      coverUrl: book.imageLinks?.thumbnail?.replace('http://', 'https://'),
      genres: book.categories || [],
      pageCount: book.pageCount,
      description: book.description,
      isbn: book.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ||
             book.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier
    };
  });

  console.log(JSON.stringify({ found: true, results }));
}

fetchBook("TITLE_HERE", "AUTHOR_HERE");
EOF

node /tmp/fetch-book.js
rm /tmp/fetch-book.js
```

Replace `TITLE_HERE` and `AUTHOR_HERE` with user input.

## Step 3: Show Search Results

**If results found:**

```
Found these matches on Google Books:

1. "{title}" by {authors} ({publishedDate})
   {pageCount || '?'} pages | {genres.join(', ') || 'No genres'}

2. "{title}" by {authors} ({publishedDate})
   {pageCount || '?'} pages | {genres.join(', ') || 'No genres'}

3. "{title}" by {authors} ({publishedDate})
   {pageCount || '?'} pages | {genres.join(', ') || 'No genres'}

Which match? (1-3, or 'skip' to add without enrichment)
```

**If no results:**

```
⚠️  No matches found on Google Books.

Options:
1. Add without enrichment (manual)
2. Try different title/author (retry)
3. Cancel
```

## Step 4: Preview the Book Entry

Show what will be added:

```
Will add this book to your shelf:

Title: {title}
Author: {author}
Date Finished: {dateFinished}
Rating: {rating || 'Not rated'}

Enriched data:
✓ Cover: {coverUrl ? 'Yes' : 'No'}
✓ Genres: {genres.join(', ') || 'None'}
✓ Pages: {pageCount || 'Unknown'}
✓ ISBN: {isbn || 'None'}
✓ Description: {description?.substring(0, 80) || 'None'}...

Add this book? (yes/edit/cancel)
```

## Step 5: Add Book to shelf.ts

Read current shelf.ts, find insertion point based on dateFinished, and insert the new book.

```javascript
const fs = require('fs');
const path = require('path');

// Book data to insert
const newBook = {
  title: "TITLE",
  author: "AUTHOR",
  dateFinished: "YYYY-MM-DD",
  rating: 8.5, // optional
  coverUrl: "URL",
  isbn: "ISBN",
  genres: ["Genre1", "Genre2"],
  pageCount: 123,
  description: "Description..."
};

// Read shelf.ts
const shelfPath = path.join(process.cwd(), 'data/shelf.ts');
let content = fs.readFileSync(shelfPath, 'utf-8');

// Generate book code
function bookToCode(book) {
  const lines = [
    `      title: "${book.title}"`,
    `      author: "${book.author}"`,
    `      dateFinished: "${book.dateFinished}"`
  ];

  if (book.rating !== undefined) lines.push(`      rating: ${book.rating}`);
  if (book.coverUrl) lines.push(`      coverUrl: "${book.coverUrl}"`);
  if (book.isbn) lines.push(`      isbn: "${book.isbn}"`);
  if (book.genres?.length) lines.push(`      genres: [${book.genres.map(g => `"${g}"`).join(', ')}]`);
  if (book.pageCount) lines.push(`      pageCount: ${book.pageCount}`);
  if (book.description) {
    const desc = book.description.replace(/"/g, '\\"').substring(0, 300);
    lines.push(`      description: "${desc}${book.description.length > 300 ? '...' : ''}"`);
  }

  return `    {\n${lines.join(',\n')}\n    }`;
}

const newBookCode = bookToCode(newBook);

// Find insertion point (books are sorted newest first)
const bookMatches = [...content.matchAll(/dateFinished: "(\d{4}-\d{2}-\d{2})"/g)];
const dates = bookMatches.map(m => m[1]);
const insertIndex = dates.findIndex(date => date < newBook.dateFinished);

// Extract books section
const booksMatch = content.match(/books: \[([\s\S]*?)\],\s*games:/);
const booksContent = booksMatch[1];

// Split into individual book entries
const bookEntries = booksContent.split(/\},\s*\{/).map((entry, i, arr) => {
  if (i === 0) return entry + '}';
  if (i === arr.length - 1) return '{' + entry;
  return '{' + entry + '}';
}).filter(e => e.trim());

// Insert new book
const actualIndex = insertIndex === -1 ? bookEntries.length : insertIndex;
bookEntries.splice(actualIndex, 0, newBookCode);

// Reconstruct file
const newBooksContent = bookEntries.join(',\n');
content = content.replace(
  /books: \[[\s\S]*?\],\s*games:/,
  `books: [\n${newBooksContent}\n  ],\n  games:`
);

fs.writeFileSync(shelfPath, content, 'utf-8');
console.log(`✅ Book added at position ${actualIndex + 1}`);
```

Save this as a temp script, execute it, then delete it.

## Step 6: Confirm Success

```
✅ Book added to shelf!

"{title}" by {author}
Position: {position} of {total books}
Finished: {dateFinished}

View at: http://localhost:3000/shelf
```

## Step 7: Git Commit (Optional)

```
Commit this change? (yes/no)
```

If yes:

```bash
git add data/shelf.ts

git commit -m "$(cat <<'EOF'
Add book: {title}

Added "{title}" by {author} to reading shelf.
Finished: {dateFinished}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

Then ask about push:

```
Push to remote? (yes/no)
```

## Step 8: Final Message

```
✅ Complete!

📚 {title}
✍️  {author}
📅 {dateFinished}
⭐ {rating || 'Not rated'}

Live at: https://alansee.dev/shelf (after deploy)
```

## Error Handling

**Invalid date format:**
```
❌ Please use YYYY-MM-DD format (e.g., 2025-11-07)
```

**API failure:**
```
⚠️  Google Books API unavailable. Add without enrichment? (yes/no)
```

**File write error:**
```
❌ Could not update shelf.ts: {error}
```

## Notes

- Books are sorted newest first by dateFinished
- Google Books API is free (no key needed)
- Cover URLs are auto-upgraded to HTTPS
- Descriptions truncated to 300 chars
- Similar to `/create-blog-post` workflow
