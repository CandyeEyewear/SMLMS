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
    const { email, fullName, role, companyId, groupIds } = body;

    // Verify the company ID matches
    if (companyId !== profile.company_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already exists with this email
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, company_id')
      .eq('email', email)
      .single<{ id: string; company_id: string | null }>();

    if (existingProfile) {
      if (existingProfile.company_id === companyId) {
        return NextResponse.json(
          { error: 'User is already a member of your company' },
          { status: 400 }
        );
      }
      if (existingProfile.company_id) {
        return NextResponse.json(
          { error: 'User is already a member of another company' },
          { status: 400 }
        );
      }
      // User exists but has no company - update their profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          company_id: companyId,
          role: role || 'user',
          full_name: fullName || existingProfile.id,
        } as never)
        .eq('id', existingProfile.id);

      if (updateError) {
        throw updateError;
      }

      // Add to groups if specified
      if (groupIds && groupIds.length > 0) {
        const groupMemberships = groupIds.map((groupId: string) => ({
          group_id: groupId,
          user_id: existingProfile.id,
        }));
        await supabase.from('group_members').insert(groupMemberships as never);
      }

      return NextResponse.json({ success: true, message: 'User added to company' });
    }

    // Create invitation record
    const { error: inviteError } = await supabase
      .from('invitations')
      .insert({
        email,
        company_id: companyId,
        role: role || 'user',
        invited_by: user.id,
        status: 'pending',
        metadata: { full_name: fullName, group_ids: groupIds },
      } as never);

    if (inviteError) {
      // Check if it's a duplicate invitation
      if (inviteError.code === '23505') {
        return NextResponse.json(
          { error: 'An invitation has already been sent to this email' },
          { status: 400 }
        );
      }
      throw inviteError;
    }

    // In a production app, you would send an email here
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully',
    });
  } catch (error) {
    console.error('Error inviting user:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}
