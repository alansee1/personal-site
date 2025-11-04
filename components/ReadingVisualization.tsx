"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Book } from "@/data/shelf";

interface ReadingVisualizationProps {
  books: Book[];
  isOpen: boolean;
  onClose: () => void;
}

interface Stats {
  totalBooks: number;
  totalPages: number;
  avgPages: number;
  genres: Record<string, number>;
  longestBook: Book | null;
  shortestBook: Book | null;
}

interface Particle {
  book: Book;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  radius: number;
  color: string;
  velocityX: number;
  velocityY: number;
}

export default function ReadingVisualization({ books, isOpen, onClose }: ReadingVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredBook, setHoveredBook] = useState<Book | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Calculate stats
  const stats: Stats = {
    totalBooks: books.length,
    totalPages: books.reduce((sum, b) => sum + (b.pageCount || 0), 0),
    avgPages: Math.round(books.reduce((sum, b) => sum + (b.pageCount || 0), 0) / books.length),
    genres: books.reduce((acc, b) => {
      const genre = b.genres?.[0] || 'Unknown';
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    longestBook: books.reduce((longest, b) =>
      (!longest || (b.pageCount || 0) > (longest.pageCount || 0)) ? b : longest
    , null as Book | null),
    shortestBook: books.reduce((shortest, b) =>
      (!shortest || (b.pageCount || 0) < (shortest.pageCount || 0)) ? b : shortest
    , null as Book | null),
  };

  // Top genre
  const topGenre = Object.entries(stats.genres).sort((a, b) => b[1] - a[1])[0];

  // Handle close
  const handleClose = () => {
    onClose();
  };

  // Genre color mapping (matching shelf colors)
  const getGenreColor = (book: Book): string => {
    const genre = book.genres?.[0] || '';
    const genreColors: Record<string, string> = {
      'Fiction': '#1E3A5F',
      'Young Adult Fiction': '#6B46C1',
      'Juvenile Fiction': '#9F7AEA',
      'Biography & Autobiography': '#92400E',
      'Business & Economics': '#065F46',
      'History': '#7F1D1D',
      'True Crime': '#374151',
      'Drug traffic': '#374151',
    };
    return genreColors[genre] || '#78350F';
  };

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Initialize particles
    particlesRef.current = books.map((book, index) => {
      // Calculate spiral position
      const angle = (index / books.length) * Math.PI * 4; // 2 full spirals
      const distance = 50 + (index / books.length) * Math.min(canvas.width, canvas.height) * 0.35;
      const targetX = centerX + Math.cos(angle) * distance;
      const targetY = centerY + Math.sin(angle) * distance;

      // Calculate radius based on page count (bigger = more pages)
      const maxPages = Math.max(...books.map(b => b.pageCount || 0));
      const minRadius = 8;
      const maxRadius = 25;
      const radius = minRadius + ((book.pageCount || 0) / maxPages) * (maxRadius - minRadius);

      // Start from center with random velocity (explosion effect)
      const explosionAngle = Math.random() * Math.PI * 2;
      const explosionSpeed = 2 + Math.random() * 3;

      return {
        book,
        x: centerX,
        y: centerY,
        targetX,
        targetY,
        radius,
        color: getGenreColor(book),
        velocityX: Math.cos(explosionAngle) * explosionSpeed,
        velocityY: Math.sin(explosionAngle) * explosionSpeed,
      };
    });

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Normal settling behavior
        const targetX = particle.targetX;
        const targetY = particle.targetY;
        const dx = targetX - particle.x;
        const dy = targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
          const force = 0.05;
          particle.velocityX += dx * force;
          particle.velocityY += dy * force;
          particle.velocityX *= 0.9;
          particle.velocityY *= 0.9;

          particle.x += particle.velocityX;
          particle.y += particle.velocityY;
        }

        // Draw connection lines to nearby books (constellation effect)
        particlesRef.current.forEach((other, otherIndex) => {
          if (otherIndex <= index) return; // Avoid duplicate lines

          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Only draw lines between close books (same genre or close in time)
          const sameGenre = particle.book.genres?.[0] === other.book.genres?.[0];
          const maxLineDistance = sameGenre ? 150 : 100;

          if (dist < maxLineDistance) {
            const opacity = (1 - dist / maxLineDistance) * 0.3;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Opacity is always 1 - let modal animation handle the exit
        let opacity = 1;

        // Draw particle (book orb)
        // Outer glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, particle.color + '80');
        gradient.addColorStop(1, particle.color + '00');

        ctx.globalAlpha = opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core orb
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1; // Reset alpha
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, books]);

  // Handle mouse hover to detect book
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let foundBook: Book | null = null;

    particlesRef.current.forEach((particle) => {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < particle.radius) {
        foundBook = particle.book;
      }
    });

    setHoveredBook(foundBook);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full max-w-6xl max-h-[90vh] m-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 text-white hover:text-zinc-400 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Stats Panel - compact on mobile */}
          <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-2 md:p-4 max-w-[140px] md:max-w-sm">
            <h2 className="text-sm md:text-2xl font-light text-white mb-2 md:mb-4">Reading Constellation</h2>

            <div className="grid grid-cols-2 gap-2 md:gap-4 mb-2 md:mb-4">
              <div>
                <p className="text-lg md:text-3xl font-light text-white">{stats.totalBooks}</p>
                <p className="text-[10px] md:text-xs text-zinc-500">Books</p>
              </div>
              <div>
                <p className="text-lg md:text-3xl font-light text-white">{Math.round(stats.totalPages / 1000)}k</p>
                <p className="text-[10px] md:text-xs text-zinc-500">Pages</p>
              </div>
              <div>
                <p className="text-lg md:text-3xl font-light text-white">{stats.avgPages}</p>
                <p className="text-[10px] md:text-xs text-zinc-500">Avg</p>
              </div>
              <div>
                <p className="text-lg md:text-3xl font-light text-white">{topGenre[1]}</p>
                <p className="text-[10px] md:text-xs text-zinc-500 truncate">{topGenre[0]}</p>
              </div>
            </div>

            <div className="hidden md:block border-t border-zinc-800 pt-3 space-y-2">
              {stats.longestBook && (
                <div>
                  <p className="text-xs text-zinc-500">Longest</p>
                  <p className="text-sm text-white font-light">{stats.longestBook.title}</p>
                  <p className="text-xs text-zinc-600">{stats.longestBook.pageCount} pages</p>
                </div>
              )}
            </div>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full rounded-lg"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredBook(null)}
          />

          {/* Hover tooltip */}
          <AnimatePresence>
            {hoveredBook && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 left-4 bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-4 max-w-xs"
              >
                <h3 className="text-white font-light text-lg mb-1">{hoveredBook.title}</h3>
                <p className="text-zinc-400 text-sm mb-2">{hoveredBook.author}</p>
                <div className="flex gap-3 text-xs text-zinc-500">
                  {hoveredBook.pageCount && <span>{hoveredBook.pageCount} pages</span>}
                  {hoveredBook.genres && <span>{hoveredBook.genres[0]}</span>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend - compact on mobile */}
          <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-2 md:p-3">
            <p className="text-[10px] md:text-xs text-zinc-500 mb-1 md:mb-2">Size = Pages</p>
            <p className="text-[10px] md:text-xs text-zinc-500">Lines = Genre</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
