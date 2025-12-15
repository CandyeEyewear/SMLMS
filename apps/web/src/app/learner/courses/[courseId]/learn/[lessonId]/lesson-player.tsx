'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ContentBlockRenderer } from '@/components/course-player/content-block-renderer';

interface LessonPlayerProps {
  lesson: {
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
  };
  blocks: Array<{
    id: string;
    block_type: string;
    content: any;
    sort_order: number;
  }>;
  courseId: string;
  moduleId: string;
  prevLesson: { id: string; title: string } | null;
  nextLesson: { id: string; title: string } | null;
  moduleQuiz: { id: string; title: string } | null;
}

export function LessonPlayer({
  lesson,
  blocks,
  courseId,
  moduleId,
  prevLesson,
  nextLesson,
  moduleQuiz,
}: LessonPlayerProps) {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mark lesson as started
  useEffect(() => {
    const markStarted = async () => {
      try {
        await fetch('/api/learner/progress/lesson-started', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId: lesson.id }),
        });
      } catch (error) {
        console.error('Failed to mark lesson as started:', error);
      }
    };
    markStarted();
  }, [lesson.id]);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/learner/progress/lesson-completed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id }),
      });

      if (response.ok) {
        setCompleted(true);
      }
    } catch (error) {
      console.error('Failed to mark lesson as completed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href={`/learner/courses/${courseId}`}
            className="text-sm text-primary-500 hover:text-primary-600 mb-2 inline-block"
          >
            ← Back to Course
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{lesson.module.course.title}</p>
              <p className="text-sm text-gray-500">Module: {lesson.module.title}</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{lesson.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          {blocks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No content available for this lesson.</p>
            </div>
          ) : (
            blocks.map((block) => (
              <ContentBlockRenderer
                key={block.id}
                blockType={block.block_type}
                content={block.content}
              />
            ))
          )}

          {/* Completion Button */}
          {!completed && blocks.length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleComplete}
                disabled={loading}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Marking as Complete...' : 'Mark as Complete'}
              </button>
            </div>
          )}

          {completed && (
            <div className="pt-6 border-t border-gray-200">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Lesson completed!</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            {prevLesson ? (
              <Link
                href={`/learner/courses/${courseId}/learn/${prevLesson.id}`}
                className="flex items-center gap-2 text-primary-500 hover:text-primary-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Previous: {prevLesson.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </div>

          <div className="flex gap-4">
            {moduleQuiz && (
              <Link
                href={`/learner/courses/${courseId}/quiz/${moduleQuiz.id}`}
                className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors font-medium"
              >
                Take Quiz
              </Link>
            )}
            {nextLesson ? (
              <Link
                href={`/learner/courses/${courseId}/learn/${nextLesson.id}`}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Next: {nextLesson.title} →
              </Link>
            ) : (
              <Link
                href={`/learner/courses/${courseId}`}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Back to Course Overview
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


