"use client";

import { motion } from "framer-motion";

export default function BlogView() {
  const posts = [
    {
      title: "Building a Cinematic Web Animation",
      date: "Oct 21, 2025",
      excerpt: "Thoughts on creating delightful micro-interactions and entrance animations..."
    },
    {
      title: "The Art of Minimalism in Design",
      date: "Oct 15, 2025",
      excerpt: "Why less is often more when it comes to user interfaces..."
    },
    {
      title: "Getting Started with TypeScript",
      date: "Oct 10, 2025",
      excerpt: "A practical guide to adopting TypeScript in your projects..."
    },
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
      <div className="space-y-8">
        {posts.map((post, index) => (
          <motion.div
            key={post.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="border-b border-zinc-800 pb-8 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h3 className="text-xl font-light text-white mb-1">{post.title}</h3>
            <p className="text-xs text-zinc-500 mb-3">{post.date}</p>
            <p className="text-zinc-400">{post.excerpt}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
