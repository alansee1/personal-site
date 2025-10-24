"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ShelfPage() {
  const items = [
    { title: "Atomic Habits", author: "James Clear", type: "Book", rating: 9 },
    { title: "Design Patterns", author: "Gang of Four", type: "Book", rating: 8 },
    { title: "The Pragmatic Programmer", author: "Hunt & Thomas", type: "Book", rating: 9 },
    { title: "Interface Design Principles", type: "Article", rating: 8 },
  ];

  return (
    <div className="relative w-full min-h-screen bg-black flex flex-col items-start pt-8 pl-8">
      <Link href="/">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white text-sm hover:text-zinc-400 transition-colors mb-8 cursor-pointer"
        >
          ← back
        </motion.p>
      </Link>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-white text-5xl md:text-6xl font-light tracking-wide mb-12"
      >
        Shelf
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="border border-zinc-800 rounded p-4"
            >
              <p className="text-xs text-zinc-500 mb-1">{item.type}</p>
              <h4 className="text-lg font-light text-white mb-1">{item.title}</h4>
              {item.author && <p className="text-sm text-zinc-400 mb-3">{item.author}</p>}
              <div className="flex gap-1">
                {[...Array(item.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-sm">★</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
