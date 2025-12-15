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
    const { lessonId } = body;

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    // Get lesson's module and course
    const { data: lesson } = await supabase
      .from('lessons')
      .select('module_id, module:modules(course_id)')
      .eq('id', lessonId)
      .single();

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const courseId = (lesson.module as any)?.course_id;

    // Mark lesson as completed
    const { error: lessonError } = await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        status: 'completed',
        completed_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,lesson_id',
      });

    if (lessonError) {
      throw lessonError;
    }

    // Update course progress
    if (courseId) {
      // Calculate total progress for the course
      const { data: allLessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', lesson.module_id);

      const { data: completedLessons } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .in('lesson_id', (allLessons || []).map((l) => l.id));

      const totalLessons = allLessons?.length || 1;
      const completedCount = completedLessons?.length || 0;
      const progressPercentage = Math.round((completedCount / totalLessons) * 100);

      // Get existing progress to preserve final_score
      const { data: existingProgress } = await supabase
        .from('user_course_progress')
        .select('final_score')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

      const { error: courseProgressError } = await supabase
        .from('user_course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          progress_percentage: progressPercentage,
          status: progressPercentage === 100 ? 'completed' : 'in_progress',
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null,
          last_accessed_at: new Date().toISOString(),
          // Preserve existing final_score if course not completed
          final_score: progressPercentage === 100 ? existingProgress?.final_score : existingProgress?.final_score,
        }, {
          onConflict: 'user_id,course_id',
        });

      if (courseProgressError) {
        console.error('Error updating course progress:', courseProgressError);
      }

      // Check if course is completed and generate certificate
      if (progressPercentage === 100) {
        // Get user profile for company_id
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();

        if (userProfile?.company_id) {
          // Check if certificate already exists
          const { data: existingCert } = await supabase
            .from('certificates')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .single();

          if (!existingCert) {
            // Generate certificate directly
            try {
              // Generate certificate number and verification code
              const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
              const verificationCode = Math.random().toString(36).substr(2, 12).toUpperCase();

              // Get final score from progress
              const finalScore = existingProgress?.final_score || null;

              // Create certificate
              await supabase
                .from('certificates')
                .insert({
                  user_id: user.id,
                  course_id: courseId,
                  company_id: userProfile.company_id,
                  certificate_number: certificateNumber,
                  verification_code: verificationCode,
                  final_score: finalScore,
                  issued_at: new Date().toISOString(),
                });
            } catch (error) {
              console.error('Error generating certificate automatically:', error);
              // Don't fail the lesson completion if certificate generation fails
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking lesson as completed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mark lesson as completed' },
      { status: 500 }
    );
  }
}


