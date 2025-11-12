"use client";

import { useState } from "react";
import MarkdownSection from "./MarkdownSection";
import WorkTabs from "./WorkTabs";

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

interface ProjectTabsProps {
  markdownContent: string | null;
  pendingWork: WorkItem[];
  completedWork: WorkItem[];
}

export default function ProjectTabs({
  markdownContent,
  pendingWork,
  completedWork,
}: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "work">("overview");

  const totalWorkItems = pendingWork.length + completedWork.length;

  return (
    <div className="w-full max-w-4xl mt-4">
      {/* Main Tab Headers */}
      <div className="flex border-b border-zinc-800 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-3 text-base font-medium transition-colors relative ${
            activeTab === "overview"
              ? "text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Overview
          {activeTab === "overview" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("work")}
          className={`px-6 py-3 text-base font-medium transition-colors relative ${
            activeTab === "work"
              ? "text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Work Items {totalWorkItems > 0 && `(${totalWorkItems})`}
          {activeTab === "work" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && (
          <div>
            {markdownContent ? (
              <MarkdownSection content={markdownContent} />
            ) : (
              <div className="text-zinc-500 text-sm py-8">
                No overview content available for this project.
              </div>
            )}
          </div>
        )}

        {activeTab === "work" && (
          <div>
            <WorkTabs pendingWork={pendingWork} completedWork={completedWork} />
          </div>
        )}
      </div>
    </div>
  );
}
