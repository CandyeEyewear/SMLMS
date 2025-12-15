// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { LessonPlayer } from './lesson-player';

type LessonBlockType = {
  id: string;
  block_type: string;
  content: any;
  sort_order: number;
};

type LessonType = {
  id: string;
  title: string;
  module: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
  blocks: LessonBlockType[];
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
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

  // Fetch lesson with blocks
  const { data: lesson } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      module:modules(
        id,
        title,
        course:courses(
          id,
          title
        )
      ),
      blocks:lesson_blocks(
        id,
        block_type,
        content,
        sort_order
      )
    `)
    .eq('id', lessonId)
    .single();

  if (!lesson) {
    notFound();
  }

  // Fetch all lessons in module for navigation
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, title, sort_order')
    .eq('module_id', lesson.module.id)
    .order('sort_order');

  const currentIndex = allLessons?.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && allLessons && currentIndex < allLessons.length - 1
    ? allLessons[currentIndex + 1]
    : null;

  // Fetch module quiz for next button
  const { data: moduleQuiz } = await supabase
    .from('quizzes')
    .select('id, title')
    .eq('module_id', lesson.module.id)
    .single();

  const sortedBlocks = (lesson.blocks || []).sort(
    (a, b) => a.sort_order - b.sort_order
  ) as LessonBlockType[];

  return (
    <LessonPlayer
      lesson={lesson as LessonType}
      blocks={sortedBlocks}
      courseId={courseId}
      moduleId={lesson.module.id}
      prevLesson={prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null}
      nextLesson={nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null}
      moduleQuiz={moduleQuiz ? { id: moduleQuiz.id, title: moduleQuiz.title } : null}
    />
  );
}


