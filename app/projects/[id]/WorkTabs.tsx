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
  created_at: string;
};

interface WorkTabsProps {
  pendingWork: WorkItem[];
  completedWork: WorkItem[];
}

const ITEMS_PER_PAGE = 10;

export default function WorkTabs({ pendingWork, completedWork }: WorkTabsProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    pendingWork.length > 0 ? "pending" : "completed"
  );
  const [pendingPage, setPendingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

  // Format relative time for completed work
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

  // Pagination logic
  const getPaginatedItems = (items: WorkItem[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return items.slice(startIndex, endIndex);
  };

  const getTotalPages = (items: WorkItem[]) => {
    return Math.ceil(items.length / ITEMS_PER_PAGE);
  };

  const paginatedPendingWork = getPaginatedItems(pendingWork, pendingPage);
  const paginatedCompletedWork = getPaginatedItems(completedWork, completedPage);
  const pendingTotalPages = getTotalPages(pendingWork);
  const completedTotalPages = getTotalPages(completedWork);

  // Pagination component
  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center gap-2 mt-6 justify-center">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Previous
        </button>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                currentPage === page
                  ? "bg-white text-black"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Next
        </button>
      </div>
    );
  };

  // Don't render if no work items at all
  if (pendingWork.length === 0 && completedWork.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Segmented Control Style Sub-tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === "pending"
              ? "bg-amber-900/30 text-amber-300 border border-amber-900/50"
              : "bg-zinc-900/40 text-zinc-400 border border-zinc-800 hover:bg-zinc-900/60 hover:text-zinc-300"
          }`}
        >
          Pending ({pendingWork.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === "completed"
              ? "bg-emerald-900/30 text-emerald-300 border border-emerald-900/50"
              : "bg-zinc-900/40 text-zinc-400 border border-zinc-800 hover:bg-zinc-900/60 hover:text-zinc-300"
          }`}
        >
          Completed ({completedWork.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {activeTab === "pending" && (
          <div>
            <div className="overflow-x-auto">
              {pendingWork.length === 0 ? (
                <p className="text-zinc-500 text-sm">No pending work items</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-left">
                      <th className="pb-3 pr-6 font-normal text-zinc-500 text-xs uppercase tracking-wider w-32">
                        Created At
                      </th>
                      <th className="pb-3 pr-6 font-normal text-zinc-500 text-xs uppercase tracking-wider">
                        Summary
                      </th>
                      <th className="pb-3 font-normal text-zinc-500 text-xs uppercase tracking-wider w-64">
                        Tags
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPendingWork.map((item, index) => (
                      <tr
                        key={`${item.id}-${index}`}
                        className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors"
                      >
                        <td className="py-3 pr-6 text-zinc-500 whitespace-nowrap align-top">
                          {item.created_at && formatRelativeTime(item.created_at)}
                        </td>
                        <td className="py-3 pr-6 text-zinc-300 align-top">
                          {item.summary}
                        </td>
                        <td className="py-3 align-top">
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex gap-1.5 flex-wrap">
                              {item.tags.map((tag) => (
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
              )}
            </div>
            <Pagination
              currentPage={pendingPage}
              totalPages={pendingTotalPages}
              onPageChange={setPendingPage}
            />
          </div>
        )}

        {activeTab === "completed" && (
          <div>
            <div className="overflow-x-auto">
              {completedWork.length === 0 ? (
                <p className="text-zinc-500 text-sm">No completed work items</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-left">
                      <th className="pb-3 pr-6 font-normal text-zinc-500 text-xs uppercase tracking-wider w-32">
                        Completed At
                      </th>
                      <th className="pb-3 pr-6 font-normal text-zinc-500 text-xs uppercase tracking-wider">
                        Summary
                      </th>
                      <th className="pb-3 font-normal text-zinc-500 text-xs uppercase tracking-wider w-64">
                        Tags
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCompletedWork.map((note, index) => (
                    <tr
                      key={`${note.completed_at}-${index}`}
                      className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors"
                    >
                      <td className="py-3 pr-6 text-zinc-500 whitespace-nowrap align-top">
                        {note.completed_at && formatRelativeTime(note.completed_at)}
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
            )}
            </div>
            <Pagination
              currentPage={completedPage}
              totalPages={completedTotalPages}
              onPageChange={setCompletedPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
