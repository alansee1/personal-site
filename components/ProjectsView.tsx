"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProjectCardSkeleton from "./ProjectCardSkeleton";

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

export default function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const result = await response.json();
          setProjects(result.data || []);
        } else {
          setError('Failed to load projects');
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Get status badge color
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
          <Link key={project.id} href={`/projects/${project.slug}`}>
            <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all cursor-pointer hover:bg-zinc-900/30">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-light text-white">{project.title}</h3>
                <span className={`text-xs px-2 py-1 rounded border capitalize ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <p className="text-zinc-400 mb-4">{project.description}</p>

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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
