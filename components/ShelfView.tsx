"use client";

import { motion } from "framer-motion";

export default function ShelfView() {
  const items = [
    { title: "Atomic Habits", author: "James Clear", type: "Book", rating: 9 },
    { title: "Design Patterns", author: "Gang of Four", type: "Book", rating: 8 },
    { title: "The Pragmatic Programmer", author: "Hunt & Thomas", type: "Book", rating: 9 },
    { title: "Interface Design Principles", type: "Article", rating: 8 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        opacity: { delay: 1.5, duration: 0.3 }
      }}
      className="w-full max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
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
  );
}
