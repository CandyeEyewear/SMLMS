'use client';

import { ContentBlockType } from './course-builder';

interface ContentSidebarProps {
  onAddBlock: (type: ContentBlockType['type'], data?: any) => void;
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

export function ContentSidebar({ onAddBlock }: ContentSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Content Blocks</h2>
        <p className="text-xs text-gray-500 mt-1">Drag or click to add</p>
      </div>
      <div className="p-4 space-y-2">
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
    </div>
  );
}

