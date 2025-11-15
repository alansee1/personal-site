/**
 * Shared TypeScript types for the personal site
 * Consolidates commonly used types across components
 */

// ============================================================================
// DATABASE TYPES (matching Supabase schema)
// ============================================================================

/**
 * Work Item (from `works` table in Supabase)
 * Represents a completed or in-progress piece of work
 */
export type WorkItem = {
  id: number;
  project_id: number;
  summary: string;
  completed_summary: string | null;
  tags: string[];
  status: "pending" | "in_progress" | "completed";
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
};

/**
 * Work Item with joined project data
 * Used when fetching work items with their associated project
 */
export type WorkItemWithProject = WorkItem & {
  projects?: {
    id: number;
    slug: string;
    title: string;
  };
};

/**
 * Project (from `projects` table in Supabase)
 */
export type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: "active" | "paused" | "completed";
  tech: string[];
  github: string | null;
  url: string | null;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Minimal project type for dropdowns/filters
 */
export type ProjectMetadata = {
  id: number;
  slug: string;
  title: string;
};
