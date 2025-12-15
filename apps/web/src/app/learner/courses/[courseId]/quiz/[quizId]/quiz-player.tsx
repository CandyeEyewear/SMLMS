'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QuestionRenderer } from '@/components/course-player/question-renderer';

interface QuizPlayerProps {
  quiz: {
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
  };
  questions: Array<{
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
  }>;
  courseId: string;
  previousAttempts: Array<{ attempt_number: number; score: number | null; passed: boolean | null }>;
  nextAttemptNumber: number;
  canAttempt: boolean;
}

export function QuizPlayer({
  quiz,
  questions,
  courseId,
  previousAttempts,
  nextAttemptNumber,
  canAttempt,
}: QuizPlayerProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    passed: boolean;
    questionResults: Array<{ correct: boolean; points: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/learner/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          attemptNumber: nextAttemptNumber,
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      setResults(data.results);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!canAttempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow p-8 max-w-md text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Maximum Attempts Reached</h2>
          <p className="text-gray-600 mb-6">
            You have reached the maximum number of attempts ({quiz.max_attempts}) for this quiz.
          </p>
          <Link
            href={`/learner/courses/${courseId}`}
            className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  if (submitted && results) {
    const passed = results.passed;
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className={`bg-white rounded-lg shadow p-8 text-center mb-6 ${
            passed ? 'border-2 border-green-500' : 'border-2 border-red-500'
          }`}>
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {passed ? 'Quiz Passed!' : 'Quiz Not Passed'}
            </h2>
            <p className="text-2xl font-semibold text-gray-700 mb-4">
              Score: {results.score}% (Required: {quiz.passing_score}%)
            </p>
            <p className="text-gray-600 mb-6">
              {passed
                ? 'Congratulations! You have successfully completed this quiz.'
                : `You need ${quiz.passing_score}% to pass. You can retake the quiz if you have attempts remaining.`}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href={`/learner/courses/${courseId}`}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Back to Course
              </Link>
              {!passed && nextAttemptNumber < quiz.max_attempts && (
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setResults(null);
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>

          {/* Question Results */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Question Results</h3>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const result = results.questionResults[index];
                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${
                      result.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900">
                        Question {index + 1}: {question.question_text}
                      </p>
                      <span className={`text-sm font-semibold ${
                        result.correct ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.correct ? '✓ Correct' : '✗ Incorrect'} ({result.points} points)
                      </span>
                    </div>
                    {question.explanation && (
                      <p className="text-sm text-gray-600 mt-2">{question.explanation}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-sm text-gray-600">{quiz.module.course.title}</p>
              <p className="text-sm text-gray-500">Module: {quiz.module.title}</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{quiz.title}</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <p className="text-sm text-gray-500">
                Attempt {nextAttemptNumber} of {quiz.max_attempts || '∞'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-accent-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <QuestionRenderer
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
            showFeedback={false}
          />

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={loading || !answers[currentQuestion.id]}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


