import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';

// Define the Note type
export type Note = {
  id?: number;
  timestamp: string;
  project_id: string;
  summary: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
};

/**
 * GET /api/notes
 *
 * Fetch all notes from Supabase
 * Public endpoint - uses anon key with RLS protection
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    // Build query
    let query = supabaseClient
      .from('notes')
      .select('*')
      .order('timestamp', { ascending: false });

    // Filter by project if specified
    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notes', details: error.message },
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
