"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { shelfData } from "@/data/shelf";
import BookshelfView from "./BookshelfView";

type Tab = "books" | "games";

export default function ShelfView() {
  const [activeTab, setActiveTab] = useState<Tab>("books");
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "games") {
      setActiveTab("games");
    }
  }, [searchParams]);

  const { books, games } = shelfData;

  const tabs = [
    { id: "books" as Tab, label: "Books", count: books.length },
    { id: "games" as Tab, label: "Games", count: games.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: { duration: 0.3 }
      }}
      className="w-full max-w-4xl"
    >
      {/* Tab Navigation */}
      <div className="flex gap-6 mb-8 border-b border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 relative transition-colors ${
              activeTab === tab.id
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-400"
            }`}
          >
            <span className="text-base font-light">
              {tab.label} <span className="text-xs text-zinc-600">({tab.count})</span>
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "books" && (
          <motion.div
            key="books"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <BookshelfView books={books} />
          </motion.div>
        )}

        {activeTab === "games" && (
          <motion.div
            key="games"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {games.map((game) => (
              <a
                key={game.title}
                href={game.playLink}
                className="border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-colors group cursor-pointer"
              >
                <h4 className="text-lg font-light text-white mb-2 group-hover:text-zinc-300 transition-colors">
                  {game.title}
                </h4>
                <p className="text-sm text-zinc-500 mb-3">{game.description}</p>
                <span className="text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors">
                  Play →
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
