'use client';

import { useState } from 'react';
import { ContentBlockType } from './course-builder';

interface ContentBlockProps {
  block: ContentBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  showProperties?: boolean;
}

export function ContentBlock({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  showProperties = false,
}: ContentBlockProps) {
  const updateData = (updates: any) => {
    onUpdate(block.id, updates);
  };

  switch (block.type) {
    case 'video':
      return (
        <VideoBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'image':
      return (
        <ImageBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'text':
      return (
        <TextBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'quiz':
      return (
        <QuizBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'file':
      return (
        <FileBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'embed':
      return (
        <EmbedBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    default:
      return null;
  }
}

function VideoBlock({ block, isSelected, onSelect, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = block.data || { url: '', title: '', description: '' };

  if (showProperties) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
          <input
            type="url"
            value={data.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Video title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={data.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Video description"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {data.url ? (
        <div className="space-y-3">
          <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            <iframe
              src={data.url}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {data.title && <h3 className="font-semibold text-gray-900">{data.title}</h3>}
          {data.description && <p className="text-sm text-gray-600">{data.description}</p>}
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500">Click to add video URL</p>
        </div>
      )}
    </div>
  );
}

function ImageBlock({ block, isSelected, onSelect, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = block.data || { url: '', alt: '', caption: '' };

  if (showProperties) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="url"
            value={data.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
          <input
            type="text"
            value={data.alt || ''}
            onChange={(e) => onUpdate({ alt: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Descriptive alt text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
          <input
            type="text"
            value={data.caption || ''}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Image caption"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {data.url ? (
        <div className="space-y-2">
          <img src={data.url} alt={data.alt || ''} className="w-full rounded-lg" />
          {data.caption && <p className="text-sm text-gray-600 text-center">{data.caption}</p>}
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500">Click to add image URL</p>
        </div>
      )}
    </div>
  );
}

function TextBlock({ block, isSelected, onSelect, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = block.data || { content: '', title: '' };

  if (showProperties) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Section title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={data.content || ''}
            onChange={(e) => onUpdate({ content: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter your text content here..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {data.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3>}
      <div className="prose max-w-none">
        {data.content ? (
          <p className="text-gray-700 whitespace-pre-wrap">{data.content}</p>
        ) : (
          <p className="text-gray-400 italic">Click to add text content</p>
        )}
      </div>
    </div>
  );
}

function QuizBlock({ block, isSelected, onSelect, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = block.data || { title: '', questions: [] };

  if (showProperties) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Quiz title"
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">Quiz questions will be managed separately in the quiz editor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <h3 className="font-semibold text-gray-900">{data.title || 'Untitled Quiz'}</h3>
            <p className="text-sm text-gray-600">Configure quiz in properties panel</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileBlock({ block, isSelected, onSelect, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = block.data || { url: '', title: '', description: '' };

  if (showProperties) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
          <input
            type="url"
            value={data.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://example.com/file.pdf"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="File name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={data.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="File description"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{data.title || 'Untitled File'}</h3>
            {data.description && <p className="text-sm text-gray-600">{data.description}</p>}
            {data.url && (
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-500 hover:text-primary-600 mt-1 inline-flex items-center gap-1"
              >
                Download
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmbedBlock({ block, isSelected, onSelect, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = block.data || { embedCode: '', title: '' };

  if (showProperties) {
    return (
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Embed title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Embed Code</label>
          <textarea
            value={data.embedCode || ''}
            onChange={(e) => onUpdate({ embedCode: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            placeholder="<iframe src='...'></iframe>"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {data.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3>}
      {data.embedCode ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden" dangerouslySetInnerHTML={{ __html: data.embedCode }} />
      ) : (
        <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500">Click to add embed code</p>
        </div>
      )}
    </div>
  );
}

