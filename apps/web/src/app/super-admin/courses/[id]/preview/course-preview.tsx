'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ContentBlock } from '../../new/builder/content-block';

type Block = {
  id: string;
  type: string;
  data: any;
  order: number;
};

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  content: { blocks?: Block[] } | null;
};

type Module = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number | null;
  lessons: Lesson[];
};

export function CoursePreview({
  courseId,
  courseTitle,
  modules,
}: {
  courseId: string;
  courseTitle: string;
  modules: Module[];
}) {
  const modulesSorted = useMemo(
    () => [...modules].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [modules]
  );

  const firstLessonId = useMemo(() => {
    for (const m of modulesSorted) {
      const ls = [...(m.lessons || [])].sort((a, b) => (a as any).sort_order - (b as any).sort_order);
      if (ls[0]) return ls[0].id;
    }
    return null;
  }, [modulesSorted]);

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(firstLessonId);

  const selected = useMemo(() => {
    for (const m of modulesSorted) {
      const l = (m.lessons || []).find((x) => x.id === selectedLessonId);
      if (l) return { module: m, lesson: l };
    }
    return null;
  }, [modulesSorted, selectedLessonId]);

  const blocks: Block[] = useMemo(() => {
    const raw = selected?.lesson.content?.blocks || [];
    return [...raw].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [selected]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Preview</p>
            <h1 className="text-lg font-semibold text-gray-900 truncate">{courseTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/super-admin/courses/${courseId}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back to course
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Modules</h2>
              <p className="text-xs text-gray-500 mt-0.5">Select a lesson to preview</p>
            </div>

            <div className="p-3 space-y-3">
              {modulesSorted.length === 0 ? (
                <p className="text-sm text-gray-500">No modules yet.</p>
              ) : (
                modulesSorted.map((m, mi) => (
                  <div key={m.id} className="rounded-lg border border-gray-200">
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-900 truncate">{m.title || `Module ${mi + 1}`}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      {(m.lessons || []).length === 0 ? (
                        <p className="px-2 py-2 text-xs text-gray-500">No lessons</p>
                      ) : (
                        (m.lessons || []).map((l, li) => (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() => setSelectedLessonId(l.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedLessonId === l.id
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {l.title || `Lesson ${li + 1}`}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-2 space-y-4">
          {selected ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <p className="text-xs text-gray-500">Lesson</p>
                <h2 className="text-xl font-bold text-gray-900">{selected.lesson.title}</h2>
                {selected.lesson.description && (
                  <p className="text-sm text-gray-600 mt-1">{selected.lesson.description}</p>
                )}
              </div>

              {blocks.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                  No content blocks in this lesson yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {blocks.map((block) => (
                    <div key={block.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <ContentBlock
                        block={block as any}
                        isSelected={false}
                        onSelect={() => {}}
                        onUpdate={() => {}}
                        onDelete={() => {}}
                        onDuplicate={() => {}}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              No lesson selected.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

