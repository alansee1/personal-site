"use client";

import { useState } from "react";

type WorkItem = {
  id: number;
  completed_at: string | null;
  started_at: string | null;
  status: string;
  project_id: number;
  summary: string;
  completed_summary: string | null;
  tags: string[];
};

interface PendingWorkSectionProps {
  pendingWork: WorkItem[];
}

export default function PendingWorkSection({ pendingWork }: PendingWorkSectionProps) {
  const [isOpen, setIsOpen] = useState(true); // Default open to show pending work

  if (pendingWork.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mt-12 mb-12">
      <details open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)} className="group">
        <summary className="cursor-pointer text-2xl font-light text-white mb-6 flex items-center gap-3 [&::-webkit-details-marker]:hidden [&::marker]:hidden list-none">
          <span>Pending Work ({pendingWork.length})</span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </summary>

        <div className="space-y-3">
          {pendingWork.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-lg hover:bg-zinc-900/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-zinc-300 text-sm">{item.summary}</p>
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap flex-shrink-0">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded border border-zinc-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
