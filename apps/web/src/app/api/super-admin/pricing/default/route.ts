import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Get default pricing
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

    const { data: pricing, error } = await supabase
      .from('default_pricing')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({
      success: true,
      pricing: pricing || {
        setup_fee: 0,
        user_price_per_month: 0,
        currency: 'USD',
      },
    });
  } catch (error: any) {
    console.error('Error fetching default pricing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}

// Update default pricing
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
    const { setup_fee, user_price_per_month, currency } = body;

    if (setup_fee === undefined || user_price_per_month === undefined) {
      return NextResponse.json(
        { error: 'Setup fee and user price per month are required' },
        { status: 400 }
      );
    }

    // Deactivate all existing default pricing
    await supabase
      .from('default_pricing')
      .update({ is_active: false })
      .eq('is_active', true);

    // Create new default pricing
    const { data: pricing, error } = await supabase
      .from('default_pricing')
      .insert({
        setup_fee,
        user_price_per_month,
        currency: currency || 'USD',
        is_active: true,
      })
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
    console.error('Error updating default pricing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update pricing' },
      { status: 500 }
    );
  }
}



