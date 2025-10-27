import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient, supabaseAdmin } from '@/lib/supabase';

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

/**
 * POST /api/notes
 *
 * Create a new note
 * Protected endpoint - requires API_SECRET_KEY
 * Uses service role key to bypass RLS
 */
export async function POST(request: NextRequest) {
  try {
    // Verify API secret
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.API_SECRET_KEY}`;

    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: Note = await request.json();

    // Validate required fields
    if (!body.timestamp || !body.project_id || !body.summary) {
      return NextResponse.json(
        { error: 'Missing required fields: timestamp, project_id, summary' },
        { status: 400 }
      );
    }

    // Validate summary length
    if (body.summary.length > 200) {
      return NextResponse.json(
        { error: 'Summary must be 200 characters or less' },
        { status: 400 }
      );
    }

    // Validate tags is an array
    if (body.tags && !Array.isArray(body.tags)) {
      return NextResponse.json(
        { error: 'Tags must be an array' },
        { status: 400 }
      );
    }

    // Insert note using service role (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('notes')
      .insert({
        timestamp: body.timestamp,
        project_id: body.project_id,
        summary: body.summary,
        tags: body.tags || []
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting note:', error);
      return NextResponse.json(
        { error: 'Failed to create note', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
