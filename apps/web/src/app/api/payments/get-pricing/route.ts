import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Get pricing for a company (returns custom if exists, otherwise default)
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

    // Get pricing using the database function
    const { data: pricing, error } = await supabase
      .rpc('get_company_pricing', { p_company_id: companyId });

    if (error) {
      // Fallback to manual query if function doesn't exist
      const { data: defaultPricing } = await supabase
        .from('default_pricing')
        .select('*')
        .eq('is_active', true)
        .single();

      const { data: customPricing } = await supabase
        .from('company_pricing')
        .select('*')
        .eq('company_id', companyId)
        .single();

      return NextResponse.json({
        success: true,
        pricing: {
          setup_fee: customPricing?.setup_fee ?? defaultPricing?.setup_fee ?? 0,
          user_price_per_month: customPricing?.user_price_per_month ?? defaultPricing?.user_price_per_month ?? 0,
          currency: customPricing?.currency ?? defaultPricing?.currency ?? 'USD',
          is_custom: !!customPricing,
        },
      });
    }

    return NextResponse.json({
      success: true,
      pricing: pricing?.[0] || {
        setup_fee: 0,
        user_price_per_month: 0,
        currency: 'USD',
        is_custom: false,
      },
    });
  } catch (error: any) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}



