"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useMemo } from "react";
import { Book } from "@/data/shelf";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

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

// Genre color mapping - Fiction = cool colors, Non-fiction = warm colors (dimmed)
const getGenreColor = (book: Book): string => {
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

// Individual book particle in 3D
function BookParticle({ book, position, radius, color, onClick, onHover }: {
  book: Book;
  position: [number, number, number];
  radius: number;
  color: string;
  onClick: () => void;
  onHover: (book: Book | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => {
        setHovered(true);
        onHover(book);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.8 : 0.3}
        roughness={0.5}
        metalness={0.5}
      />
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 rounded-lg p-3 max-w-xs pointer-events-none">
            <h3 className="text-white font-light text-sm mb-1">{book.title}</h3>
            <p className="text-zinc-400 text-xs mb-1">{book.author}</p>
            <div className="flex gap-2 text-[10px] text-zinc-500">
              {book.pageCount && <span>{book.pageCount} pages</span>}
              {book.genres && <span>{book.genres[0]}</span>}
            </div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

// The 3D scene
function GalaxyScene({ books, onBookHover }: { books: Book[]; onBookHover: (book: Book | null) => void }) {
  const maxPages = Math.max(...books.map(b => b.pageCount || 0));
  const minPages = Math.min(...books.map(b => b.pageCount || 0));

  const particles = useMemo(() => {
    // Get date range
    const dates = books.map(b => new Date(b.dateFinished).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);

    // Fiction genres
    const fictionGenres = ['Fiction', 'Young Adult Fiction', 'Juvenile Fiction'];

    return books.map((book) => {
      // X-axis: Timeline (normalized to -6 to 6) - more compact
      const bookDate = new Date(book.dateFinished).getTime();
      const x = ((bookDate - minDate) / (maxDate - minDate)) * 12 - 6;

      // Y-axis: Page count (normalized to 0 to 5) - more compact
      const pageCount = book.pageCount || 0;
      const y = ((pageCount - minPages) / (maxPages - minPages)) * 5;

      // Z-axis: Fiction at bottom (-4 to -1), Non-fiction at top (1 to 4)
      const genre = book.genres?.[0] || 'Unknown';
      const isFiction = fictionGenres.includes(genre);
      const z = isFiction ? -2.5 : 2.5; // Separate fiction and non-fiction

      // Add slight random jitter so books don't overlap exactly
      const jitterX = (Math.random() - 0.5) * 0.3;
      const jitterZ = (Math.random() - 0.5) * 1.5; // More spread within fiction/non-fiction

      // Size based on page count (slightly larger for visibility)
      const particleRadius = 0.25 + ((pageCount - minPages) / (maxPages - minPages)) * 0.45;

      return {
        book,
        position: [x + jitterX, y, z + jitterZ] as [number, number, number],
        radius: particleRadius,
        color: getGenreColor(book),
      };
    });
  }, [books, maxPages, minPages]);

  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />

      {/* Main directional light */}
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Point light at center for glow effect */}
      <pointLight position={[0, 4, 0]} intensity={1.5} color="#ffffff" />

      {/* Grid floor to show X/Z plane (timeline and genre) */}
      <gridHelper args={[24, 12, '#444444', '#222222']} position={[0, 0, 0]} />

      {/* Axis lines */}
      {/* X-axis (Timeline) - Red */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[12, 0.05, 0.05]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>

      {/* Y-axis (Page Count) - Green */}
      <mesh position={[-6, 2.5, 0]}>
        <boxGeometry args={[0.05, 5, 0.05]} />
        <meshBasicMaterial color="#44ff44" />
      </mesh>

      {/* Z-axis (Genre) - Blue */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.05, 0.05, 20]} />
        <meshBasicMaterial color="#4444ff" />
      </mesh>

      {/* Axis labels */}
      <Html position={[7, 0, 0]} center>
        <div className="text-white text-xs font-light bg-zinc-900/80 px-2 py-1 rounded pointer-events-none whitespace-nowrap">
          Timeline →
        </div>
      </Html>

      <Html position={[-6, 6, 0]} center>
        <div className="text-white text-xs font-light bg-zinc-900/80 px-2 py-1 rounded pointer-events-none whitespace-nowrap">
          ↑ Page Count
        </div>
      </Html>

      <Html position={[0, 0, 4]} center>
        <div className="text-white text-xs font-light bg-zinc-900/80 px-2 py-1 rounded pointer-events-none whitespace-nowrap">
          Non-Fiction
        </div>
      </Html>

      <Html position={[0, 0, -4]} center>
        <div className="text-white text-xs font-light bg-zinc-900/80 px-2 py-1 rounded pointer-events-none whitespace-nowrap">
          Fiction
        </div>
      </Html>

      {/* Render all book particles */}
      {particles.map((particle, index) => (
        <BookParticle
          key={index}
          book={particle.book}
          position={particle.position}
          radius={particle.radius}
          color={particle.color}
          onClick={() => console.log(particle.book.title)}
          onHover={onBookHover}
        />
      ))}

      {/* Camera controls - lets user orbit, zoom, pan */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={5}
        maxDistance={25}
      />
    </>
  );
}

export default function ReadingVisualization({ books, isOpen, onClose }: ReadingVisualizationProps) {
  const [hoveredBook, setHoveredBook] = useState<Book | null>(null);

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

  const topGenre = Object.entries(stats.genres).sort((a, b) => b[1] - a[1])[0];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        onClick={onClose}
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
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white hover:text-zinc-400 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Stats Panel - compact on mobile */}
          <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-2 md:p-4 max-w-[140px] md:max-w-sm">
            <h2 className="text-sm md:text-2xl font-light text-white mb-2 md:mb-4">Reading Journey</h2>

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

          {/* 3D Canvas */}
          <Canvas
            camera={{ position: [8, 5, 12], fov: 60 }}
            className="w-full h-full rounded-lg"
          >
            <GalaxyScene books={books} onBookHover={setHoveredBook} />
          </Canvas>

          {/* Legend - mobile only */}
          <div
            className="absolute lg:hidden bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-2"
            style={{
              bottom: '8px',
              left: '8px',
              maxWidth: '140px'
            }}
          >
            <p className="text-[10px] lg:text-xs text-zinc-500 mb-1">💡 Drag to rotate</p>
            <p className="text-[10px] lg:text-xs text-zinc-500 mb-1">🔍 Scroll to zoom</p>
            <div className="border-t border-zinc-800 my-1"></div>
            <p className="text-[10px] lg:text-xs text-zinc-500 mb-1">📅 X = Timeline</p>
            <p className="text-[10px] lg:text-xs text-zinc-500 mb-1">📚 Y = Page Count</p>
            <p className="text-[10px] lg:text-xs text-zinc-500 mb-1">🔵 Blue = Fiction</p>
            <p className="text-[10px] lg:text-xs text-zinc-500">🔶 Warm = Non-Fiction</p>
          </div>

          {/* Legend on desktop - separate element */}
          <div
            className="hidden lg:block absolute bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg p-3"
            style={{
              top: '16px',
              left: '260px',
              maxWidth: '180px'
            }}
          >
            <p className="text-xs text-zinc-500 mb-1">💡 Drag to rotate</p>
            <p className="text-xs text-zinc-500 mb-1">🔍 Scroll to zoom</p>
            <div className="border-t border-zinc-800 my-1"></div>
            <p className="text-xs text-zinc-500 mb-1">📅 X = Timeline</p>
            <p className="text-xs text-zinc-500 mb-1">📚 Y = Page Count</p>
            <p className="text-xs text-zinc-500 mb-1">🔵 Blue = Fiction</p>
            <p className="text-xs text-zinc-500">🔶 Warm = Non-Fiction</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
