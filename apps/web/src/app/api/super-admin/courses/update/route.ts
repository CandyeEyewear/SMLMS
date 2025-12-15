import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the user is a super admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>();

    if (!profile || profile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      title,
      slug,
      description,
      thumbnail_url,
      duration_minutes,
      category_id,
      is_active,
      is_featured,
    } = body;

    // Validate required fields
    if (!id || !title || !slug) {
      return NextResponse.json(
        { error: 'ID, title, and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists for a different course
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single();

    if (existingCourse) {
      return NextResponse.json(
        { error: 'A course with this slug already exists' },
        { status: 400 }
      );
    }

    // Update the course
    const { data: course, error: updateError } = await supabase
      .from('courses')
      .update({
        title,
        slug,
        description,
        thumbnail_url,
        duration_minutes,
        category_id,
        is_active,
        is_featured,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}
