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

    let query = supabaseClient
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { data: null, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, error: null });
  } catch (error) {
    console.error('Unexpected error in /api/projects:', error);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
