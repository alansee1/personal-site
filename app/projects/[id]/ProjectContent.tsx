"use client";

import { motion } from "framer-motion";

type ProjectContentProps = {
  tech: string[];
  url: string | null;
  github: string | null;
  isNavigatingBack?: boolean;
};

export default function ProjectContent({ tech, url, github, isNavigatingBack }: ProjectContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isNavigatingBack ? 0 : 1 }}
      transition={{ duration: isNavigatingBack ? 0.3 : 0.5, delay: isNavigatingBack ? 0 : 0.15 }}
      className="w-full max-w-4xl"
    >
      {/* Tech Stack */}
      <div className="mb-8">
        <h2 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">Tech Stack</h2>
        <div className="flex gap-2 flex-wrap">
          {tech.map((t) => (
            <span
              key={t}
              className="text-sm px-3 py-1.5 bg-zinc-900 text-zinc-300 rounded border border-zinc-800"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      {(url || github) && (
        <div className="flex gap-4 mb-8">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-black rounded hover:bg-zinc-200 transition-colors text-sm font-medium"
            >
              View Live Site →
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-zinc-700 text-white rounded hover:border-zinc-500 transition-colors text-sm"
            >
              View on GitHub →
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}
