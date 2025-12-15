// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { QuizPlayer } from './quiz-player';

type QuestionType = {
  id: string;
  question_type: string;
  question_text: string;
  question_media: any;
  answer_config: any;
  correct_answer: any;
  explanation: string | null;
  feedback_correct: string | null;
  feedback_incorrect: string | null;
  points: number;
  sort_order: number;
};

type QuizType = {
  id: string;
  title: string;
  passing_score: number;
  max_attempts: number;
  module: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
  questions: QuestionType[];
};

export default async function QuizPage({
  params,
}: {
  params: Promise<{ courseId: string; quizId: string }>;
}) {
  const { courseId, quizId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .eq('status', 'active')
    .single();

  if (!enrollment) {
    notFound();
  }

  // Fetch quiz with questions
  const { data: quiz } = await supabase
    .from('quizzes')
    .select(`
      id,
      title,
      passing_score,
      max_attempts,
      module:modules(
        id,
        title,
        course:courses(
          id,
          title
        )
      ),
      questions:quiz_questions(
        id,
        question_type,
        question_text,
        question_media,
        answer_config,
        correct_answer,
        explanation,
        feedback_correct,
        feedback_incorrect,
        points,
        sort_order
      )
    `)
    .eq('id', quizId)
    .single();

  if (!quiz) {
    notFound();
  }

  // Get user's previous attempts
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('attempt_number, score, passed')
    .eq('user_id', user.id)
    .eq('quiz_id', quizId)
    .order('attempt_number', { ascending: false });

  const sortedQuestions = (quiz.questions || []).sort(
    (a, b) => a.sort_order - b.sort_order
  ) as QuestionType[];

  const nextAttemptNumber = attempts && attempts.length > 0
    ? attempts[0].attempt_number + 1
    : 1;

  const canAttempt = !quiz.max_attempts || nextAttemptNumber <= quiz.max_attempts;

  return (
    <QuizPlayer
      quiz={quiz as QuizType}
      questions={sortedQuestions}
      courseId={courseId}
      previousAttempts={attempts || []}
      nextAttemptNumber={nextAttemptNumber}
      canAttempt={canAttempt}
    />
  );
}


