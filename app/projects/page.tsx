"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const projects = [
    {
      title: "Personal Website",
      description: "A minimalist portfolio with cinematic entrance animation",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      year: "2025"
    },
    {
      title: "Cool Project #2",
      description: "Brief description of what this project does",
      tech: ["React", "Node.js", "MongoDB"],
      year: "2024"
    },
    {
      title: "Interesting Side Project",
      description: "Another awesome project you built",
      tech: ["Python", "FastAPI", "PostgreSQL"],
      year: "2024"
    },
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
        Projects
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-4xl"
      >
        <div className="space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="border-b border-zinc-800 pb-8"
            >
              <h3 className="text-2xl font-light text-white mb-2">{project.title}</h3>
              <p className="text-zinc-400 mb-3">{project.description}</p>
              <div className="flex gap-2 flex-wrap mb-3">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 bg-zinc-900 text-zinc-300 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-xs text-zinc-500">{project.year}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
