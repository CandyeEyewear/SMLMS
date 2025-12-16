'use client';

import { useMemo, useState } from 'react';
import { ContentBlockType } from './course-builder';

interface ContentSidebarProps {
  onAddBlock: (type: ContentBlockType['type'], data?: any) => void;
  modules: {
    id: string;
    title: string;
    lessons: { id: string; title: string }[];
  }[];
  selectedLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
  onRenameModule: (moduleId: string, title: string) => void;
  onRenameLesson: (lessonId: string, title: string) => void;
  onDeleteModule: (moduleId: string) => void;
  onDeleteLesson: (lessonId: string) => void;
}

const contentTypes = [
  {
    type: 'video' as const,
    label: 'Video',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Embed videos from YouTube, Vimeo, or other sources',
  },
  {
    type: 'image' as const,
    label: 'Image',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Add images with captions',
  },
  {
    type: 'text' as const,
    label: 'Text',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
    description: 'Rich text content and descriptions',
  },
  {
    type: 'quiz' as const,
    label: 'Quiz',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    description: 'Interactive quizzes and assessments',
  },
  {
    type: 'file' as const,
    label: 'File',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    description: 'PDFs, documents, and downloadable files',
  },
  {
    type: 'embed' as const,
    label: 'Embed',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Custom HTML embeds and iframes',
  },
];

export function ContentSidebar({
  onAddBlock,
  modules,
  selectedLessonId,
  onSelectLesson,
  onAddModule,
  onAddLesson,
  onRenameModule,
  onRenameLesson,
  onDeleteModule,
  onDeleteLesson,
}: ContentSidebarProps) {

  const [tab, setTab] = useState<'structure' | 'blocks'>('structure');

  const lessonCount = useMemo(
    () => modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0),
    [modules]
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Course Builder</h2>
          <span className="text-xs text-gray-500">{lessonCount} lesson{lessonCount === 1 ? '' : 's'}</span>
        </div>

        <div className="mt-3 flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setTab('structure')}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === 'structure' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Structure
          </button>
          <button
            type="button"
            onClick={() => setTab('blocks')}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === 'blocks' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Blocks
          </button>
        </div>
      </div>

      {tab === 'structure' ? (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Modules & lessons</p>
            <button
              type="button"
              onClick={onAddModule}
              className="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              + Module
            </button>
          </div>

          <div className="space-y-3">
            {modules.length === 0 ? (
              <div className="text-xs text-gray-500">
                Add a module to start building your course structure.
              </div>
            ) : (
              modules.map((m, moduleIndex) => (
                <div key={m.id} className="rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-t-lg">
                    <button
                      type="button"
                      onClick={() => {
                        const nextTitle = window.prompt('Module title', m.title);
                        if (nextTitle && nextTitle.trim()) onRenameModule(m.id, nextTitle.trim());
                      }}
                      className="text-xs font-semibold text-gray-900 truncate text-left"
                      title="Rename module"
                    >
                      {m.title || `Module ${moduleIndex + 1}`}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onAddLesson(m.id)}
                        className="text-xs text-primary-600 hover:text-primary-700"
                        title="Add lesson"
                      >
                        + Lesson
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteModule(m.id)}
                        className="text-xs text-gray-400 hover:text-red-600"
                        title="Delete module"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    {m.lessons.length === 0 ? (
                      <div className="px-2 py-2 text-xs text-gray-500">No lessons yet.</div>
                    ) : (
                      m.lessons.map((l, lessonIndex) => (
                        <div key={l.id} className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onSelectLesson(l.id)}
                            className={`flex-1 px-2 py-2 rounded-md text-left text-xs transition-colors ${
                              selectedLessonId === l.id
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                            title="Select lesson"
                          >
                            {l.title || `Lesson ${lessonIndex + 1}`}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const nextTitle = window.prompt('Lesson title', l.title);
                              if (nextTitle && nextTitle.trim()) onRenameLesson(l.id, nextTitle.trim());
                            }}
                            className="text-xs text-gray-400 hover:text-gray-600"
                            title="Rename lesson"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteLesson(l.id)}
                            className="text-xs text-gray-400 hover:text-red-600"
                            title="Delete lesson"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-2">
          <p className="text-xs text-gray-500 mb-2">Drag or click to add</p>
          {contentTypes.map((contentType) => (
            <button
              key={contentType.type}
              onClick={() => onAddBlock(contentType.type)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="text-primary-500 group-hover:text-primary-600 mt-0.5">
                  {contentType.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                    {contentType.label}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{contentType.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

