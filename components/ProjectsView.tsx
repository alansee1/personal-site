"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProjectCardSkeleton from "./ProjectCardSkeleton";
import { withViewTransition } from "@/lib/viewTransition";

type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: string;
  tech: string[];
  github: string | null;
  url: string | null;
  last_updated_at: string;
};

type ProjectsViewProps = {
  onTransitionStart?: () => void;
  isEmbedded?: boolean;
};

export default function ProjectsView(props: ProjectsViewProps = {}) {
  const { onTransitionStart, isEmbedded = false } = props;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to load projects");
        }
        const result = await response.json();
        if (isMounted) {
          setProjects(result.data || []);
        }
      } catch (_error) {
        console.error("Failed to load projects:", _error);
        if (isMounted) {
          setError("Failed to load projects");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProjectClick = (slug: string) => {
    if (pendingSlug) {
      return;
    }

    setPendingSlug(slug);
    onTransitionStart?.();

    withViewTransition(() => {
      router.push(`/projects/${slug}`);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-900/30 text-emerald-300 border-emerald-800";
      case "completed":
        return "bg-blue-900/30 text-blue-300 border-blue-800";
      case "paused":
        return "bg-zinc-700/30 text-zinc-400 border-zinc-600";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

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

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      // Status filter
      if (statusFilter !== "all" && project.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tech.some((t) => t.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.last_updated_at).getTime() - new Date(a.last_updated_at).getTime();
        case "name":
          return a.title.localeCompare(b.title);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  // Count projects by status
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="w-full max-w-7xl">
        <p className="text-zinc-400">No projects yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl">
      {/* Header with stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-zinc-400 text-sm">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
          {statusCounts.active > 0 && (
            <>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 text-sm">{statusCounts.active} Active</span>
            </>
          )}
          {statusCounts.completed > 0 && (
            <>
              <span className="text-zinc-600">•</span>
              <span className="text-blue-400 text-sm">{statusCounts.completed} Completed</span>
            </>
          )}
          {statusCounts.paused > 0 && (
            <>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-500 text-sm">{statusCounts.paused} Paused</span>
            </>
          )}
        </div>
      </motion.div>

      {/* Filters and controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-sm text-zinc-300 focus:outline-none focus:border-zinc-700"
        >
          <option value="all">All Projects</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-sm text-zinc-300 focus:outline-none focus:border-zinc-700"
        >
          <option value="recent">Sort: Recent</option>
          <option value="name">Sort: Name</option>
          <option value="status">Sort: Status</option>
        </select>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
        />
      </motion.div>

      {/* Projects grid with staggered animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1 + index * 0.1,
            }}
            onClick={() => handleProjectClick(project.slug)}
            className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 cursor-pointer hover:bg-zinc-900/30 transition-colors flex flex-col h-full"
            whileHover={{ y: -4 }}
            style={{
              viewTransitionName: `project-card-${project.slug}`,
              pointerEvents: pendingSlug ? "none" : "auto",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h3
                className="font-light text-white tracking-wide text-xl flex-1 line-clamp-2"
                style={{ viewTransitionName: `project-title-${project.slug}` }}
              >
                {project.title}
              </h3>
              <span
                className={`text-xs rounded border capitalize px-2 py-1 ml-2 whitespace-nowrap ${getStatusColor(project.status)}`}
                style={{ viewTransitionName: `project-status-${project.slug}` }}
              >
                {project.status}
              </span>
            </div>

            {/* Description */}
            <p
              className="text-zinc-400 text-sm mb-4 flex-grow line-clamp-3"
              style={{ viewTransitionName: `project-description-${project.slug}` }}
            >
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="flex gap-2 flex-wrap mb-4">
              {project.tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 bg-zinc-900 text-zinc-300 rounded"
                >
                  {t}
                </span>
              ))}
              {project.tech.length > 4 && (
                <span className="text-xs px-2 py-1 bg-zinc-900 text-zinc-500 rounded">
                  +{project.tech.length - 4}
                </span>
              )}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs text-zinc-500 pt-3 border-t border-zinc-800">
              {project.url && (
                <span className="flex items-center gap-1">
                  <span>🔗</span>
                  <span>Live</span>
                </span>
              )}
              {project.github && (
                <span className="flex items-center gap-1">
                  <span>📦</span>
                  <span>Code</span>
                </span>
              )}
              <span className="text-zinc-600 ml-auto">
                Updated {formatRelativeTime(project.last_updated_at)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state for filtered results */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-zinc-500 text-sm">No projects match your filters.</p>
          <button
            onClick={() => {
              setStatusFilter("all");
              setSearchQuery("");
            }}
            className="mt-3 text-sm text-zinc-400 hover:text-zinc-300 underline"
          >
            Clear filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
