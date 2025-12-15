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

    // Upsert lesson progress
    const { error } = await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        status: 'in_progress',
        first_accessed_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,lesson_id',
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error marking lesson as started:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mark lesson as started' },
      { status: 500 }
    );
  }
}


