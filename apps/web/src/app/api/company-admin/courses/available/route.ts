import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Get available courses for a company
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id, role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Verify user has permission
    if (profile.company_id !== companyId && profile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get courses assigned to company
    const { data: companyCourses, error: companyCoursesError } = await supabase
      .from('company_courses')
      .select('course_id')
      .eq('company_id', companyId);

    if (companyCoursesError) {
      throw companyCoursesError;
    }

    const courseIds = (companyCourses || []).map((cc: any) => cc.course_id);

    if (courseIds.length === 0) {
      return NextResponse.json({
        success: true,
        courses: [],
      });
    }

    // Get course details
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, description, thumbnail_url')
      .in('id', courseIds)
      .eq('is_published', true)
      .order('title');

    if (coursesError) {
      throw coursesError;
    }

    return NextResponse.json({
      success: true,
      courses: courses || [],
    });
  } catch (error: any) {
    console.error('Error fetching available courses:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

