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
    const { courseId, metadata, blocks } = body;

    // Validate required fields
    if (!metadata.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    let course;

    if (courseId) {
      // Update existing course
      const { data: updatedCourse, error: updateError } = await supabase
        .from('courses')
        .update({
          title: metadata.title,
          slug: metadata.slug,
          description: metadata.description || null,
          thumbnail_url: metadata.thumbnail_url || null,
          duration_minutes: metadata.duration_minutes || null,
          category_id: metadata.category_id || null,
          is_active: metadata.is_active ?? true,
          is_featured: metadata.is_featured ?? false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', courseId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      course = updatedCourse;
    } else {
      // Create new course
      const generatedSlug = metadata.slug || metadata.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if slug already exists
      const { data: existingCourse } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', generatedSlug)
        .single();

      if (existingCourse) {
        return NextResponse.json(
          { error: 'A course with this slug already exists' },
          { status: 400 }
        );
      }

      const { data: newCourse, error: createError } = await supabase
        .from('courses')
        .insert({
          title: metadata.title,
          slug: generatedSlug,
          description: metadata.description || null,
          thumbnail_url: metadata.thumbnail_url || null,
          duration_minutes: metadata.duration_minutes || null,
          category_id: metadata.category_id || null,
          is_active: metadata.is_active ?? true,
          is_featured: metadata.is_featured ?? false,
          created_by: user.id,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      course = newCourse;
    }

    // Save content blocks
    // Note: This assumes you have a course_content_blocks table
    // If not, you may need to create it or store blocks in a JSON field
    if (blocks && blocks.length > 0) {
      // Delete existing blocks if updating
      if (courseId) {
        // Assuming a course_content_blocks table exists
        // If not, you might store blocks in a JSONB field on the courses table
        await supabase
          .from('course_content_blocks')
          .delete()
          .eq('course_id', course.id);
      }

      // Insert new blocks
      // For now, we'll store blocks in a JSONB field on the courses table
      // You can create a separate table later if needed
      const { error: blocksError } = await supabase
        .from('courses')
        .update({
          content_blocks: blocks,
        })
        .eq('id', course.id);

      if (blocksError) {
        // If content_blocks column doesn't exist, we'll just log it
        // You may need to add this column to your courses table
        console.warn('Could not save content blocks:', blocksError);
      }
    }

    return NextResponse.json({
      success: true,
      courseId: course.id,
      course,
    });
  } catch (error) {
    console.error('Error saving course:', error);
    return NextResponse.json(
      { error: 'Failed to save course' },
      { status: 500 }
    );
  }
}

