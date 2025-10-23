"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function Projects() {
  const projects = [
    {
      title: "Project Name",
      description:
        "Description of your project goes here. What did you build? What technologies did you use? What problems did it solve?",
      tags: ["React", "TypeScript", "Tailwind"],
      link: "#",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "Another Cool Project",
      description:
        "Add more projects as you build them. Each one showcases your skills and creativity.",
      tags: ["Next.js", "Node.js", "PostgreSQL"],
      link: "#",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Third Amazing Project",
      description:
        "Keep adding your work here. Your projects are your portfolio and show what you can do.",
      tags: ["Python", "Machine Learning", "API"],
      link: "#",
      gradient: "from-emerald-500 to-teal-500",
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
              className="text-black dark:text-white font-medium relative group"
            >
              Projects
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black dark:bg-white"></span>
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
          Projects
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-zinc-600 dark:text-zinc-400 mb-12"
        >
          Things I've built and launched
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group relative border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 bg-white/50 dark:bg-black/50 backdrop-blur-sm overflow-hidden transition-all hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl"
            >
              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
              ></div>

              <div className="relative">
                <h2 className="text-2xl font-semibold text-black dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-zinc-600 dark:group-hover:from-white dark:group-hover:to-zinc-400 transition-all">
                  {project.title}
                </h2>

                <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link}
                  className={`inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent hover:gap-3 transition-all`}
                >
                  View Project
                  <span className="transform transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating gradient orb */}
        <div className="fixed top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 dark:from-purple-500/10 dark:via-pink-500/10 dark:to-red-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      </main>
    </div>
  );
}
