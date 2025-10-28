"use client";

import { useState, useMemo, useEffect } from "react";
import NoteRowSkeleton from "./NoteRowSkeleton";

type Note = {
  id: number;
  timestamp: string;
  project_id: number;
  summary: string;
  tags: string[];
  projects?: {
    id: number;
    slug: string;
    title: string;
  };
};

type Project = {
  id: number;
  slug: string;
  title: string;
};

type SortField = "time" | "project";
type SortDirection = "asc" | "desc";

export default function NotesView() {
  const ITEMS_PER_PAGE = 20;

  // State
  const [notes, setNotes] = useState<Note[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("time");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Fetch notes and projects from API on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch notes with project info
        const notesResponse = await fetch('/api/notes');
        if (!notesResponse.ok) {
          throw new Error('Failed to fetch notes');
        }
        const notesJson = await notesResponse.json();
        setNotes(notesJson.data || []);

        // Fetch projects for filter dropdown
        const projectsResponse = await fetch('/api/projects');
        if (!projectsResponse.ok) {
          throw new Error('Failed to fetch projects');
        }
        const projectsJson = await projectsResponse.json();
        setProjects(projectsJson.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Format timestamp to relative time or date
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Less than 1 hour: "X minutes ago"
    if (diffMins < 60) {
      if (diffMins < 1) return "just now";
      return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
    }

    // Less than 24 hours: "X hours ago"
    if (diffHours < 24) {
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }

    // Less than 7 days: "X days ago"
    if (diffDays < 7) {
      return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
    }

    // Older: Show formatted date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "time" ? "desc" : "asc");
    }
  };

  // Handle tag filter
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    setCurrentPage(1); // Reset to page 1
  };

  // Filter and sort data
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = [...notes];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((note) =>
        note.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by project
    if (selectedProject) {
      filtered = filtered.filter((note) => note.project_id === selectedProject);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) =>
        selectedTags.every((tag) => note.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortField === "time") {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortDirection === "asc" ? timeA - timeB : timeB - timeA;
      } else {
        const projectA = a.projects?.title || "";
        const projectB = b.projects?.title || "";
        return sortDirection === "asc"
          ? projectA.localeCompare(projectB)
          : projectB.localeCompare(projectA);
      }
    });

    return filtered;
  }, [notes, searchQuery, selectedProject, selectedTags, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedNotes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedNotes = filteredAndSortedNotes.slice(startIndex, endIndex);

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-6xl space-y-6">
        {/* Filters (disabled during loading) */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search notes..."
              value=""
              disabled
              readOnly
              className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 placeholder-zinc-600 opacity-50 cursor-not-allowed"
            />
            <select
              value=""
              disabled
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 opacity-50 cursor-not-allowed"
            >
              <option value="">All Projects</option>
            </select>
          </div>
        </div>

        {/* Table with skeleton rows */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-800 text-left">
                <th className="pb-3 pr-6 font-normal text-zinc-500 text-xs uppercase tracking-wider">
                  Time
                </th>
                <th className="pb-3 pr-6 font-normal text-zinc-500 text-xs uppercase tracking-wider">
                  Project
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
              <NoteRowSkeleton />
              <NoteRowSkeleton />
              <NoteRowSkeleton />
              <NoteRowSkeleton />
              <NoteRowSkeleton />
              <NoteRowSkeleton />
              <NoteRowSkeleton />
              <NoteRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-6xl flex items-center justify-center py-20">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        {/* Search and Project Filter */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
          />
          <select
            value={selectedProject?.toString() || ""}
            onChange={(e) => {
              setSelectedProject(e.target.value ? parseInt(e.target.value) : null);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded text-zinc-300 focus:outline-none focus:border-zinc-700"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        {/* Active Tag Filters */}
        {selectedTags.length > 0 && (
          <div className="flex gap-2 items-center">
            <span className="text-xs text-zinc-500">Active filters:</span>
            {selectedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded border border-zinc-700 hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
              >
                {tag}
                <span className="text-zinc-500">×</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full text-sm min-w-[800px]">
        <thead>
          <tr className="border-b border-zinc-800 text-left">
            <th
              className="pb-3 pr-6 font-normal text-zinc-500 text-xs uppercase tracking-wider cursor-pointer hover:text-zinc-400 transition-colors"
              onClick={() => handleSort("time")}
            >
              Time {sortField === "time" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="pb-3 pr-6 font-normal text-zinc-500 text-xs uppercase tracking-wider cursor-pointer hover:text-zinc-400 transition-colors"
              onClick={() => handleSort("project")}
            >
              Project {sortField === "project" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th className="pb-3 pr-6 font-normal text-zinc-500 text-xs uppercase tracking-wider">Summary</th>
            <th className="pb-3 font-normal text-zinc-500 text-xs uppercase tracking-wider">Tags</th>
          </tr>
        </thead>
        <tbody>
          {paginatedNotes.map((note, index) => {
            return (
              <tr
                key={note.id}
                className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors"
              >
                <td className="py-3 pr-6 text-zinc-500 whitespace-nowrap align-top">
                  {formatRelativeTime(note.timestamp)}
                </td>
                <td className="py-3 pr-6 text-zinc-400 whitespace-nowrap align-top">
                  {note.projects?.title || '-'}
                </td>
                <td className="py-3 pr-6 text-zinc-300 align-top">
                  {note.summary}
                </td>
                <td className="py-3 align-top">
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {note.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className="text-xs px-2 py-0.5 bg-zinc-900 text-zinc-400 rounded border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div className="text-sm text-zinc-500">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedNotes.length)} of {filteredAndSortedNotes.length} notes
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
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
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
