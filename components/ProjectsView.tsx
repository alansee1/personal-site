"use client";

import { motion } from "framer-motion";

export default function ProjectsView() {
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
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
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
  );
}
