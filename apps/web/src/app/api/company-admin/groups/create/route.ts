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
    const { name, description, companyId, memberIds } = body;

    // Verify the company ID matches
    if (companyId !== profile.company_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create the group
    const { data: group, error: createError } = await supabase
      .from('groups')
      .insert({
        name,
        description,
        company_id: companyId,
      } as never)
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    // Add members to the group
    if (memberIds && memberIds.length > 0 && group) {
      const groupMembers = memberIds.map((userId: string) => ({
        group_id: (group as { id: string }).id,
        user_id: userId,
      }));

      const { error: membersError } = await supabase
        .from('group_members')
        .insert(groupMembers as never);

      if (membersError) {
        // Log but don't fail - group was created successfully
        console.error('Error adding members to group:', membersError);
      }
    }

    return NextResponse.json({
      success: true,
      group,
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    );
  }
}
