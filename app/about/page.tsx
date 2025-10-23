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

export default function About() {
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
              className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors relative group"
            >
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className="text-black dark:text-white font-medium relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black dark:bg-white"></span>
            </Link>
          </div>
        </motion.nav>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold text-black dark:text-white mb-8"
          >
            About Me
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="space-y-6 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-12"
          >
            <p>
              Hi! I'm{" "}
              <span className="text-black dark:text-white font-medium">
                [Your Name]
              </span>
              . Welcome to my personal website.
            </p>
            <p>
              Add information about yourself here - your background, interests,
              what you're passionate about, what you're currently learning or
              working on.
            </p>
            <p>
              This is your space to tell your story and share what makes you
              unique.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-3xl font-semibold text-black dark:text-white mb-6">
              Resume
            </h2>

            <div className="space-y-8">
              <div className="border-l-2 border-zinc-200 dark:border-zinc-800 pl-6">
                <h3 className="text-2xl font-medium text-black dark:text-white mb-2">
                  Education
                </h3>
                <div className="text-zinc-600 dark:text-zinc-400">
                  <p className="font-medium">Your University Name</p>
                  <p>Bachelor of Science in Computer Science</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500">
                    2020 - 2024
                  </p>
                </div>
              </div>

              <div className="border-l-2 border-zinc-200 dark:border-zinc-800 pl-6">
                <h3 className="text-2xl font-medium text-black dark:text-white mb-2">
                  Experience
                </h3>
                <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      Job Title
                    </p>
                    <p className="text-sm">Company Name</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500">
                      Jan 2024 - Present
                    </p>
                    <p className="mt-2">
                      Description of what you did and accomplished in this role.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-2 border-zinc-200 dark:border-zinc-800 pl-6">
                <h3 className="text-2xl font-medium text-black dark:text-white mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2 text-zinc-600 dark:text-zinc-400">
                  {[
                    "JavaScript",
                    "TypeScript",
                    "React",
                    "Next.js",
                    "Node.js",
                    "Python",
                    "Tailwind CSS",
                    "Git",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-semibold text-black dark:text-white mb-6">
              Get in touch
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-4">
              Feel free to reach out if you want to collaborate on a project,
              have a question, or just want to say hi!
            </p>
            <a
              href="mailto:your.email@example.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Send me an email →
            </a>
          </motion.div>
        </motion.div>

        {/* Floating gradient orb */}
        <div className="fixed top-1/2 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 dark:from-orange-500/10 dark:via-red-500/10 dark:to-pink-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      </main>
    </div>
  );
}
