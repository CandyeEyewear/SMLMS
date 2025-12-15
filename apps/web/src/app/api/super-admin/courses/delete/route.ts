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
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Check if course has enrollments
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('id')
      .eq('course_id', courseId)
      .limit(1);

    if (enrollments && enrollments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete course with enrollments. Deactivate it instead.' },
        { status: 400 }
      );
    }

    // Delete related data first (cascade should handle most, but being explicit)
    // Delete modules (lessons will cascade)
    await supabase
      .from('modules')
      .delete()
      .eq('course_id', courseId);

    // Delete company_courses
    await supabase
      .from('company_courses')
      .delete()
      .eq('course_id', courseId);

    // Delete the course
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
