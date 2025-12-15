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
    const { companyId } = body;

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Get current state
    const { data: company } = await supabase
      .from('companies')
      .select('is_active')
      .eq('id', companyId)
      .single<{ is_active: boolean }>();

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Toggle the active state
    const { error: updateError } = await supabase
      .from('companies')
      .update({
        is_active: !company.is_active,
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', companyId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      is_active: !company.is_active,
    });
  } catch (error) {
    console.error('Error toggling company:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}
