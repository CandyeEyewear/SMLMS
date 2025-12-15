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

    // Check if company has users
    const { data: users } = await supabase
      .from('profiles')
      .select('id')
      .eq('company_id', companyId)
      .limit(1);

    if (users && users.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete company with users. Remove all users first or deactivate the company.' },
        { status: 400 }
      );
    }

    // Delete related data
    await supabase.from('subscriptions').delete().eq('company_id', companyId);
    await supabase.from('company_courses').delete().eq('company_id', companyId);
    await supabase.from('groups').delete().eq('company_id', companyId);
    await supabase.from('invitations').delete().eq('company_id', companyId);

    // Delete the company
    const { error: deleteError } = await supabase
      .from('companies')
      .delete()
      .eq('id', companyId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}
