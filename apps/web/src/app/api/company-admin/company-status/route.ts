import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Get company status (setup fee paid, etc.)
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

    // Get company details
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('setup_fee_paid, setup_fee_paid_at')
      .eq('id', companyId)
      .single();

    if (companyError) {
      throw companyError;
    }

    return NextResponse.json({
      success: true,
      setup_fee_paid: company.setup_fee_paid || false,
      setup_fee_paid_at: company.setup_fee_paid_at,
    });
  } catch (error: any) {
    console.error('Error fetching company status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch company status' },
      { status: 500 }
    );
  }
}



