import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Get company pricing
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const { data: pricing, error } = await supabase
      .from('company_pricing')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({
      success: true,
      pricing: pricing || null,
    });
  } catch (error: any) {
    console.error('Error fetching company pricing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}

// Set custom pricing for a company
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
    const { company_id, setup_fee, user_price_per_month, currency, remove_custom } = body;

    if (!company_id) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Remove custom pricing if requested
    if (remove_custom) {
      const { error: deleteError } = await supabase
        .from('company_pricing')
        .delete()
        .eq('company_id', company_id);

      if (deleteError) {
        throw deleteError;
      }

      return NextResponse.json({
        success: true,
        message: 'Custom pricing removed',
      });
    }

    if (setup_fee === undefined || user_price_per_month === undefined) {
      return NextResponse.json(
        { error: 'Setup fee and user price per month are required' },
        { status: 400 }
      );
    }

    // Upsert company pricing
    const { data: pricing, error } = await supabase
      .from('company_pricing')
      .upsert({
        company_id,
        setup_fee,
        user_price_per_month,
        currency: currency || 'USD',
        is_custom: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'company_id',
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
    console.error('Error updating company pricing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update pricing' },
      { status: 500 }
    );
  }
}



