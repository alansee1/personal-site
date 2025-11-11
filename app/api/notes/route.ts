import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';

// Define the Work Item type (works table with work management fields)
export type WorkItem = {
  id?: number;
  project_id: number;
  summary: string;
  completed_summary: string | null;
  tags: string[];
  status: 'pending' | 'in_progress' | 'completed';
  started_at: string | null;
  completed_at: string | null;
  created_at?: string;
  updated_at?: string;
  projects?: {
    id: number;
    slug: string;
    title: string;
  };
};

// Legacy type alias for backward compatibility
export type Note = WorkItem;

/**
 * GET /api/notes
 *
 * Fetch completed work items from Supabase
 * Public endpoint - uses anon key with RLS protection
 * Only returns items with status='completed' for public display
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    // Build query - join with projects table to get project info
    // Only fetch completed items for public display
    let query = supabaseClient
      .from('works')
      .select('*, projects(id, slug, title)')
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    // Filter by project if specified
    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching works:', error);
      return NextResponse.json(
        { error: 'Failed to fetch works', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error in GET /api/notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint removed - writes happen directly from local machine to Supabase
// Only GET is needed for public reads on the website
