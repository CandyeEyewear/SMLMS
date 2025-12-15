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
    const { userId, role } = body;

    // Validate role
    if (!['user', 'company_admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Cannot change your own role
    if (userId === user.id) {
      return NextResponse.json(
        { error: 'You cannot change your own role' },
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

    // Update the user's role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role } as never)
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role === 'company_admin' ? 'Admin' : 'Learner'}`,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
