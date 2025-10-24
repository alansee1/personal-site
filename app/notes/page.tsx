"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotesPage() {
  const notes = [
    { date: "Oct 22, 2025", content: "Today I learned about Framer Motion's layout animations - super powerful!" },
    { date: "Oct 20, 2025", content: "Finished the entrance animation. It took 6+ iterations to get right." },
    { date: "Oct 18, 2025", content: "Started building the personal website project. Minimalist black/white theme." },
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
        Notes
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-4xl"
      >
        <div className="space-y-6">
          {notes.map((note, index) => (
            <motion.div
              key={note.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="border-b border-zinc-800 pb-6"
            >
              <p className="text-xs text-zinc-500 mb-2">{note.date}</p>
              <p className="text-zinc-300">{note.content}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
