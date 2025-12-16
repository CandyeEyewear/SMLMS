'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AICourseBuilderProps {
  categories: { id: string; name: string }[];
}

type Module = {
  title: string;
  description: string;
  lessons: Array<{ title: string; summary: string }>;
  quizTopic: string;
};

type Outline = {
  title: string;
  description: string;
  modules: Module[];
};

export function AICourseBuilder({ categories }: AICourseBuilderProps) {
  const router = useRouter();
  const [step, setStep] = useState<'input' | 'outline' | 'building' | 'complete'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Input form state
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [industry, setIndustry] = useState('');
  const [tone, setTone] = useState<'formal' | 'conversational' | 'technical'>('conversational');
  const [moduleCount, setModuleCount] = useState(4);
  const [lessonsPerModule, setLessonsPerModule] = useState(3);
  const [topicsToCover, setTopicsToCover] = useState('');
  const [topicsToAvoid, setTopicsToAvoid] = useState('');
  const [companyContext, setCompanyContext] = useState('');

  // Generated outline
  const [outline, setOutline] = useState<Outline | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  function safeUuid() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return (crypto as any).randomUUID();
    }
    return `00000000-0000-4000-8000-${Math.random().toString(16).slice(2).padEnd(12, '0').slice(0, 12)}`;
  }

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
    } catch (err: any) {
      setError(err.message || 'Failed to generate course outline');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!outline || !selectedCategory) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError(null);
    setStep('building');

    try {
      // Persist course + outline structure via builder/save
      const modules = (outline.modules || []).map((m, moduleIndex) => {
        const moduleId = safeUuid();
        return {
          id: moduleId,
          title: m.title,
          description: m.description,
          sort_order: moduleIndex,
          lessons: (m.lessons || []).map((l, lessonIndex) => ({
            id: safeUuid(),
            title: l.title,
            description: l.summary,
            sort_order: lessonIndex,
            duration_minutes: null,
            content: {
              blocks: [
                {
                  id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
                  type: 'text',
                  data: {
                    title: l.title,
                    content: l.summary || '',
                  },
                  order: 0,
                },
              ],
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

      // Redirect to preview so the generated structure is immediately visible.
      router.push(`/super-admin/courses/${id}/preview`);
    } catch (err: any) {
      setError(err.message || 'Failed to create course');
      setStep('outline');
      setLoading(false);
    }
  };

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
            Generate a complete course outline using AI. You can edit and refine it before creating the course.
          </p>
        </div>

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
              placeholder="e.g., Customer Service Excellence"
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
                placeholder="e.g., Customer service representatives"
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
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="conversational">Conversational</option>
              <option value="formal">Formal</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Modules
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={moduleCount}
                onChange={(e) => setModuleCount(parseInt(e.target.value) || 4)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lessons per Module
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={lessonsPerModule}
                onChange={(e) => setLessonsPerModule(parseInt(e.target.value) || 3)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topics to Cover (optional)
            </label>
            <textarea
              value={topicsToCover}
              onChange={(e) => setTopicsToCover(e.target.value)}
              placeholder="List specific topics or areas to include..."
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
              placeholder="List topics or areas to exclude..."
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
              placeholder="Any specific company context or requirements..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleGenerateOutline}
              disabled={loading || !topic.trim()}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Outline'}
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

  if (step === 'outline' && outline) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => setStep('input')}
            className="text-primary-500 hover:text-primary-600 mb-4 inline-block"
          >
            ← Back to Edit
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Generated Course Outline</h1>
          <p className="text-gray-600 mt-2">Review and edit the outline, then select a category to create the course.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{outline.title}</h2>
          <p className="text-gray-600 mb-6">{outline.description}</p>

          <div className="space-y-6">
            {outline.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Module {moduleIndex + 1}: {module.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Lessons:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex}>
                        <span className="font-medium">{lesson.title}</span>
                        {lesson.summary && <span className="text-gray-500"> - {lesson.summary}</span>}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">Quiz Topic:</span> {module.quizTopic}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

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
              onClick={handleCreateCourse}
              disabled={loading || !selectedCategory}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating Course...' : 'Create Course'}
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

  return null;
}

