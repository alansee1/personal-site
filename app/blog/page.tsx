"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Blog() {
  const posts = [
    {
      title: "Your First Blog Post",
      date: "October 21, 2025",
      excerpt:
        "Write about your thoughts, learnings, or experiences here. Share what you've learned on your journey.",
      readTime: "5 min read",
    },
    {
      title: "Building My Personal Website",
      date: "October 20, 2025",
      excerpt:
        "How I built this site using Next.js, TypeScript, and Tailwind CSS. The journey from idea to deployment.",
      readTime: "8 min read",
    },
    {
      title: "Learning in Public",
      date: "October 19, 2025",
      excerpt:
        "Why sharing your learning journey is one of the best ways to grow as a developer and connect with others.",
      readTime: "6 min read",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-black dark:via-zinc-900 dark:to-black">
      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex gap-6 text-sm">
            <Link
              href="/"
              className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/projects"
              className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors relative group"
            >
              Projects
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/blog"
              className="text-black dark:text-white font-medium relative group"
            >
              Blog
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black dark:bg-white"></span>
            </Link>
            <Link
              href="/about"
              className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all group-hover:w-full"></span>
            </Link>
          </div>
        </motion.nav>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold text-black dark:text-white mb-4"
        >
          Blog
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-zinc-600 dark:text-zinc-400 mb-12"
        >
          Thoughts, stories, and ideas
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {posts.map((post) => (
            <motion.article
              key={post.title}
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="group border-b border-zinc-200 dark:border-zinc-800 pb-8 last:border-0"
            >
              <Link href="#" className="block">
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-zinc-600 dark:group-hover:from-white dark:group-hover:to-zinc-400 transition-all">
                  {post.title}
                </h2>
                <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-500 mb-3">
                  <time>{post.date}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                  {post.excerpt}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  Read more
                  <span className="transform transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* Floating gradient orb */}
        <div className="fixed top-1/3 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 dark:from-emerald-500/10 dark:via-teal-500/10 dark:to-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      </main>
    </div>
  );
}
