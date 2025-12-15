import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Create or update course pricing
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
      .single();

    if (profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { course_id, setup_fee, reactivation_fee, seat_fee, currency } = body;

    if (!course_id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    if (
      setup_fee === undefined ||
      reactivation_fee === undefined ||
      seat_fee === undefined
    ) {
      return NextResponse.json(
        { error: 'All pricing fields are required' },
        { status: 400 }
      );
    }

    // Upsert course pricing
    const { data: pricing, error } = await supabase
      .from('course_pricing')
      .upsert(
        {
          course_id,
          setup_fee,
          reactivation_fee,
          seat_fee,
          currency: currency || 'USD',
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'course_id',
        }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      pricing,
    });
  } catch (error: any) {
    console.error('Error updating course pricing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update pricing' },
      { status: 500 }
    );
  }
}



