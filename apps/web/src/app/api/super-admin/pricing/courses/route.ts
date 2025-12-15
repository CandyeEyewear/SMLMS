import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Get all courses with their pricing
export async function GET() {
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
      .single();

    if (profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all courses with their pricing
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title')
      .order('title');

    if (coursesError) {
      throw coursesError;
    }

    // Get pricing for each course
    const { data: pricing, error: pricingError } = await supabase
      .from('course_pricing')
      .select('*');

    if (pricingError && pricingError.code !== 'PGRST116') {
      throw pricingError;
    }

    // Merge courses with pricing
    const coursesWithPricing = (courses || []).map((course) => {
      const coursePricing = (pricing || []).find((p) => p.course_id === course.id);
      return {
        course_id: course.id,
        course_title: course.title,
        setup_fee: coursePricing?.setup_fee ?? 0,
        reactivation_fee: coursePricing?.reactivation_fee ?? 0,
        seat_fee: coursePricing?.seat_fee ?? 0,
        currency: coursePricing?.currency ?? 'USD',
        id: coursePricing?.id,
      };
    });

    return NextResponse.json({
      success: true,
      courses: coursesWithPricing,
    });
  } catch (error: any) {
    console.error('Error fetching courses pricing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}



