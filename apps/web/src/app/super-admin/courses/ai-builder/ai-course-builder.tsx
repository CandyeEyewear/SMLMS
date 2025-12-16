'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ============================================================================
// TYPES
// ============================================================================

interface AICourseBuilderProps {
  categories: { id: string; name: string }[];
}

type Lesson = {
  title: string;
  summary: string;
};

type Module = {
  title: string;
  description: string;
  lessons: Lesson[];
  quizTopic: string;
};

type Outline = {
  title: string;
  description: string;
  modules: Module[];
};

type ContentBlock = {
  id: string;
  block_type: string;
  content: Record<string, unknown>;
  sort_order: number;
};

type GeneratedLesson = {
  moduleIndex: number;
  lessonIndex: number;
  title: string;
  blocks: ContentBlock[];
  suggestedMedia?: Array<{
    type: string;
    description: string;
    placement: string;
  }>;
  status: 'pending' | 'generating' | 'completed' | 'error';
  error?: string;
};

type QuizQuestion = {
  id: string;
  question_type: string;
  question_text: string;
  answer_config: Record<string, unknown>;
  correct_answer: Record<string, unknown>;
  explanation: string;
  points: number;
};

type GeneratedQuiz = {
  moduleIndex: number;
  moduleTitle: string;
  questions: QuizQuestion[];
  status: 'pending' | 'generating' | 'completed' | 'error';
  error?: string;
};

type Step = 'input' | 'outline' | 'content' | 'review' | 'building';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function safeUuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `00000000-0000-4000-8000-${Math.random().toString(16).slice(2).padEnd(12, '0').slice(0, 12)}`;
}

function generateBlockId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// ============================================================================
// STEP INDICATOR COMPONENT
// ============================================================================

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const steps = [
    { key: 'input', label: 'Course Setup', number: 1 },
    { key: 'outline', label: 'AI Outline', number: 2 },
    { key: 'content', label: 'Content Gen', number: 3 },
    { key: 'review', label: 'Review & Publish', number: 4 },
  ];

  const currentIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = step.key === currentStep || (currentStep === 'building' && step.key === 'review');

          return (
            <div key={step.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-primary-600' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 ${
                    index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// PROGRESS BAR COMPONENT
// ============================================================================

function ProgressBar({ current, total, label }: { current: number; total: number; label: string }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// CONTENT BLOCK PREVIEW COMPONENT
// ============================================================================

function BlockPreview({ block }: { block: ContentBlock }) {
  const { block_type, content } = block;

  const renderContent = () => {
    switch (block_type) {
      case 'text':
        return (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700">{(content as { text?: string }).text || ''}</p>
          </div>
        );

      case 'bullet_list':
        const bulletContent = content as { title?: string; items?: string[] };
        return (
          <div>
            {bulletContent.title && <h4 className="font-medium text-gray-900 mb-2">{bulletContent.title}</h4>}
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {(bulletContent.items || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        );

      case 'numbered_steps':
        const stepsContent = content as { title?: string; steps?: Array<{ title: string; description: string }> };
        return (
          <div>
            {stepsContent.title && <h4 className="font-medium text-gray-900 mb-2">{stepsContent.title}</h4>}
            <ol className="space-y-2">
              {(stepsContent.steps || []).map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-medium text-gray-900">{step.title}</span>
                    {step.description && <p className="text-gray-600 text-sm">{step.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        );

      case 'callout':
        const calloutContent = content as { type?: string; title?: string; text?: string };
        const calloutColors: Record<string, string> = {
          tip: 'bg-green-50 border-green-200 text-green-800',
          warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          note: 'bg-blue-50 border-blue-200 text-blue-800',
          danger: 'bg-red-50 border-red-200 text-red-800',
          info: 'bg-gray-50 border-gray-200 text-gray-800',
        };
        const calloutIcons: Record<string, string> = {
          tip: '💡',
          warning: '⚠️',
          note: '📝',
          danger: '🚨',
          info: 'ℹ️',
        };
        const calloutType = calloutContent.type || 'info';
        return (
          <div className={`p-4 rounded-lg border ${calloutColors[calloutType] || calloutColors.info}`}>
            <div className="flex gap-2">
              <span>{calloutIcons[calloutType] || calloutIcons.info}</span>
              <div>
                {calloutContent.title && <p className="font-medium mb-1">{calloutContent.title}</p>}
                <p className="text-sm">{calloutContent.text || ''}</p>
              </div>
            </div>
          </div>
        );

      case 'accordion':
        const accordionContent = content as { title?: string; sections?: Array<{ title: string; content: string }> };
        return (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {accordionContent.title && (
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">{accordionContent.title}</h4>
              </div>
            )}
            {(accordionContent.sections || []).map((section, i) => (
              <div key={i} className="border-b border-gray-200 last:border-b-0">
                <div className="px-4 py-3 bg-white hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                  <span className="font-medium text-gray-900">{section.title}</span>
                  <span className="text-gray-400">▼</span>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700">{section.content}</div>
              </div>
            ))}
          </div>
        );

      case 'table':
        const tableContent = content as { title?: string; headers?: string[]; rows?: string[][] };
        return (
          <div>
            {tableContent.title && <h4 className="font-medium text-gray-900 mb-2">{tableContent.title}</h4>}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                {tableContent.headers && (
                  <thead className="bg-gray-50">
                    <tr>
                      {tableContent.headers.map((header, i) => (
                        <th key={i} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {(tableContent.rows || []).map((row, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'comparison':
        const compContent = content as {
          title?: string;
          left?: { label: string; items: string[] };
          right?: { label: string; items: string[] };
        };
        return (
          <div>
            {compContent.title && <h4 className="font-medium text-gray-900 mb-3">{compContent.title}</h4>}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h5 className="font-medium text-green-800 mb-2">✓ {compContent.left?.label || 'Do'}</h5>
                <ul className="space-y-1 text-sm text-green-700">
                  {(compContent.left?.items || []).map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h5 className="font-medium text-red-800 mb-2">✗ {compContent.right?.label || "Don't"}</h5>
                <ul className="space-y-1 text-sm text-red-700">
                  {(compContent.right?.items || []).map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500 italic">
            Block type: {block_type}
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
        <span className="px-2 py-1 bg-gray-100 rounded font-mono">{block_type}</span>
      </div>
      {renderContent()}
    </div>
  );
}

// ============================================================================
// MEDIA SUGGESTION COMPONENT
// ============================================================================

function MediaSuggestionCard({ suggestion }: { suggestion: { type: string; description: string; placement: string } }) {
  return (
    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          {suggestion.type === 'image' && <span className="text-lg">🖼️</span>}
          {suggestion.type === 'video' && <span className="text-lg">🎬</span>}
          {suggestion.type === 'diagram' && <span className="text-lg">📊</span>}
          {!['image', 'video', 'diagram'].includes(suggestion.type) && <span className="text-lg">📎</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-purple-700 uppercase">{suggestion.type} Suggestion</span>
            <span className="text-xs text-purple-500">{suggestion.placement}</span>
          </div>
          <p className="text-sm text-gray-700">{suggestion.description}</p>
        </div>
        <button className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
          Generate Image
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// QUIZ QUESTION PREVIEW COMPONENT
// ============================================================================

function QuestionPreview({ question, index }: { question: QuizQuestion; index: number }) {
  const { question_type, question_text, answer_config, correct_answer, explanation } = question;

  const renderAnswerOptions = () => {
    switch (question_type) {
      case 'multiple_choice':
      case 'multiple_select':
        const options = (answer_config as { options?: Array<{ id: string; text: string }> }).options || [];
        const selected = question_type === 'multiple_choice'
          ? [(correct_answer as { selected?: string }).selected]
          : (correct_answer as { selected?: string[] }).selected || [];
        return (
          <div className="space-y-2">
            {options.map((opt) => (
              <div
                key={opt.id}
                className={`flex items-center gap-2 p-2 rounded ${
                  selected.includes(opt.id) ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                }`}
              >
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                  selected.includes(opt.id) ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'
                }`}>
                  {selected.includes(opt.id) ? '✓' : ''}
                </span>
                <span className="text-sm">{opt.text}</span>
              </div>
            ))}
          </div>
        );

      case 'true_false':
        const tfAnswer = (correct_answer as { selected?: boolean }).selected;
        return (
          <div className="flex gap-4">
            <span className={`px-4 py-2 rounded ${tfAnswer === true ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
              True {tfAnswer === true && '✓'}
            </span>
            <span className={`px-4 py-2 rounded ${tfAnswer === false ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
              False {tfAnswer === false && '✓'}
            </span>
          </div>
        );

      case 'fill_blank':
        const blanks = (answer_config as { blanks?: Array<{ id: string; accepted_answers: string[] }> }).blanks || [];
        return (
          <div className="space-y-2">
            {blanks.map((blank) => (
              <div key={blank.id} className="text-sm">
                <span className="text-gray-500">Accepted answers: </span>
                <span className="text-green-600 font-medium">{blank.accepted_answers.join(', ')}</span>
              </div>
            ))}
          </div>
        );

      case 'short_answer':
        return (
          <div className="text-sm text-gray-500 italic">
            Free text response - manually graded
          </div>
        );

      default:
        return <div className="text-sm text-gray-500">Answer type: {question_type}</div>;
    }
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
          Q{index + 1} • {question_type.replace('_', ' ')}
        </span>
        <span className="text-xs text-gray-500">{question.points} pt{question.points !== 1 ? 's' : ''}</span>
      </div>
      <p className="font-medium text-gray-900 mb-3">{question_text}</p>
      {renderAnswerOptions()}
      {explanation && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <span className="font-medium">Explanation:</span> {explanation}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AICourseBuilder({ categories }: AICourseBuilderProps) {
  const router = useRouter();

  // Step management
  const [step, setStep] = useState<Step>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Input form state
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [industry, setIndustry] = useState('');
  const [tone, setTone] = useState<'formal' | 'conversational' | 'technical'>('conversational');
  const [moduleCount, setModuleCount] = useState(4);
  const [lessonsPerModule, setLessonsPerModule] = useState(3);
  const [topicsToCover, setTopicsToCover] = useState('');
  const [topicsToAvoid, setTopicsToAvoid] = useState('');
  const [companyContext, setCompanyContext] = useState('');
  const [includeQuizzes, setIncludeQuizzes] = useState(true);

  // Step 2: Generated outline
  const [outline, setOutline] = useState<Outline | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Step 3: Generated content
  const [generatedLessons, setGeneratedLessons] = useState<GeneratedLesson[]>([]);
  const [generatedQuizzes, setGeneratedQuizzes] = useState<GeneratedQuiz[]>([]);
  const [contentGenerationStatus, setContentGenerationStatus] = useState<'idle' | 'generating' | 'completed'>('idle');
  const [currentGeneratingItem, setCurrentGeneratingItem] = useState<string>('');

  // Step 4: Review state
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  // ============================================================================
  // STEP 1: Generate Outline
  // ============================================================================

  const handleGenerateOutline = async () => {
    if (!topic.trim()) {
      setError('Please enter a course topic');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/super-admin/courses/ai/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          targetAudience: targetAudience || undefined,
          industry: industry || undefined,
          tone,
          moduleCount,
          lessonsPerModule,
          topicsToCover: topicsToCover || undefined,
          topicsToAvoid: topicsToAvoid || undefined,
          companyContext: companyContext || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate outline');
      }

      const data = await response.json();
      setOutline(data.outline);
      setStep('outline');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate course outline';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // STEP 2: Proceed to Content Generation
  // ============================================================================

  const handleProceedToContent = () => {
    if (!outline || !selectedCategory) {
      setError('Please select a category');
      return;
    }

    // Initialize lesson and quiz structures
    const lessons: GeneratedLesson[] = [];
    outline.modules.forEach((module, moduleIndex) => {
      module.lessons.forEach((lesson, lessonIndex) => {
        lessons.push({
          moduleIndex,
          lessonIndex,
          title: lesson.title,
          blocks: [],
          status: 'pending',
        });
      });
    });

    const quizzes: GeneratedQuiz[] = outline.modules.map((module, moduleIndex) => ({
      moduleIndex,
      moduleTitle: module.title,
      questions: [],
      status: 'pending',
    }));

    setGeneratedLessons(lessons);
    setGeneratedQuizzes(quizzes);
    setStep('content');

    // Start content generation
    generateAllContent(lessons, quizzes);
  };

  // ============================================================================
  // STEP 3: Content Generation
  // ============================================================================

  const generateAllContent = async (lessons: GeneratedLesson[], quizzes: GeneratedQuiz[]) => {
    if (!outline) return;

    setContentGenerationStatus('generating');

    // Generate lessons sequentially
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const module = outline.modules[lesson.moduleIndex];
      const lessonData = module.lessons[lesson.lessonIndex];

      setCurrentGeneratingItem(`Lesson: ${lessonData.title}`);

      // Update status to generating
      setGeneratedLessons(prev => prev.map((l, idx) =>
        idx === i ? { ...l, status: 'generating' } : l
      ));

      try {
        const response = await fetch('/api/super-admin/courses/ai/generate-lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseTitle: outline.title,
            moduleTitle: module.title,
            lessonTitle: lessonData.title,
            lessonSummary: lessonData.summary,
            targetAudience,
            tone,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate lesson content');
        }

        const data = await response.json();
        const blocks: ContentBlock[] = (data.lessonContent?.blocks || []).map((block: { block_type: string; content: Record<string, unknown> }, idx: number) => ({
          id: generateBlockId(),
          block_type: block.block_type,
          content: block.content,
          sort_order: idx,
        }));

        setGeneratedLessons(prev => prev.map((l, idx) =>
          idx === i ? {
            ...l,
            blocks,
            suggestedMedia: data.lessonContent?.suggested_media,
            status: 'completed'
          } : l
        ));
      } catch (err) {
        setGeneratedLessons(prev => prev.map((l, idx) =>
          idx === i ? { ...l, status: 'error', error: 'Failed to generate' } : l
        ));
      }
    }

    // Generate quizzes if enabled
    if (includeQuizzes) {
      for (let i = 0; i < quizzes.length; i++) {
        const quiz = quizzes[i];
        const module = outline.modules[quiz.moduleIndex];

        setCurrentGeneratingItem(`Quiz: ${module.title}`);

        setGeneratedQuizzes(prev => prev.map((q, idx) =>
          idx === i ? { ...q, status: 'generating' } : q
        ));

        try {
          const topics = module.lessons.map(l => l.title);
          const response = await fetch('/api/super-admin/courses/ai/generate-quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              moduleTitle: module.title,
              topics,
              questionCount: 5,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to generate quiz');
          }

          const data = await response.json();
          const questions: QuizQuestion[] = (data.quiz?.questions || []).map((q: Omit<QuizQuestion, 'id'>) => ({
            ...q,
            id: safeUuid(),
          }));

          setGeneratedQuizzes(prev => prev.map((q, idx) =>
            idx === i ? { ...q, questions, status: 'completed' } : q
          ));
        } catch (err) {
          setGeneratedQuizzes(prev => prev.map((q, idx) =>
            idx === i ? { ...q, status: 'error', error: 'Failed to generate' } : q
          ));
        }
      }
    }

    setContentGenerationStatus('completed');
    setCurrentGeneratingItem('');
  };

  // Regenerate a single lesson
  const regenerateLesson = async (lessonIndex: number) => {
    if (!outline) return;

    const lesson = generatedLessons[lessonIndex];
    const module = outline.modules[lesson.moduleIndex];
    const lessonData = module.lessons[lesson.lessonIndex];

    setGeneratedLessons(prev => prev.map((l, idx) =>
      idx === lessonIndex ? { ...l, status: 'generating' } : l
    ));

    try {
      const response = await fetch('/api/super-admin/courses/ai/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: outline.title,
          moduleTitle: module.title,
          lessonTitle: lessonData.title,
          lessonSummary: lessonData.summary,
          targetAudience,
          tone,
        }),
      });

      if (!response.ok) throw new Error('Failed to regenerate');

      const data = await response.json();
      const blocks: ContentBlock[] = (data.lessonContent?.blocks || []).map((block: { block_type: string; content: Record<string, unknown> }, idx: number) => ({
        id: generateBlockId(),
        block_type: block.block_type,
        content: block.content,
        sort_order: idx,
      }));

      setGeneratedLessons(prev => prev.map((l, idx) =>
        idx === lessonIndex ? { ...l, blocks, suggestedMedia: data.lessonContent?.suggested_media, status: 'completed' } : l
      ));
    } catch (err) {
      setGeneratedLessons(prev => prev.map((l, idx) =>
        idx === lessonIndex ? { ...l, status: 'error', error: 'Failed to regenerate' } : l
      ));
    }
  };

  // Regenerate a single quiz
  const regenerateQuiz = async (quizIndex: number) => {
    if (!outline) return;

    const module = outline.modules[quizIndex];

    setGeneratedQuizzes(prev => prev.map((q, idx) =>
      idx === quizIndex ? { ...q, status: 'generating' } : q
    ));

    try {
      const topics = module.lessons.map(l => l.title);
      const response = await fetch('/api/super-admin/courses/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleTitle: module.title,
          topics,
          questionCount: 5,
        }),
      });

      if (!response.ok) throw new Error('Failed to regenerate quiz');

      const data = await response.json();
      const questions: QuizQuestion[] = (data.quiz?.questions || []).map((q: Omit<QuizQuestion, 'id'>) => ({
        ...q,
        id: safeUuid(),
      }));

      setGeneratedQuizzes(prev => prev.map((q, idx) =>
        idx === quizIndex ? { ...q, questions, status: 'completed' } : q
      ));
    } catch (err) {
      setGeneratedQuizzes(prev => prev.map((q, idx) =>
        idx === quizIndex ? { ...q, status: 'error', error: 'Failed to regenerate' } : q
      ));
    }
  };

  // ============================================================================
  // STEP 4: Create Course
  // ============================================================================

  const handleCreateCourse = async () => {
    if (!outline) return;

    setLoading(true);
    setError(null);
    setStep('building');

    try {
      // Build modules with generated content
      const modules = outline.modules.map((module, moduleIndex) => {
        const moduleId = safeUuid();

        // Get lessons for this module
        const moduleLessons = generatedLessons.filter(l => l.moduleIndex === moduleIndex);

        return {
          id: moduleId,
          title: module.title,
          description: module.description,
          sort_order: moduleIndex,
          lessons: moduleLessons.map((lesson, lessonIndex) => ({
            id: safeUuid(),
            title: lesson.title,
            description: outline.modules[moduleIndex].lessons[lessonIndex]?.summary || '',
            sort_order: lessonIndex,
            duration_minutes: null,
            content: {
              blocks: lesson.blocks.map((block, blockIndex) => ({
                id: block.id,
                type: block.block_type,
                data: block.content,
                order: blockIndex,
              })),
            },
          })),
        };
      });

      const courseResponse = await fetch('/api/super-admin/courses/builder/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: {
            title: outline.title,
            description: outline.description,
            category_id: selectedCategory,
            is_active: true,
            is_featured: false,
            original_prompt: topic,
          },
          modules,
        }),
      });

      if (!courseResponse.ok) {
        const data = await courseResponse.json();
        throw new Error(data.error || 'Failed to create course');
      }

      const { courseId, course } = await courseResponse.json();
      const id = courseId || course?.id;
      if (!id) throw new Error('Course created but no course id returned');

      // TODO: Save quizzes to database (requires quiz API endpoint)

      router.push(`/super-admin/courses/${id}/preview`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create course';
      setError(errorMessage);
      setStep('review');
      setLoading(false);
    }
  };

  // ============================================================================
  // UI TOGGLE HELPERS
  // ============================================================================

  const toggleModule = useCallback((moduleIndex: number) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleIndex)) {
        next.delete(moduleIndex);
      } else {
        next.add(moduleIndex);
      }
      return next;
    });
  }, []);

  const toggleLesson = useCallback((key: string) => {
    setExpandedLessons(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // ============================================================================
  // RENDER: STEP 1 - INPUT
  // ============================================================================

  if (step === 'input') {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/super-admin/courses"
            className="text-primary-500 hover:text-primary-600 mb-4 inline-block"
          >
            ← Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">AI Course Builder</h1>
          <p className="text-gray-600 mt-2">
            Generate a complete course with AI. Describe your topic and let AI create the content.
          </p>
        </div>

        <StepIndicator currentStep={step} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Customer Service Excellence for Retail Staff"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., New retail employees"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Retail, Healthcare"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as 'formal' | 'conversational' | 'technical')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="conversational">Conversational - Friendly and engaging</option>
              <option value="formal">Formal - Professional and structured</option>
              <option value="technical">Technical - Detailed and precise</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Modules
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModuleCount(Math.max(2, moduleCount - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  disabled={loading || moduleCount <= 2}
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-lg">{moduleCount}</span>
                <button
                  type="button"
                  onClick={() => setModuleCount(Math.min(8, moduleCount + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  disabled={loading || moduleCount >= 8}
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lessons per Module
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLessonsPerModule(Math.max(2, lessonsPerModule - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  disabled={loading || lessonsPerModule <= 2}
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-lg">{lessonsPerModule}</span>
                <button
                  type="button"
                  onClick={() => setLessonsPerModule(Math.min(5, lessonsPerModule + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  disabled={loading || lessonsPerModule >= 5}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="includeQuizzes"
              checked={includeQuizzes}
              onChange={(e) => setIncludeQuizzes(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              disabled={loading}
            />
            <label htmlFor="includeQuizzes" className="text-sm font-medium text-gray-700">
              Include quiz at end of each module
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topics to Cover (optional)
            </label>
            <textarea
              value={topicsToCover}
              onChange={(e) => setTopicsToCover(e.target.value)}
              placeholder="List specific topics or skills to include in the course..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topics to Avoid (optional)
            </label>
            <textarea
              value={topicsToAvoid}
              onChange={(e) => setTopicsToAvoid(e.target.value)}
              placeholder="List any topics to exclude from the course..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Context (optional)
            </label>
            <textarea
              value={companyContext}
              onChange={(e) => setCompanyContext(e.target.value)}
              placeholder="Any company-specific context, policies, or terminology to include..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleGenerateOutline}
              disabled={loading || !topic.trim()}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating Outline...
                </>
              ) : (
                <>Generate Outline →</>
              )}
            </button>
            <Link
              href="/super-admin/courses"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: STEP 2 - OUTLINE REVIEW
  // ============================================================================

  if (step === 'outline' && outline) {
    const totalLessons = outline.modules.reduce((sum, m) => sum + m.lessons.length, 0);

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => setStep('input')}
            className="text-primary-500 hover:text-primary-600 mb-4 inline-block"
          >
            ← Back to Edit
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Review Course Outline</h1>
          <p className="text-gray-600 mt-2">
            Review the AI-generated outline. Select a category, then proceed to generate content.
          </p>
        </div>

        <StepIndicator currentStep={step} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Course Overview Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{outline.title}</h2>
          <p className="text-gray-600 mb-4">{outline.description}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
              <span className="text-gray-500">Modules:</span>
              <span className="font-semibold text-gray-900">{outline.modules.length}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
              <span className="text-gray-500">Lessons:</span>
              <span className="font-semibold text-gray-900">{totalLessons}</span>
            </div>
            {includeQuizzes && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <span className="text-gray-500">Quizzes:</span>
                <span className="font-semibold text-gray-900">{outline.modules.length}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4 mb-6">
          {outline.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Module {moduleIndex + 1}: {module.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{module.description}</p>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Lessons:</p>
                <ul className="space-y-2">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <li key={lessonIndex} className="flex items-start gap-2 text-sm">
                      <span className="text-gray-400 font-mono">{moduleIndex + 1}.{lessonIndex + 1}</span>
                      <div>
                        <span className="font-medium text-gray-900">{lesson.title}</span>
                        {lesson.summary && (
                          <p className="text-gray-500 text-xs mt-0.5">{lesson.summary}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {includeQuizzes && module.quizTopic && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Quiz:</span> {module.quizTopic}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Category Selection & Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Category <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
            disabled={loading}
          >
            <option value="">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="flex gap-4">
            <button
              onClick={handleProceedToContent}
              disabled={loading || !selectedCategory}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Generate Content →
            </button>
            <button
              onClick={handleGenerateOutline}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              🔄 Regenerate Outline
            </button>
            <button
              onClick={() => setStep('input')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Edit Input
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: STEP 3 - CONTENT GENERATION
  // ============================================================================

  if (step === 'content' && outline) {
    const completedLessons = generatedLessons.filter(l => l.status === 'completed').length;
    const completedQuizzes = generatedQuizzes.filter(q => q.status === 'completed').length;
    const totalItems = generatedLessons.length + (includeQuizzes ? generatedQuizzes.length : 0);
    const completedItems = completedLessons + (includeQuizzes ? completedQuizzes : 0);

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generating Course Content</h1>
          <p className="text-gray-600 mt-2">
            AI is generating detailed content for each lesson and quiz. This may take a few minutes.
          </p>
        </div>

        <StepIndicator currentStep={step} />

        {/* Overall Progress */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <ProgressBar
              current={completedItems}
              total={totalItems}
              label="Overall Progress"
            />
          </div>

          {currentGeneratingItem && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="animate-spin">⏳</span>
              <span>Currently generating: {currentGeneratingItem}</span>
            </div>
          )}
        </div>

        {/* Generation Status by Module */}
        <div className="space-y-4 mb-6">
          {outline.modules.map((module, moduleIndex) => {
            const moduleLessons = generatedLessons.filter(l => l.moduleIndex === moduleIndex);
            const moduleQuiz = generatedQuizzes[moduleIndex];
            const allComplete = moduleLessons.every(l => l.status === 'completed') &&
                               (!includeQuizzes || moduleQuiz?.status === 'completed');

            return (
              <div key={moduleIndex} className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      allComplete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {allComplete ? '✓' : moduleIndex + 1}
                    </span>
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {moduleLessons.map((lesson, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{lesson.title}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        lesson.status === 'completed' ? 'bg-green-100 text-green-700' :
                        lesson.status === 'generating' ? 'bg-blue-100 text-blue-700' :
                        lesson.status === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {lesson.status === 'generating' && '⏳ '}
                        {lesson.status === 'completed' && '✓ '}
                        {lesson.status === 'error' && '✗ '}
                        {lesson.status}
                      </span>
                    </div>
                  ))}
                  {includeQuizzes && moduleQuiz && (
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                      <span className="text-gray-700">Module Quiz</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        moduleQuiz.status === 'completed' ? 'bg-green-100 text-green-700' :
                        moduleQuiz.status === 'generating' ? 'bg-blue-100 text-blue-700' :
                        moduleQuiz.status === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {moduleQuiz.status === 'generating' && '⏳ '}
                        {moduleQuiz.status === 'completed' && '✓ '}
                        {moduleQuiz.status === 'error' && '✗ '}
                        {moduleQuiz.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          {contentGenerationStatus === 'completed' && (
            <button
              onClick={() => setStep('review')}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Review Content →
            </button>
          )}
          {contentGenerationStatus === 'generating' && (
            <button
              onClick={() => setStep('review')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Review Completed Content
            </button>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: STEP 4 - REVIEW & PUBLISH
  // ============================================================================

  if (step === 'review' && outline) {
    const completedLessons = generatedLessons.filter(l => l.status === 'completed').length;
    const completedQuizzes = generatedQuizzes.filter(q => q.status === 'completed').length;
    const totalBlocks = generatedLessons.reduce((sum, l) => sum + l.blocks.length, 0);
    const totalQuestions = generatedQuizzes.reduce((sum, q) => sum + q.questions.length, 0);

    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => setStep('content')}
            className="text-primary-500 hover:text-primary-600 mb-4 inline-block"
          >
            ← Back to Generation
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Review & Publish</h1>
          <p className="text-gray-600 mt-2">
            Review all generated content. You can regenerate individual lessons or quizzes if needed.
          </p>
        </div>

        <StepIndicator currentStep={step} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Course Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{outline.title}</h2>
          <p className="text-gray-600 mb-4">{outline.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{outline.modules.length}</p>
              <p className="text-sm text-gray-500">Modules</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{completedLessons}</p>
              <p className="text-sm text-gray-500">Lessons</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{totalBlocks}</p>
              <p className="text-sm text-gray-500">Content Blocks</p>
            </div>
            {includeQuizzes && (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                <p className="text-sm text-gray-500">Quiz Questions</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Review by Module */}
        <div className="space-y-4 mb-6">
          {outline.modules.map((module, moduleIndex) => {
            const moduleLessons = generatedLessons.filter(l => l.moduleIndex === moduleIndex);
            const moduleQuiz = generatedQuizzes[moduleIndex];
            const isExpanded = expandedModules.has(moduleIndex);

            return (
              <div key={moduleIndex} className="bg-white rounded-lg shadow border border-gray-200">
                <button
                  onClick={() => toggleModule(moduleIndex)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-medium">
                      {moduleIndex + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-500">
                        {moduleLessons.length} lessons • {moduleLessons.reduce((sum, l) => sum + l.blocks.length, 0)} blocks
                        {includeQuizzes && moduleQuiz && ` • ${moduleQuiz.questions.length} questions`}
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400 text-xl">{isExpanded ? '−' : '+'}</span>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200">
                    {/* Lessons */}
                    {moduleLessons.map((lesson, lessonIdx) => {
                      const lessonKey = `${moduleIndex}-${lessonIdx}`;
                      const isLessonExpanded = expandedLessons.has(lessonKey);
                      const globalLessonIndex = generatedLessons.findIndex(
                        l => l.moduleIndex === moduleIndex && l.lessonIndex === lesson.lessonIndex
                      );

                      return (
                        <div key={lessonIdx} className="border-b border-gray-100 last:border-b-0">
                          <button
                            onClick={() => toggleLesson(lessonKey)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                                lesson.status === 'completed' ? 'bg-green-100 text-green-700' :
                                lesson.status === 'error' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-500'
                              }`}>
                                {lesson.status === 'completed' ? '✓' : lesson.status === 'error' ? '!' : '○'}
                              </span>
                              <span className="font-medium text-gray-800">{lesson.title}</span>
                              <span className="text-sm text-gray-400">({lesson.blocks.length} blocks)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  regenerateLesson(globalLessonIndex);
                                }}
                                disabled={lesson.status === 'generating'}
                                className="px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded"
                              >
                                🔄 Regenerate
                              </button>
                              <span className="text-gray-400">{isLessonExpanded ? '▲' : '▼'}</span>
                            </div>
                          </button>

                          {isLessonExpanded && (
                            <div className="px-4 py-4 bg-gray-50 space-y-3">
                              {lesson.blocks.length > 0 ? (
                                lesson.blocks.map((block, blockIdx) => (
                                  <BlockPreview key={block.id || blockIdx} block={block} />
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 italic">No content generated yet</p>
                              )}

                              {/* Media Suggestions */}
                              {lesson.suggestedMedia && lesson.suggestedMedia.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <span>🎨</span>
                                    AI-Suggested Media ({lesson.suggestedMedia.length})
                                  </h5>
                                  <div className="space-y-2">
                                    {lesson.suggestedMedia.map((suggestion, sugIdx) => (
                                      <MediaSuggestionCard key={sugIdx} suggestion={suggestion} />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Quiz */}
                    {includeQuizzes && moduleQuiz && (
                      <div className="border-t border-gray-200">
                        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">📝</span>
                            <span className="font-medium text-gray-800">Module Quiz</span>
                            <span className="text-sm text-gray-400">({moduleQuiz.questions.length} questions)</span>
                          </div>
                          <button
                            onClick={() => regenerateQuiz(moduleIndex)}
                            disabled={moduleQuiz.status === 'generating'}
                            className="px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded"
                          >
                            🔄 Regenerate Quiz
                          </button>
                        </div>
                        <div className="px-4 py-4 space-y-3">
                          {moduleQuiz.questions.length > 0 ? (
                            moduleQuiz.questions.map((question, qIdx) => (
                              <QuestionPreview key={question.id} question={question} index={qIdx} />
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 italic">No quiz questions generated yet</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              {completedLessons === generatedLessons.length ? (
                <span className="text-green-600 font-medium">✓ All content generated successfully</span>
              ) : (
                <span className="text-yellow-600 font-medium">
                  ⚠️ {generatedLessons.length - completedLessons} lessons still pending
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep('outline')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Outline
            </button>
            <button
              onClick={handleCreateCourse}
              disabled={loading || completedLessons === 0}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Creating Course...
                </>
              ) : (
                <>Create Course</>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: BUILDING STATE
  // ============================================================================

  if (step === 'building') {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <StepIndicator currentStep={step} />
        <div className="bg-white rounded-lg shadow p-8">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Creating Your Course</h2>
          <p className="text-gray-600">
            Saving all content to the database. Please wait...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
