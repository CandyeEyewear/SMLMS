import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function formatUnknownError(err: unknown) {
  if (err instanceof Error) {
    return { message: err.message };
  }
  if (typeof err === 'string') {
    return { message: err };
  }
  if (err && typeof err === 'object') {
    const anyErr = err as any;
    // Supabase/PostgREST errors often look like: { message, details, hint, code }
    const message =
      typeof anyErr.message === 'string'
        ? anyErr.message
        : typeof anyErr.error === 'string'
          ? anyErr.error
          : 'Unknown error';
    const details = typeof anyErr.details === 'string' ? anyErr.details : undefined;
    const hint = typeof anyErr.hint === 'string' ? anyErr.hint : undefined;
    const code = typeof anyErr.code === 'string' ? anyErr.code : undefined;
    return { message, details, hint, code };
  }
  return { message: 'Unknown error' };
}

function maybeStripMissingColumn(payload: Record<string, any>, err: unknown) {
  const formatted = formatUnknownError(err);
  // PostgREST missing column error looks like:
  // "Could not find the 'is_active' column of 'courses' in the schema cache"
  if (formatted.code !== 'PGRST204' || typeof formatted.message !== 'string') {
    return { payload, stripped: null as string | null };
  }

  const match = formatted.message.match(/Could not find the '([^']+)' column of 'courses'/);
  const column = match?.[1];
  if (!column) return { payload, stripped: null as string | null };

  if (Object.prototype.hasOwnProperty.call(payload, column)) {
    const next = { ...payload };
    delete next[column];
    return { payload: next, stripped: column };
  }

  return { payload, stripped: null as string | null };
}

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
          is_preview?: boolean;
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
      const updatePayload: Record<string, any> = {
        title: metadata.title,
        slug: metadata.slug,
        description: metadata.description || null,
        thumbnail_url: metadata.thumbnail_url || null,
        duration_minutes: metadata.duration_minutes || null,
        category_id: metadata.category_id || null,
        is_active: metadata.is_active ?? true,
        is_featured: metadata.is_featured ?? false,
        updated_at: new Date().toISOString(),
      };

      // Only include when provided (avoid sending null/undefined into NOT NULL columns).
      if (typeof metadata.original_prompt === 'string' && metadata.original_prompt.trim()) {
        updatePayload.original_prompt = metadata.original_prompt;
      }

      let updatedCourse: any = null;
      try {
        const res = await admin
          .from('courses')
          .update(updatePayload as never)
          .eq('id', courseId)
          .select()
          .single();
        if (res.error) throw res.error;
        updatedCourse = res.data;
      } catch (err) {
        // If schema is behind (missing column), strip it and retry once.
        const stripped1 = maybeStripMissingColumn(updatePayload, err);
        if (!stripped1.stripped) throw err;
        const res2 = await admin
          .from('courses')
          .update(stripped1.payload as never)
          .eq('id', courseId)
          .select()
          .single();
        if (res2.error) throw res2.error;
        updatedCourse = res2.data;
      }

      course = updatedCourse;
    } else {
      // Create new course
      const baseSlug = (metadata.slug || metadata.title || 'course')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Ensure slug is unique (auto-suffix: "-2", "-3", ...)
      let generatedSlug = baseSlug || 'course';
      for (let i = 0; i < 50; i++) {
        const candidate = i === 0 ? generatedSlug : `${generatedSlug}-${i + 1}`;
        const { data: existingCourse, error: checkError } = await admin
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

      const insertPayload: Record<string, any> = {
        title: metadata.title,
        slug: generatedSlug,
        description: metadata.description || null,
        thumbnail_url: metadata.thumbnail_url || null,
        duration_minutes: metadata.duration_minutes || null,
        category_id: metadata.category_id || null,
        is_active: metadata.is_active ?? true,
        is_featured: metadata.is_featured ?? false,
      };

      if (typeof metadata.original_prompt === 'string' && metadata.original_prompt.trim()) {
        insertPayload.original_prompt = metadata.original_prompt;
      }

      let newCourse: any = null;
      try {
        const res = await admin
          .from('courses')
          .insert(insertPayload as never)
          .select()
          .single();
        if (res.error) throw res.error;
        newCourse = res.data;
      } catch (err) {
        const stripped1 = maybeStripMissingColumn(insertPayload, err);
        if (!stripped1.stripped) throw err;
        const res2 = await admin
          .from('courses')
          .insert(stripped1.payload as never)
          .select()
          .single();
        if (res2.error) throw res2.error;
        newCourse = res2.data;
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

    // Delete removed modules (and cascades lessons via FK)
    // PostgREST expects `in.(a,b,c)`-style lists; values should not be quoted.
    if (moduleIds.length > 0) {
      const moduleIdList = `(${moduleIds.join(',')})`;
      await admin
        .from('modules')
        .delete()
        .eq('course_id', course.id)
        .not('id', 'in', moduleIdList);
    }

    const lessonRows = (modules || []).flatMap((m, mi) =>
      (m.lessons || []).map((l, li) => ({
        id: l.id,
        module_id: m.id,
        title: l.title || `Lesson ${li + 1}`,
        description: l.description || null,
        content_type: 'text',
        content: l.content || { blocks: [] },
        duration_minutes: l.duration_minutes ?? 0,
        sort_order: l.sort_order ?? li,
        is_preview: l.is_preview ?? false,
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

    // Delete removed lessons within remaining modules
    if (moduleIds.length > 0 && lessonIds.length > 0) {
      const lessonIdList = `(${lessonIds.join(',')})`;
      await admin
        .from('lessons')
        .delete()
        .in('module_id', moduleIds)
        .not('id', 'in', lessonIdList);
    }

    return NextResponse.json({
      success: true,
      courseId: course.id,
      course,
    });
  } catch (error) {
    const formatted = formatUnknownError(error);
    console.error('Error saving course:', formatted, error);
    return NextResponse.json(
      { error: 'Failed to save course', details: formatted },
      { status: 500 }
    );
  }
}

