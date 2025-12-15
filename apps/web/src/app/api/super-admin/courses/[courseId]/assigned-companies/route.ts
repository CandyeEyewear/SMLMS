import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
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

    // Fetch companies that have this course assigned
    const { data: companyCourses, error } = await supabase
      .from('company_courses')
      .select('company_id')
      .eq('course_id', courseId);

    if (error) {
      throw error;
    }

    const companyIds = (companyCourses || []).map((cc) => cc.company_id);

    return NextResponse.json({
      success: true,
      companyIds,
    });
  } catch (error) {
    console.error('Error fetching assigned companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned companies' },
      { status: 500 }
    );
  }
}

