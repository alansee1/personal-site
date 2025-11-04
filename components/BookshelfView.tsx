"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Book } from "@/data/shelf";
import Image from "next/image";
import ReadingVisualization from "./ReadingVisualization3D";

interface BookshelfViewProps {
  books: Book[];
}

// Helper function to get book cover URL
const getBookCoverUrl = (book: Book): string => {
  if (book.coverUrl) return book.coverUrl;
  if (book.isbn) {
    return `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
  }
  // Fallback: generate a colored placeholder based on title
  return '';
};

export default function BookshelfView({ books }: BookshelfViewProps) {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [showVisualization, setShowVisualization] = useState(false);

  // Close expanded book when scrolling
  const handleScroll = () => {
    if (hoveredBook) {
      setHoveredBook(null);
    }
  };

  // Generate a color based on book genre - Fiction = cool colors, Non-fiction = warm colors
  const getSpineColor = (book: Book): string => {
    const genre = book.genres?.[0] || '';

    // Fiction genres - cool colors (blues, purples, teals) - dimmed
    const fictionColors: Record<string, string> = {
      'Fiction': '#2563EB', // Dimmer blue
      'Young Adult Fiction': '#7C3AED', // Dimmer purple
      'Juvenile Fiction': '#8B5CF6', // Dimmer light purple
    };

    // Non-fiction genres - warm colors (oranges, reds, browns, greens) - dimmed
    const nonFictionColors: Record<string, string> = {
      'Biography & Autobiography': '#D97706', // Dimmer amber/orange
      'Business & Economics': '#059669', // Dimmer emerald green
      'History': '#DC2626', // Dimmer red
      'True Crime': '#B91C1C', // Dimmer dark red
      'Drug traffic': '#B91C1C', // Dimmer dark red (crime-related)
    };

    return fictionColors[genre] || nonFictionColors[genre] || '#78350F';
  };

  // Get year from first book (assuming all books are from same year for now)
  const year = books.length > 0 ? new Date(books[0].dateFinished).getFullYear() : new Date().getFullYear();

  // Group books by month and track positions
  const booksByMonth: Array<{ month: string; books: Book[] }> = [];
  let currentMonth = '';

  books.forEach((book) => {
    const month = new Date(book.dateFinished).toLocaleDateString('en-US', { month: 'short' });
    if (month !== currentMonth) {
      booksByMonth.push({ month, books: [book] });
      currentMonth = month;
    } else {
      booksByMonth[booksByMonth.length - 1].books.push(book);
    }
  });

  return (
    <div className="w-full">
      {/* Year Header */}
      <div className="flex items-baseline gap-3 mb-8">
        <h2 className="text-4xl font-light text-white">{year}</h2>
        <p className="text-zinc-500 text-sm">
          {books.length} {books.length === 1 ? 'book' : 'books'}
        </p>
        <button
          onClick={() => {
            setHoveredBook(null); // Close any open book
            setShowVisualization(true);
          }}
          className="ml-auto px-4 py-2 text-sm text-white border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:border-zinc-600 transition-all"
        >
          Visualize
        </button>
      </div>

      {/* Visualization Modal */}
      <ReadingVisualization
        books={books}
        isOpen={showVisualization}
        onClose={() => setShowVisualization(false)}
      />

      {/* Bookshelf */}
      <div className="relative overflow-x-auto pb-4" onScroll={handleScroll}>
        <div className="inline-flex flex-col gap-2">
          {/* Month labels */}
          <div className="flex gap-1">
            {booksByMonth.map((monthGroup, idx) => (
              <div
                key={idx}
                style={{ width: `${monthGroup.books.length * 51}px` }}
                className="flex-shrink-0"
              >
                <p className="text-xs text-zinc-500 font-light">
                  {monthGroup.month} ({monthGroup.books.length})
                </p>
              </div>
            ))}
          </div>

          {/* Books container */}
          <div className="flex gap-1 pr-[200px]">
            {books.map((book) => {
            const isHovered = hoveredBook === book.title;
            const coverUrl = getBookCoverUrl(book);
            const spineColor = getSpineColor(book);

            const finishedDate = new Date(book.dateFinished);
            const formattedDate = finishedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={book.title}
                className="relative"
                onMouseEnter={() => setHoveredBook(book.title)}
                onMouseLeave={() => setHoveredBook(null)}
              >
                {/* Book Spine */}
                <motion.div
                  className="relative cursor-pointer"
                  style={{
                    width: isHovered ? '200px' : '50px',
                    height: '300px',
                    perspective: '1000px',
                  }}
                  animate={{
                    width: isHovered ? '200px' : '50px',
                    zIndex: isHovered ? 50 : 1,
                  }}
                  transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                >
                  {!isHovered ? (
                    // Spine view
                    <div
                      className="h-full w-full flex items-center justify-center border-r border-black/20 shadow-md"
                      style={{
                        background: `linear-gradient(to right, ${spineColor}, ${spineColor}dd)`,
                      }}
                    >
                      <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                        <p className="text-white text-sm font-light px-2 whitespace-nowrap overflow-hidden text-ellipsis" style={{ maxWidth: '280px' }}>
                          {book.title}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Expanded cover view
                    <motion.div
                      initial={{ rotateY: -15, scale: 0.95 }}
                      animate={{ rotateY: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="h-full w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden flex flex-col"
                    >
                      {coverUrl ? (
                        <div className="relative flex-1 w-full bg-zinc-800 min-h-0">
                          <Image
                            src={coverUrl}
                            alt={book.title}
                            fill
                            className="object-contain"
                            sizes="200px"
                            onError={(e) => {
                              // Fallback to colored background if image fails
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="flex-1 w-full flex items-center justify-center min-h-0"
                          style={{ backgroundColor: spineColor }}
                        >
                          <p className="text-white text-center text-xs px-4 font-light">
                            {book.title}
                          </p>
                        </div>
                      )}

                      {/* Book details */}
                      <div className="p-4 flex-shrink-0">
                        <h4 className="text-white text-sm font-light mb-1 line-clamp-2">
                          {book.title}
                        </h4>
                        <p className="text-zinc-400 text-xs mb-2 line-clamp-1">
                          {book.author}
                        </p>
                        <p className="text-zinc-600 text-xs">
                          {formattedDate}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            );
          })}
          </div>

          {/* Shelf base */}
          <div className="w-full h-3 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-sm shadow-lg" />
        </div>
      </div>
    </div>
  );
}
