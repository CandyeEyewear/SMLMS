import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
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
    const { courseId, metadata, modules } = body as {
      courseId?: string;
      metadata: {
        title: string;
        slug?: string;
        description?: string;
        thumbnail_url?: string;
        duration_minutes?: number | null;
        category_id?: string;
        is_active?: boolean;
        is_featured?: boolean;
        original_prompt?: string;
      };
      modules?: Array<{
        id: string;
        title: string;
        description?: string;
        sort_order?: number;
        lessons: Array<{
          id: string;
          title: string;
          description?: string;
          sort_order?: number;
          duration_minutes?: number | null;
          content: { blocks: unknown[] };
        }>;
      }>;
    };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL' },
        { status: 500 }
      );
    }

    // Use service role for course-builder writes (bypasses RLS). Route is still protected by role checks above.
    const admin = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Validate required fields
    if (!metadata.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const totalLessons = (modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
    if (totalLessons === 0) {
      return NextResponse.json(
        { error: 'At least one lesson is required' },
        { status: 400 }
      );
    }

    let course;

    if (courseId) {
      // Update existing course
      const { data: updatedCourse, error: updateError } = await admin
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
          original_prompt: metadata.original_prompt,
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
      const { data: existingCourse } = await admin
        .from('courses')
        .select('id')
        .eq('slug', generatedSlug)
        .maybeSingle();

      if (existingCourse) {
        return NextResponse.json(
          { error: 'A course with this slug already exists' },
          { status: 400 }
        );
      }

      const { data: newCourse, error: createError } = await admin
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
          original_prompt: metadata.original_prompt,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      course = newCourse;
    }

    // Persist structure + lesson content (blocks live in lessons.content JSON)
    const moduleRows = (modules || []).map((m, idx) => ({
      id: m.id,
      course_id: course.id,
      title: m.title || `Module ${idx + 1}`,
      description: m.description || null,
      sort_order: m.sort_order ?? idx,
      is_published: false,
      updated_at: new Date().toISOString(),
    }));

    // Upsert modules
    const { error: upsertModulesError } = await admin
      .from('modules')
      .upsert(moduleRows as never, { onConflict: 'id' } as never);

    if (upsertModulesError) {
      console.error('Error saving modules:', upsertModulesError);
      return NextResponse.json({ error: 'Failed to save modules', details: upsertModulesError.message }, { status: 500 });
    }

    const moduleIds = moduleRows.map((m) => m.id);
    const moduleIdList = `(${moduleIds.map((id) => `"${id}"`).join(',')})`;

    // Delete removed modules (and cascades lessons via FK)
    await admin
      .from('modules')
      .delete()
      .eq('course_id', course.id)
      .not('id', 'in', moduleIdList);

    const lessonRows = (modules || []).flatMap((m, mi) =>
      (m.lessons || []).map((l, li) => ({
        id: l.id,
        module_id: m.id,
        title: l.title || `Lesson ${li + 1}`,
        description: l.description || null,
        content_type: 'interactive',
        content: l.content || { blocks: [] },
        duration_minutes: l.duration_minutes ?? 0,
        sort_order: l.sort_order ?? li,
        is_preview: false,
        is_published: false,
        updated_at: new Date().toISOString(),
      }))
    );

    const { error: upsertLessonsError } = await admin
      .from('lessons')
      .upsert(lessonRows as never, { onConflict: 'id' } as never);

    if (upsertLessonsError) {
      console.error('Error saving lessons:', upsertLessonsError);
      return NextResponse.json({ error: 'Failed to save lessons', details: upsertLessonsError.message }, { status: 500 });
    }

    const lessonIds = lessonRows.map((l) => l.id);
    const lessonIdList = `(${lessonIds.map((id) => `"${id}"`).join(',')})`;

    // Delete removed lessons within remaining modules
    await admin
      .from('lessons')
      .delete()
      .in('module_id', moduleIds)
      .not('id', 'in', lessonIdList);

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

