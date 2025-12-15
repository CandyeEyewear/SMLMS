import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getEffectivePrice } from '@/lib/pricing';

// Get pricing for a specific course and company
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('course_id');
    const companyId = searchParams.get('company_id');

    if (!courseId || !companyId) {
      return NextResponse.json(
        { error: 'Course ID and Company ID are required' },
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

    // Get effective pricing
    const pricing = await getEffectivePrice(courseId, companyId);

    return NextResponse.json({
      success: true,
      pricing,
    });
  } catch (error: any) {
    console.error('Error fetching course pricing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}



