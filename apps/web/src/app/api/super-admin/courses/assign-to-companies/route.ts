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
    const { courseId, companyIds, action } = body;

    if (!courseId || !Array.isArray(companyIds)) {
      return NextResponse.json(
        { error: 'Course ID and company IDs array are required' },
        { status: 400 }
      );
    }

    if (action !== 'assign' && action !== 'unassign') {
      return NextResponse.json(
        { error: 'Action must be either "assign" or "unassign"' },
        { status: 400 }
      );
    }

    // Verify course exists
    const { data: course } = await supabase
      .from('courses')
      .select('id, title')
      .eq('id', courseId)
      .single();

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Verify all companies exist
    const { data: companies } = await supabase
      .from('companies')
      .select('id, name')
      .in('id', companyIds);

    if (!companies || companies.length !== companyIds.length) {
      return NextResponse.json(
        { error: 'One or more companies not found' },
        { status: 404 }
      );
    }

    if (action === 'assign') {
      // Check existing assignments to avoid duplicates
      const { data: existingAssignments } = await supabase
        .from('company_courses')
        .select('company_id')
        .eq('course_id', courseId)
        .in('company_id', companyIds);

      const existingCompanyIds = new Set(
        (existingAssignments || []).map((a) => a.company_id)
      );
      const newCompanyIds = companyIds.filter(
        (id: string) => !existingCompanyIds.has(id)
      );

      if (newCompanyIds.length === 0) {
        return NextResponse.json(
          { error: 'All selected companies already have this course assigned' },
          { status: 400 }
        );
      }

      // Create new assignments
      const assignments = newCompanyIds.map((companyId: string) => ({
        course_id: courseId,
        company_id: companyId,
        is_mandatory: false,
      }));

      const { error: insertError } = await supabase
        .from('company_courses')
        .insert(assignments);

      if (insertError) {
        console.error('Error assigning courses to companies:', insertError);
        throw insertError;
      }

      const skipped = companyIds.length - newCompanyIds.length;
      let message = `Successfully assigned course to ${newCompanyIds.length} company${newCompanyIds.length !== 1 ? 'ies' : ''}`;
      if (skipped > 0) {
        message += ` (${skipped} already assigned)`;
      }

      return NextResponse.json({
        success: true,
        message,
        assigned: newCompanyIds.length,
        skipped,
      });
    } else {
      // Unassign: Remove assignments
      const { error: deleteError } = await supabase
        .from('company_courses')
        .delete()
        .eq('course_id', courseId)
        .in('company_id', companyIds);

      if (deleteError) {
        console.error('Error unassigning courses from companies:', deleteError);
        throw deleteError;
      }

      return NextResponse.json({
        success: true,
        message: `Successfully unassigned course from ${companyIds.length} company${companyIds.length !== 1 ? 'ies' : ''}`,
        unassigned: companyIds.length,
      });
    }
  } catch (error) {
    console.error('Error managing course-to-company assignments:', error);
    return NextResponse.json(
      { error: 'Failed to manage course assignments' },
      { status: 500 }
    );
  }
}

