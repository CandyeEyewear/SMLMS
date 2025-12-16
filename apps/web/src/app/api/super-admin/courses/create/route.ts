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
      title,
      slug,
      description,
      thumbnail_url,
      duration_minutes,
      category_id,
      is_active,
      is_featured,
      original_prompt,
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const baseSlug = (slug || title || 'course')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Ensure slug is unique (auto-suffix: "-2", "-3", ...)
    let generatedSlug = baseSlug || 'course';
    for (let i = 0; i < 50; i++) {
      const candidate = i === 0 ? generatedSlug : `${generatedSlug}-${i + 1}`;
      const { data: existingCourse, error: checkError } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', candidate)
        .maybeSingle();
      if (checkError) throw checkError;
      if (!existingCourse) {
        generatedSlug = candidate;
        break;
      }
      if (i === 49) {
        return NextResponse.json(
          { error: 'Unable to generate a unique course slug. Please change the title.' },
          { status: 400 }
        );
      }
    }

    // Create the course
    const { data: course, error: createError } = await supabase
      .from('courses')
      .insert({
        title,
        slug: generatedSlug,
        description,
        thumbnail_url,
        duration_minutes,
        category_id,
        is_active: is_active ?? true,
        is_featured: is_featured ?? false,
        original_prompt,
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
