"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ResumePage() {
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
        Resume
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-4xl"
      >
        <div className="space-y-12">
          <div>
            <h3 className="text-xl font-light text-white mb-4">Experience</h3>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border-l border-zinc-800 pl-4"
              >
                <h4 className="text-white font-light">Senior Developer</h4>
                <p className="text-sm text-zinc-500">Amazing Company, 2023-2025</p>
                <p className="text-zinc-400 text-sm mt-2">Led development of key features and mentored junior developers.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="border-l border-zinc-800 pl-4"
              >
                <h4 className="text-white font-light">Full Stack Developer</h4>
                <p className="text-sm text-zinc-500">Tech Startup, 2021-2023</p>
                <p className="text-zinc-400 text-sm mt-2">Built full-stack applications from concept to production.</p>
              </motion.div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-light text-white mb-4">Skills</h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-2 flex-wrap"
            >
              {["TypeScript", "React", "Node.js", "Python", "Next.js", "Tailwind CSS", "PostgreSQL", "MongoDB"].map((skill) => (
                <span
                  key={skill}
                  className="text-sm px-3 py-1 bg-zinc-900 text-zinc-300 rounded"
                >
                  {skill}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
