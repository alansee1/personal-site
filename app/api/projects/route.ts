import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

/**
 * GET /api/projects
 *
 * Fetches all projects from Supabase
 * Optional query params:
 *   - status: Filter by status (active, completed, paused)
 *
 * Returns:
 *   { data: Project[], error: null } on success
 *   { data: null, error: string } on failure
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Fetch all projects
    let projectsQuery = supabaseClient
      .from('projects')
      .select('*');

    // Filter by status if provided
    if (status) {
      projectsQuery = projectsQuery.eq('status', status);
    }

    const { data: projects, error: projectsError } = await projectsQuery;

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return NextResponse.json(
        { data: null, error: projectsError.message },
        { status: 500 }
      );
    }

    // Fetch the most recent note timestamp for each project
    const { data: latestNotes, error: notesError } = await supabaseClient
      .from('notes')
      .select('project_id, timestamp')
      .order('timestamp', { ascending: false });

    if (notesError) {
      console.error('Error fetching notes:', notesError);
      // Don't fail if notes fetch fails, just continue without last_updated_at
    }

    // Create a map of project_id -> most recent timestamp
    const lastUpdatedMap = new Map();
    if (latestNotes) {
      latestNotes.forEach(note => {
        if (!lastUpdatedMap.has(note.project_id)) {
          lastUpdatedMap.set(note.project_id, note.timestamp);
        }
      });
    }

    // Enrich projects with last_updated_at
    // Fallback order: most recent note timestamp -> start_date -> updated_at
    const enrichedProjects = projects.map(project => ({
      ...project,
      last_updated_at: lastUpdatedMap.get(project.id) || project.start_date || project.updated_at
    }));

    // Sort: active status first, then by last_updated_at descending
    enrichedProjects.sort((a, b) => {
      // First sort by status (active first)
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;

      // Then sort by last_updated_at (most recent first)
      const dateA = new Date(a.last_updated_at).getTime();
      const dateB = new Date(b.last_updated_at).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ data: enrichedProjects, error: null });
  } catch (error) {
    console.error('Unexpected error in /api/projects:', error);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
