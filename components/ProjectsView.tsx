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

  if (loading) {
    return (
      <div className="w-full max-w-4xl">
        <div className="space-y-6">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="w-full max-w-4xl">
        <p className="text-zinc-400">No projects yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="space-y-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            onClick={() => handleProjectClick(project.slug)}
            className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 cursor-pointer hover:bg-zinc-900/30"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            style={{
              viewTransitionName: `project-card-${project.slug}`,
              pointerEvents: pendingSlug ? "none" : "auto",
            }}
          >
            {/* Title with layoutId - morphs to detail */}
            <div className="flex items-start justify-between mb-3">
              <h3
                className="font-light text-white tracking-wide text-2xl flex-1"
                style={{ viewTransitionName: `project-title-${project.slug}` }}
              >
                {project.title}
              </h3>
              <span
                className={`text-xs rounded border capitalize px-2 py-1 ${getStatusColor(project.status)}`}
                style={{ viewTransitionName: `project-status-${project.slug}` }}
              >
                {project.status}
              </span>
            </div>

            {/* Description */}
            <p
              className="text-zinc-400 mb-4"
              style={{ viewTransitionName: `project-description-${project.slug}` }}
            >
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="flex gap-2 flex-wrap mb-4">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 bg-zinc-900 text-zinc-300 rounded"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <div className="flex gap-4">
                {project.url && (
                  <span className="flex items-center gap-1">
                    <span>🔗</span>
                    <span>Live site</span>
                  </span>
                )}
                {project.github && (
                  <span className="flex items-center gap-1">
                    <span>📦</span>
                    <span>GitHub</span>
                  </span>
                )}
              </div>
              <span className="text-zinc-600">
                Updated {formatRelativeTime(project.last_updated_at)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
