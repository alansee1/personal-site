"use client";

import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  long_description: string | null;
  status: string;
  tech: string[];
  github: string | null;
  url: string | null;
  media: any[];
  start_date: string | null;
  end_date: string | null;
};

type Note = {
  id: number;
  timestamp: string;
  project_id: number;
  summary: string;
  tags: string[];
};

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id: slug } = React.use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project from API
  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${slug}`);
        if (response.ok) {
          const result = await response.json();
          setProject(result.data);
        } else if (response.status === 404) {
          setProject(null);
        } else {
          setError('Failed to load project');
        }
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setError('Failed to load project');
      } finally {
        setLoadingProject(false);
      }
    }
    fetchProject();
  }, [slug]);

  // Fetch notes from API when project loads
  useEffect(() => {
    if (!project?.id) return;

    async function fetchNotes() {
      try {
        const response = await fetch(`/api/notes?project_id=${project.id}`);
        if (response.ok) {
          const data = await response.json();
          setNotes(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      } finally {
        setLoadingNotes(false);
      }
    }
    fetchNotes();
  }, [project?.id]);

  if (loadingProject) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    notFound();
  }

  // Get all notes related to this project (already filtered by API)
  const projectNotes = notes;

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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full min-h-screen flex flex-col items-start pt-8 pl-8 pr-8 pb-16 overflow-y-auto overflow-x-hidden">
        {/* Back button */}
        <Link
          href="/projects"
          className="text-white text-sm hover:text-zinc-400 transition-colors mb-8 cursor-pointer"
        >
          ← back
        </Link>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-start justify-between mb-6 w-full max-w-4xl"
        >
          <h1 className="text-5xl md:text-6xl font-light tracking-wide text-white">{project.title}</h1>
          <span className={`text-xs px-3 py-1.5 rounded border capitalize ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-4xl mb-12"
        >

        <p className="text-xl text-zinc-400 mb-8 leading-relaxed">{project.description}</p>

        {/* Tech Stack */}
        <div className="mb-8">
          <h2 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">Tech Stack</h2>
          <div className="flex gap-2 flex-wrap">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="text-sm px-3 py-1.5 bg-zinc-900 text-zinc-300 rounded border border-zinc-800"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {(project.url || project.github) && (
          <div className="flex gap-4 mb-12">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-black rounded hover:bg-zinc-200 transition-colors text-sm font-medium"
              >
                View Live Site →
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
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

      {/* Work Log / Notes */}
      {projectNotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-4xl mb-12"
        >
          <h2 className="text-2xl font-light text-white mb-6">Work Log</h2>
          <div className="space-y-4">
            {projectNotes.map((note, index) => (
              <div
                key={`${note.timestamp}-${index}`}
                className="border-l-2 border-zinc-800 pl-4 py-2"
              >
                <p className="text-xs text-zinc-500 mb-1">{formatDate(note.timestamp)}</p>
                <p className="text-zinc-300">{note.summary}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}
