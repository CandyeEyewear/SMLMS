import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the user is a company admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, company_id')
      .eq('id', user.id)
      .single<{ role: string; company_id: string | null }>();

    if (!profile || profile.role !== 'company_admin' || !profile.company_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { groupId } = body;

    if (!groupId) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    // Verify the group belongs to the user's company
    const { data: group } = await supabase
      .from('groups')
      .select('company_id')
      .eq('id', groupId)
      .single();

    if (!group || (group as { company_id: string }).company_id !== profile.company_id) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Delete group members first (cascade should handle this, but being explicit)
    await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId);

    // Delete the group
    const { error: deleteError } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: 'Group deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json(
      { error: 'Failed to delete group' },
      { status: 500 }
    );
  }
}
