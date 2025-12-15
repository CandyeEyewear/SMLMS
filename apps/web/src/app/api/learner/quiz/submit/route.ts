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
    const { quizId, attemptNumber, answers } = body;

    if (!quizId || !attemptNumber || !answers) {
      return NextResponse.json(
        { error: 'Quiz ID, attempt number, and answers are required' },
        { status: 400 }
      );
    }

    // Fetch quiz with questions
    const { data: quiz } = await supabase
      .from('quizzes')
      .select(`
        id,
        passing_score,
        questions:quiz_questions(
          id,
          correct_answer,
          points
        )
      `)
      .eq('id', quizId)
      .single();

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Calculate score
    const questions = quiz.questions || [];
    let totalPoints = 0;
    let earnedPoints = 0;
    const questionResults: Array<{ correct: boolean; points: number }> = [];

    questions.forEach((question: any) => {
      totalPoints += question.points || 1;
      const userAnswer = answers[question.id];
      const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correct_answer);
      
      if (isCorrect) {
        earnedPoints += question.points || 1;
      }
      
      questionResults.push({
        correct: isCorrect,
        points: isCorrect ? (question.points || 1) : 0,
      });
    });

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= (quiz.passing_score || 70);

    // Save attempt
    const { error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        quiz_id: quizId,
        attempt_number: attemptNumber,
        score,
        passed,
        answers,
        completed_at: new Date().toISOString(),
      });

    if (attemptError) {
      throw attemptError;
    }

    return NextResponse.json({
      success: true,
      results: {
        score,
        passed,
        questionResults,
      },
    });
  } catch (error: any) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}


