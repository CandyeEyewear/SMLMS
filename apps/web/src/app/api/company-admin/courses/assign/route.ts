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
    const { courseId, companyId, assignType, userIds, groupId } = body;

    // Verify the company ID matches
    if (companyId !== profile.company_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if setup fee has been paid
    const { data: company } = await supabase
      .from('companies')
      .select('setup_fee_paid')
      .eq('id', companyId)
      .single();

    if (!company?.setup_fee_paid) {
      return NextResponse.json(
        {
          error: 'Setup fee must be paid before assigning courses',
          requires_setup_fee: true,
        },
        { status: 403 }
      );
    }

    // Verify course is available to this company
    const { data: companyCourse } = await supabase
      .from('company_courses')
      .select('id')
      .eq('company_id', companyId)
      .eq('course_id', courseId)
      .single();

    if (!companyCourse) {
      return NextResponse.json(
        { error: 'Course not available to your company' },
        { status: 403 }
      );
    }

    let targetUserIds: string[] = [];

    if (assignType === 'users') {
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return NextResponse.json(
          { error: 'Please select at least one user' },
          { status: 400 }
        );
      }
      targetUserIds = userIds;
    } else if (assignType === 'group') {
      if (!groupId) {
        return NextResponse.json(
          { error: 'Please select a group' },
          { status: 400 }
        );
      }

      // Verify group belongs to company
      const { data: group } = await supabase
        .from('groups')
        .select('id')
        .eq('id', groupId)
        .eq('company_id', companyId)
        .single();

      if (!group) {
        return NextResponse.json({ error: 'Group not found' }, { status: 404 });
      }

      // Get group members
      const { data: groupMembers } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId);

      targetUserIds = (groupMembers || []).map((m) => (m as { user_id: string }).user_id);

      if (targetUserIds.length === 0) {
        return NextResponse.json(
          { error: 'Selected group has no members' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json({ error: 'Invalid assignment type' }, { status: 400 });
    }

    // Verify all target users belong to the company
    const { data: validUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('company_id', companyId)
      .in('id', targetUserIds);

    const validUserIds = (validUsers || []).map((u) => (u as { id: string }).id);

    if (validUserIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid users found for enrollment' },
        { status: 400 }
      );
    }

    // Check existing enrollments
    const { data: existingEnrollments } = await supabase
      .from('enrollments')
      .select('user_id')
      .eq('course_id', courseId)
      .in('user_id', validUserIds);

    const alreadyEnrolledIds = new Set(
      (existingEnrollments || []).map((e) => (e as { user_id: string }).user_id)
    );
    const newUserIds = validUserIds.filter((id) => !alreadyEnrolledIds.has(id));

    if (newUserIds.length === 0) {
      return NextResponse.json(
        { error: 'All selected users are already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create enrollments
    const enrollments = newUserIds.map((userId) => ({
      user_id: userId,
      course_id: courseId,
      company_id: companyId,
      status: 'not_started',
      progress_percent: 0,
      enrolled_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from('enrollments')
      .insert(enrollments as never);

    if (insertError) {
      console.error('Error creating enrollments:', insertError);
      throw insertError;
    }

    const skipped = validUserIds.length - newUserIds.length;
    let message = `Successfully enrolled ${newUserIds.length} user${newUserIds.length !== 1 ? 's' : ''}`;
    if (skipped > 0) {
      message += ` (${skipped} already enrolled)`;
    }

    return NextResponse.json({
      success: true,
      message,
      enrolled: newUserIds.length,
      skipped,
    });
  } catch (error) {
    console.error('Error assigning course:', error);
    return NextResponse.json(
      { error: 'Failed to assign course' },
      { status: 500 }
    );
  }
}
