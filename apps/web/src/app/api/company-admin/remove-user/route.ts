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
    const { userId } = body;

    // Cannot remove yourself
    if (userId === user.id) {
      return NextResponse.json(
        { error: 'You cannot remove yourself from the team' },
        { status: 400 }
      );
    }

    // Verify the user belongs to the same company
    const { data: targetUser } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', userId)
      .single<{ company_id: string | null }>();

    if (!targetUser || targetUser.company_id !== profile.company_id) {
      return NextResponse.json(
        { error: 'User not found in your company' },
        { status: 404 }
      );
    }

    // Remove user from company (set company_id to null, role to 'user')
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        company_id: null,
        role: 'user',
      } as never)
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Remove from all groups
    await supabase
      .from('group_members')
      .delete()
      .eq('user_id', userId);

    // Cancel active enrollments (optional - you might want to keep history)
    await supabase
      .from('enrollments')
      .update({ status: 'cancelled' } as never)
      .eq('user_id', userId)
      .eq('company_id', profile.company_id)
      .in('status', ['not_started', 'in_progress']);

    return NextResponse.json({
      success: true,
      message: 'User removed from team',
    });
  } catch (error) {
    console.error('Error removing user:', error);
    return NextResponse.json(
      { error: 'Failed to remove user' },
      { status: 500 }
    );
  }
}
