import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

/**
 * GET /api/projects/[slug]
 *
 * Fetches a single project by slug
 *
 * Returns:
 *   { data: Project, error: null } on success
 *   { data: null, error: string } on failure (404 if not found)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data, error } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json(
          { data: null, error: 'Project not found' },
          { status: 404 }
        );
      }

      console.error('Error fetching project:', error);
      return NextResponse.json(
        { data: null, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, error: null });
  } catch (error) {
    console.error('Unexpected error in /api/projects/[slug]:', error);
    return NextResponse.json(
      { data: null, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
