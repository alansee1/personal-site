"use client";

import { motion } from "framer-motion";

export default function NotesView() {
  const notes = [
    { date: "Oct 22, 2025", content: "Today I learned about Framer Motion's layout animations - super powerful!" },
    { date: "Oct 20, 2025", content: "Finished the entrance animation. It took 6+ iterations to get right." },
    { date: "Oct 18, 2025", content: "Started building the personal website project. Minimalist black/white theme." },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        opacity: { delay: 1.5, duration: 0.3 },
        exit: { duration: 0.3, delay: 0 }
      }}
      className="w-full max-w-4xl"
    >
      <div className="space-y-6">
        {notes.map((note, index) => (
          <motion.div
            key={note.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="border-b border-zinc-800 pb-6"
          >
            <p className="text-xs text-zinc-500 mb-2">{note.date}</p>
            <p className="text-zinc-300">{note.content}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
