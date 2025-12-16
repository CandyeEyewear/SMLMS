import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function sortBy<T>(items: T[], getKey: (item: T) => number) {
  return [...items].sort((a, b) => getKey(a) - getKey(b));
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>();

    if (!profile || profile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, changeNotes } = body as { courseId?: string; changeNotes?: string };

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL' },
        { status: 500 }
      );
    }

    const admin = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Fetch course + structure (modules/lessons). Lesson content includes blocks in `lessons.content`.
    const { data: course, error: courseError } = await admin
      .from('courses')
      .select('id, title, slug, description, thumbnail_url, duration_minutes, category_id, is_active, is_featured, is_published, published_at')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const { data: modulesData, error: modulesError } = await admin
      .from('modules')
      .select('id, title, description, sort_order')
      .eq('course_id', courseId);

    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
      return NextResponse.json({ error: 'Failed to load course modules' }, { status: 500 });
    }

    const moduleIds = (modulesData || []).map((m) => m.id);
    const { data: lessonsData, error: lessonsError } = moduleIds.length
      ? await admin
          .from('lessons')
          .select('id, module_id, title, description, sort_order, duration_minutes, content, is_published')
          .in('module_id', moduleIds)
      : { data: [], error: null };

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
      return NextResponse.json({ error: 'Failed to load course lessons' }, { status: 500 });
    }

    // Ensure there is at least 1 lesson and 1 block somewhere (guide: course structure + content blocks).
    const lessons = lessonsData || [];
    const hasAnyLesson = lessons.length > 0;
    const hasAnyBlock = lessons.some((l) => {
      const content = (l as { content?: { blocks?: unknown[] } }).content;
      return Array.isArray(content?.blocks) && content.blocks.length > 0;
    });

    if (!hasAnyLesson) {
      return NextResponse.json({ error: 'Add at least one lesson before publishing' }, { status: 400 });
    }
    if (!hasAnyBlock) {
      return NextResponse.json({ error: 'Add at least one content block before publishing' }, { status: 400 });
    }

    const modulesSorted = sortBy(modulesData || [], (m) => (m as { sort_order?: number }).sort_order ?? 0);
    const lessonsByModule = new Map<string, any[]>();
    for (const l of lessons) {
      const moduleId = (l as { module_id: string }).module_id;
      const list = lessonsByModule.get(moduleId) || [];
      list.push(l);
      lessonsByModule.set(moduleId, list);
    }

    const snapshot = {
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnail_url: course.thumbnail_url,
        duration_minutes: course.duration_minutes,
        category_id: course.category_id,
      },
      modules: modulesSorted.map((m) => {
        const ls = sortBy(lessonsByModule.get(m.id) || [], (x) => (x as { sort_order?: number }).sort_order ?? 0);
        return {
          id: m.id,
          title: m.title,
          description: m.description,
          sort_order: m.sort_order ?? 0,
          lessons: ls.map((l) => ({
            id: l.id,
            title: l.title,
            description: l.description,
            sort_order: l.sort_order ?? 0,
            duration_minutes: l.duration_minutes ?? 0,
            content: l.content ?? { blocks: [] },
          })),
        };
      }),
      published_at: new Date().toISOString(),
      published_by: user.id,
    };

    // Determine next version number.
    const { data: latestVersion } = await admin
      .from('course_versions')
      .select('version_number')
      .eq('course_id', courseId)
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextVersionNumber = ((latestVersion as { version_number?: number } | null)?.version_number || 0) + 1;

    // Mark existing current versions as not current.
    await admin
      .from('course_versions')
      .update({ is_current: false } as never)
      .eq('course_id' as never, courseId as never)
      .eq('is_current' as never, true as never);

    // Insert new version snapshot.
    const { data: createdVersion, error: versionError } = await admin
      .from('course_versions')
      .insert({
        course_id: courseId,
        version_number: nextVersionNumber,
        title: course.title,
        description: course.description,
        content_snapshot: snapshot,
        is_current: true,
        published_at: new Date().toISOString(),
        published_by: user.id,
        change_notes: changeNotes || null,
      } as never)
      .select()
      .single();

    if (versionError) {
      console.error('Error creating course version:', versionError);
      return NextResponse.json({ error: 'Failed to create course version', details: versionError.message }, { status: 500 });
    }

    // Publish course + structure.
    const now = new Date().toISOString();
    const { error: publishCourseError } = await admin
      .from('courses')
      .update({ is_published: true, published_at: now } as never)
      .eq('id', courseId);

    if (publishCourseError) {
      console.error('Error publishing course:', publishCourseError);
      return NextResponse.json({ error: 'Failed to publish course', details: publishCourseError.message }, { status: 500 });
    }

    await admin
      .from('modules')
      .update({ is_published: true, updated_at: now } as never)
      .eq('course_id' as never, courseId as never);

    if (moduleIds.length > 0) {
      await admin
        .from('lessons')
        .update({ is_published: true, updated_at: now } as never)
        .in('module_id', moduleIds);
    }

    return NextResponse.json({
      success: true,
      courseId,
      version: createdVersion,
    });
  } catch (error) {
    console.error('Error publishing course:', error);
    return NextResponse.json(
      { error: 'Failed to publish course', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

