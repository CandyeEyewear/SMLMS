import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Verify course is completed
    const { data: progress } = await supabase
      .from('user_course_progress')
      .select('status, final_score')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (!progress || progress.status !== 'completed') {
      return NextResponse.json(
        { error: 'Course must be completed to generate certificate' },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const { data: existingCert } = await supabase
      .from('certificates')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (existingCert) {
      return NextResponse.json(
        { error: 'Certificate already exists for this course' },
        { status: 400 }
      );
    }

    // Get course and company info
    const { data: course } = await supabase
      .from('courses')
      .select('id, title, company_id')
      .eq('id', courseId)
      .single();

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get user's company
    const { data: profile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single();

    if (!profile?.company_id) {
      return NextResponse.json({ error: 'User company not found' }, { status: 400 });
    }

    // Generate certificate number and verification code
    const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const verificationCode = Math.random().toString(36).substr(2, 12).toUpperCase();

    // Create certificate
    const { data: certificate, error: certError } = await supabase
      .from('certificates')
      .insert({
        user_id: user.id,
        course_id: courseId,
        company_id: profile.company_id,
        certificate_number: certificateNumber,
        verification_code: verificationCode,
        final_score: progress.final_score,
        issued_at: new Date().toISOString(),
        // PDF generation would happen here via Edge Function or external service
        // pdf_url: await generatePDFCertificate(...)
      })
      .select()
      .single();

    if (certError) {
      throw certError;
    }

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (error: any) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}

