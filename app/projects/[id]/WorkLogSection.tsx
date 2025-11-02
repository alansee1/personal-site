"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type WorkItem = {
  id: number;
  completed_at: string;
  started_at: string | null;
  status: string;
  project_id: number;
  summary: string;
  completed_summary: string | null;
  tags: string[];
};

interface WorkLogSectionProps {
  notes: WorkItem[];
  isNavigatingBack?: boolean;
}

export default function WorkLogSection({ notes, isNavigatingBack }: WorkLogSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (notes.length === 0) {
    return null;
  }

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      if (diffMins < 1) return "just now";
      return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
    }

    if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }

    if (diffDays < 7) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isNavigatingBack ? 0 : 1 }}
      transition={{ duration: isNavigatingBack ? 0.3 : 0.5, delay: isNavigatingBack ? 0 : 0.15 }}
      className="w-full max-w-4xl mt-12 mb-12"
    >
      <details open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)}>
        <summary className="cursor-pointer text-2xl font-light text-white mb-6 flex items-center gap-3 list-none">
          <span>Work Log ({notes.length})</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </summary>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-left">
                <th className="pb-3 pr-6 font-normal text-zinc-500 text-xs uppercase tracking-wider">
                  Time
                </th>
                <th className="pb-3 pr-6 font-normal text-zinc-500 text-xs uppercase tracking-wider">
                  Summary
                </th>
                <th className="pb-3 font-normal text-zinc-500 text-xs uppercase tracking-wider">
                  Tags
                </th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note, index) => (
                <tr
                  key={`${note.completed_at}-${index}`}
                  className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors"
                >
                  <td className="py-3 pr-6 text-zinc-500 whitespace-nowrap align-top">
                    {formatRelativeTime(note.completed_at)}
                  </td>
                  <td className="py-3 pr-6 text-zinc-300 align-top">
                    {note.completed_summary || note.summary}
                  </td>
                  <td className="py-3 align-top">
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-zinc-900 text-zinc-400 rounded border border-zinc-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </motion.div>
  );
}
