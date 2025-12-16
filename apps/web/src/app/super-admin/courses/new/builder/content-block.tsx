'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
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
    // Text & Basic
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
    case 'heading':
      return (
        <HeadingBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'quote':
      return (
        <QuoteBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'divider':
      return (
        <DividerBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );

    // Lists & Steps
    case 'bullet_list':
      return (
        <BulletListBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'numbered_list':
      return (
        <NumberedListBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'numbered_steps':
      return (
        <NumberedStepsBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'checklist':
      return (
        <ChecklistBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );

    // Media
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
    case 'image_gallery':
      return (
        <ImageGalleryBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'audio':
      return (
        <AudioBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'file_download':
      return (
        <FileDownloadBlock
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

    // Interactive
    case 'accordion':
      return (
        <AccordionBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'tabs':
      return (
        <TabsBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'flashcard':
      return (
        <FlashcardBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'flashcard_deck':
      return (
        <FlashcardDeckBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'hotspot_image':
      return (
        <HotspotImageBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'slider':
      return (
        <SliderBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'reveal':
      return (
        <RevealBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );

    // Data & Comparison
    case 'table':
      return (
        <TableBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'comparison':
      return (
        <ComparisonBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'timeline':
      return (
        <TimelineBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'process_flow':
      return (
        <ProcessFlowBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'stats':
      return (
        <StatsBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );

    // Callouts
    case 'callout':
      return (
        <CalloutBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'highlight_box':
      return (
        <HighlightBoxBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );

    // Reference
    case 'glossary':
      return (
        <GlossaryBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'definition':
      return (
        <DefinitionBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'code':
      return (
        <CodeBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'formula':
      return (
        <FormulaBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'citation':
      return (
        <CitationBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );

    // Engagement
    case 'knowledge_check':
      return (
        <KnowledgeCheckBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'reflection':
      return (
        <ReflectionBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'poll':
      return (
        <PollBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'discussion':
      return (
        <DiscussionPromptBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'scenario':
      return (
        <ScenarioBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'drag_drop':
      return (
        <DragDropBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );

    // Layout
    case 'two_column':
      return (
        <TwoColumnBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'three_column':
      return (
        <ThreeColumnBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'card_grid':
      return (
        <CardGridBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );
    case 'spacer':
      return (
        <SpacerBlock
          block={block}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={updateData}
          showProperties={showProperties}
        />
      );

    // Legacy
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
    default:
      return (
        <div className="p-6 text-sm text-gray-500 italic">
          Unknown block type: <span className="font-mono">{String(block.type)}</span>
        </div>
      );
  }
}

function asArray<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function VideoBlock({ block, isSelected, onSelect, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = block.data || { url: '', title: '', duration_seconds: 0, thumbnail_url: '', auto_play: false, show_controls: true, description: '' };

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
          <input
            type="number"
            min={0}
            value={Number.isFinite(Number(data.duration_seconds)) ? Number(data.duration_seconds) : 0}
            onChange={(e) => onUpdate({ duration_seconds: Number(e.target.value || 0) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="180"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL (optional)</label>
          <input
            type="url"
            value={data.thumbnail_url || ''}
            onChange={(e) => onUpdate({ thumbnail_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Auto play</label>
          <input
            type="checkbox"
            checked={!!data.auto_play}
            onChange={(e) => onUpdate({ auto_play: e.target.checked })}
            className="w-5 h-5 text-primary-500 rounded"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Show controls</label>
          <input
            type="checkbox"
            checked={data.show_controls ?? true}
            onChange={(e) => onUpdate({ show_controls: e.target.checked })}
            className="w-5 h-5 text-primary-500 rounded"
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
  const data = block.data || { url: '', alt: '', caption: '', size: 'large', alignment: 'center' };

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
          <select
            value={data.size || 'large'}
            onChange={(e) => onUpdate({ size: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="full">Full</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
          <select
            value={data.alignment || 'center'}
            onChange={(e) => onUpdate({ alignment: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
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
  // Reference spec uses { text }. Keep backward compat with older { content, title }.
  const data = block.data || { text: '', title: '' };
  const textValue = (data.text ?? data.content ?? '') as string;

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
            value={textValue}
            onChange={(e) => onUpdate({ text: e.target.value })}
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
        {textValue ? (
          <p className="text-gray-700 whitespace-pre-wrap">{textValue}</p>
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
  // Spec uses { url, title, height, type }. Keep legacy { embedCode }.
  const data = block.data || { url: '', title: '', height: 400, type: 'iframe', embedCode: '' };

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Embed URL</label>
          <input
            type="url"
            value={data.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
            <input
              type="number"
              min={100}
              value={Number.isFinite(Number(data.height)) ? Number(data.height) : 400}
              onChange={(e) => onUpdate({ height: Number(e.target.value || 400) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={data.type || 'iframe'}
              onChange={(e) => onUpdate({ type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="iframe">iframe</option>
              <option value="twitter">twitter</option>
              <option value="linkedin">linkedin</option>
              <option value="google_form">google_form</option>
              <option value="typeform">typeform</option>
            </select>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Legacy embed code (optional)</label>
          <textarea
            value={data.embedCode || ''}
            onChange={(e) => onUpdate({ embedCode: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
            placeholder="<iframe src='...'></iframe>"
          />
          <p className="text-xs text-gray-500 mt-1">If provided, this will be used instead of the URL.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {data.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3>}
      {data.embedCode ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden" dangerouslySetInnerHTML={{ __html: data.embedCode }} />
      ) : data.url ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <iframe
            src={data.url}
            title={data.title || 'Embedded content'}
            className="w-full"
            style={{ height: Number.isFinite(Number(data.height)) ? Number(data.height) : 400 }}
          />
        </div>
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

// ---- Additional block types (friendly form editors) ----

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function RowActions({
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown,
}: {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {onMoveUp && (
        <button type="button" onClick={onMoveUp} disabled={!canMoveUp} className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-50">
          ↑
        </button>
      )}
      {onMoveDown && (
        <button type="button" onClick={onMoveDown} disabled={!canMoveDown} className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-50">
          ↓
        </button>
      )}
      {onRemove && (
        <button type="button" onClick={onRemove} className="text-xs text-gray-400 hover:text-red-600">
          ✕
        </button>
      )}
    </div>
  );
}

function moveItem<T>(arr: T[], from: number, to: number) {
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function HeadingBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { text: '', level: 2 }) as { text?: string; level?: 1 | 2 | 3 | 4 };
  if (!showProperties) {
    const level = data.level ?? 2;
    const text = data.text || '';
    return (
      <div className="p-6">
        {level === 1 ? <h1 className="text-2xl font-bold text-gray-900">{text}</h1> : null}
        {level === 2 ? <h2 className="text-xl font-bold text-gray-900">{text}</h2> : null}
        {level === 3 ? <h3 className="text-lg font-bold text-gray-900">{text}</h3> : null}
        {level === 4 ? <h4 className="text-base font-bold text-gray-900">{text}</h4> : null}
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Heading text">
        <input
          type="text"
          value={data.text || ''}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="e.g., Understanding Customer Needs"
        />
      </Field>
      <Field label="Level">
        <select
          value={data.level ?? 2}
          onChange={(e) => onUpdate({ level: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
          <option value={4}>H4</option>
        </select>
      </Field>
    </div>
  );
}

function QuoteBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { text: '', author: '', source: '', style: 'default' }) as {
    text?: string;
    author?: string;
    source?: string;
    style?: 'default' | 'large' | 'centered';
  };
  if (!showProperties) {
    return (
      <div className="p-6">
        <blockquote className="border-l-4 border-primary-500 pl-4 py-2 italic text-gray-700">
          <p className="mb-2">&quot;{data.text || ''}&quot;</p>
          {(data.author || data.source) && (
            <footer className="text-sm text-gray-600">
              — {data.author}
              {data.source ? <span className="text-gray-500">, {data.source}</span> : null}
            </footer>
          )}
        </blockquote>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Quote">
        <textarea
          value={data.text || ''}
          onChange={(e) => onUpdate({ text: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter quote text..."
        />
      </Field>
      <Field label="Author (optional)">
        <input
          type="text"
          value={data.author || ''}
          onChange={(e) => onUpdate({ author: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="e.g., Kate Zabriskie"
        />
      </Field>
      <Field label="Source (optional)">
        <input
          type="text"
          value={data.source || ''}
          onChange={(e) => onUpdate({ source: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="e.g., Customer Service Expert"
        />
      </Field>
      <Field label="Style">
        <select
          value={data.style || 'default'}
          onChange={(e) => onUpdate({ style: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="default">Default</option>
          <option value="large">Large</option>
          <option value="centered">Centered</option>
        </select>
      </Field>
    </div>
  );
}

function DividerBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { style: 'line', spacing: 'medium' }) as { style?: 'line' | 'dots' | 'space'; spacing?: 'small' | 'medium' | 'large' };
  if (!showProperties) {
    return (
      <div className="p-6">
        {data.style === 'space' ? <div className="h-6" /> : data.style === 'dots' ? <div className="text-center text-gray-300">• • •</div> : <hr className="border-gray-200" />}
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Style">
        <select
          value={data.style || 'line'}
          onChange={(e) => onUpdate({ style: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="line">Line</option>
          <option value="dots">Dots</option>
          <option value="space">Space</option>
        </select>
      </Field>
      <Field label="Spacing">
        <select
          value={data.spacing || 'medium'}
          onChange={(e) => onUpdate({ spacing: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </Field>
    </div>
  );
}

function BulletListBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', items: [''], style: 'disc' }) as { title?: string; items?: string[]; style?: string };
  const items = Array.isArray(data.items) && data.items.length ? data.items : [''];
  if (!showProperties) {
    return (
      <div className="p-6">
        {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {items.filter(Boolean).map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="e.g., Key Points"
        />
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Items</p>
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={it}
              onChange={(e) => {
                const next = items.slice();
                next[idx] = e.target.value;
                onUpdate({ items: next });
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={`Item ${idx + 1}`}
            />
            <RowActions
              onMoveUp={() => onUpdate({ items: moveItem(items, idx, idx - 1) })}
              onMoveDown={() => onUpdate({ items: moveItem(items, idx, idx + 1) })}
              onRemove={() => onUpdate({ items: items.filter((_, i) => i !== idx) })}
              canMoveUp={idx > 0}
              canMoveDown={idx < items.length - 1}
            />
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ items: [...items, ''] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add item
        </button>
      </div>
      <Field label="Style">
        <select
          value={data.style || 'disc'}
          onChange={(e) => onUpdate({ style: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="disc">Bullet</option>
          <option value="circle">Circle</option>
          <option value="square">Square</option>
          <option value="check">Check</option>
          <option value="arrow">Arrow</option>
        </select>
      </Field>
    </div>
  );
}

function NumberedListBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', items: [''], start: 1 }) as { title?: string; items?: string[]; start?: number };
  const items = Array.isArray(data.items) && data.items.length ? data.items : [''];
  const start = Number.isFinite(Number(data.start)) ? Number(data.start) : 1;
  if (!showProperties) {
    return (
      <div className="p-6">
        {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
        <ol className="list-decimal list-inside space-y-2 text-gray-700" start={start}>
          {items.filter(Boolean).map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <Field label="Start number">
        <input
          type="number"
          min={1}
          value={start}
          onChange={(e) => onUpdate({ start: Number(e.target.value || 1) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Items</p>
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={it}
              onChange={(e) => {
                const next = items.slice();
                next[idx] = e.target.value;
                onUpdate({ items: next });
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={`Item ${idx + 1}`}
            />
            <RowActions
              onMoveUp={() => onUpdate({ items: moveItem(items, idx, idx - 1) })}
              onMoveDown={() => onUpdate({ items: moveItem(items, idx, idx + 1) })}
              onRemove={() => onUpdate({ items: items.filter((_, i) => i !== idx) })}
              canMoveUp={idx > 0}
              canMoveDown={idx < items.length - 1}
            />
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ items: [...items, ''] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add item
        </button>
      </div>
    </div>
  );
}

function NumberedStepsBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', steps: [{ title: '', description: '', image_url: '' }] }) as {
    title?: string;
    steps?: Array<{ title: string; description: string; image_url?: string }>;
  };
  const steps = Array.isArray(data.steps) && data.steps.length ? data.steps : [{ title: '', description: '', image_url: '' }];
  if (!showProperties) {
    return (
      <div className="p-6">
        {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-4">{data.title}</h3> : null}
        <ol className="list-decimal list-inside space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="text-gray-700">
              <span className="font-medium">{s.title}</span>
              {s.description ? <p className="ml-6 text-gray-600">{s.description}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Steps</p>
        {steps.map((s, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Step {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ steps: moveItem(steps, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ steps: moveItem(steps, idx, idx + 1) })}
                onRemove={() => onUpdate({ steps: steps.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < steps.length - 1}
              />
            </div>
            <Field label="Step title">
              <input
                type="text"
                value={s.title || ''}
                onChange={(e) => {
                  const next = steps.slice();
                  next[idx] = { ...next[idx], title: e.target.value };
                  onUpdate({ steps: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={s.description || ''}
                onChange={(e) => {
                  const next = steps.slice();
                  next[idx] = { ...next[idx], description: e.target.value };
                  onUpdate({ steps: next });
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </Field>
            <Field label="Image URL (optional)">
              <input
                type="url"
                value={s.image_url || ''}
                onChange={(e) => {
                  const next = steps.slice();
                  next[idx] = { ...next[idx], image_url: e.target.value };
                  onUpdate({ steps: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://..."
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onUpdate({ steps: [...steps, { title: '', description: '', image_url: '' }] })}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          + Add step
        </button>
      </div>
    </div>
  );
}

function ChecklistBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', items: [{ text: '', checked: false }], allow_interaction: true }) as {
    title?: string;
    items?: Array<{ text: string; checked: boolean }>;
    allow_interaction?: boolean;
  };
  const items = Array.isArray(data.items) && data.items.length ? data.items : [{ text: '', checked: false }];
  if (!showProperties) {
    return (
      <div className="p-6">
        {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
        <div className="space-y-2">
          {items.map((it, i) => (
            <label key={i} className="flex items-center gap-3">
              <input type="checkbox" checked={!!it.checked} readOnly className="w-5 h-5 text-primary-500 rounded" />
              <span className="text-gray-700">{it.text}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Allow learners to check items</label>
        <input
          type="checkbox"
          checked={data.allow_interaction ?? true}
          onChange={(e) => onUpdate({ allow_interaction: e.target.checked })}
          className="w-5 h-5 text-primary-500 rounded"
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Items</p>
        {items.map((it, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Item {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ items: moveItem(items, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ items: moveItem(items, idx, idx + 1) })}
                onRemove={() => onUpdate({ items: items.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < items.length - 1}
              />
            </div>
            <Field label="Text">
              <input
                type="text"
                value={it.text || ''}
                onChange={(e) => {
                  const next = items.slice();
                  next[idx] = { ...next[idx], text: e.target.value };
                  onUpdate({ items: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </Field>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Checked by default</label>
              <input
                type="checkbox"
                checked={!!it.checked}
                onChange={(e) => {
                  const next = items.slice();
                  next[idx] = { ...next[idx], checked: e.target.checked };
                  onUpdate({ items: next });
                }}
                className="w-5 h-5 text-primary-500 rounded"
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ items: [...items, { text: '', checked: false }] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add item
        </button>
      </div>
    </div>
  );
}

function ImageGalleryBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', images: [{ url: '', alt: '', caption: '' }], layout: 'grid', columns: 3 }) as {
    title?: string;
    images?: Array<{ url: string; alt: string; caption?: string }>;
    layout?: 'grid' | 'carousel' | 'masonry';
    columns?: 2 | 3 | 4;
  };
  const images = Array.isArray(data.images) && data.images.length ? data.images : [{ url: '', alt: '', caption: '' }];
  if (!showProperties) {
    return (
      <div className="p-6 space-y-3">
        {data.title ? <h3 className="text-lg font-semibold text-gray-900">{data.title}</h3> : null}
        <div className={`grid gap-3 ${data.columns === 2 ? 'grid-cols-2' : data.columns === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
          {images.map((img, i) => (
            <div key={i} className="bg-gray-100 rounded-lg border border-gray-200 aspect-video overflow-hidden flex items-center justify-center">
              {img.url ? <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-500">Image</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Layout">
          <select
            value={data.layout || 'grid'}
            onChange={(e) => onUpdate({ layout: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="grid">Grid</option>
            <option value="carousel">Carousel</option>
            <option value="masonry">Masonry</option>
          </select>
        </Field>
        <Field label="Columns">
          <select
            value={data.columns || 3}
            onChange={(e) => onUpdate({ columns: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </Field>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Images</p>
        {images.map((img, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Image {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ images: moveItem(images, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ images: moveItem(images, idx, idx + 1) })}
                onRemove={() => onUpdate({ images: images.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < images.length - 1}
              />
            </div>
            <Field label="Image URL">
              <input
                type="url"
                value={img.url || ''}
                onChange={(e) => {
                  const next = images.slice();
                  next[idx] = { ...next[idx], url: e.target.value };
                  onUpdate({ images: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://..."
              />
            </Field>
            <Field label="Alt text">
              <input
                type="text"
                value={img.alt || ''}
                onChange={(e) => {
                  const next = images.slice();
                  next[idx] = { ...next[idx], alt: e.target.value };
                  onUpdate({ images: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </Field>
            <Field label="Caption (optional)">
              <input
                type="text"
                value={img.caption || ''}
                onChange={(e) => {
                  const next = images.slice();
                  next[idx] = { ...next[idx], caption: e.target.value };
                  onUpdate({ images: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </Field>
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ images: [...images, { url: '', alt: '', caption: '' }] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add image
        </button>
      </div>
    </div>
  );
}

function AudioBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { url: '', title: '', duration_seconds: 0, show_transcript: false, transcript: '' }) as {
    url?: string;
    title?: string;
    duration_seconds?: number;
    show_transcript?: boolean;
    transcript?: string;
  };
  if (!showProperties) {
    return (
      <div className="p-6">
        {data.title ? <h3 className="font-semibold text-gray-900 mb-2">{data.title}</h3> : null}
        {data.url ? <audio src={data.url} controls className="w-full" /> : <p className="text-sm text-gray-500">Add an audio URL</p>}
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Audio URL">
        <input
          type="url"
          value={data.url || ''}
          onChange={(e) => onUpdate({ url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="https://..."
        />
      </Field>
      <Field label="Title">
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <Field label="Duration (seconds)">
        <input
          type="number"
          min={0}
          value={Number.isFinite(Number(data.duration_seconds)) ? Number(data.duration_seconds) : 0}
          onChange={(e) => onUpdate({ duration_seconds: Number(e.target.value || 0) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Show transcript</label>
        <input
          type="checkbox"
          checked={!!data.show_transcript}
          onChange={(e) => onUpdate({ show_transcript: e.target.checked })}
          className="w-5 h-5 text-primary-500 rounded"
        />
      </div>
      {data.show_transcript && (
        <Field label="Transcript">
          <textarea
            value={data.transcript || ''}
            onChange={(e) => onUpdate({ transcript: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Paste transcript..."
          />
        </Field>
      )}
    </div>
  );
}

function FileDownloadBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { url: '', filename: '', file_type: 'pdf', file_size_bytes: 0, description: '' }) as {
    url?: string;
    filename?: string;
    file_type?: 'pdf' | 'doc' | 'xls' | 'ppt' | 'zip' | 'other';
    file_size_bytes?: number;
    description?: string;
  };
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="font-semibold text-gray-900">{data.filename || 'Downloadable file'}</p>
          {data.description ? <p className="text-sm text-gray-600 mt-1">{data.description}</p> : null}
          {data.url ? (
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block">
              Download
            </a>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Add a file URL</p>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="File URL">
        <input
          type="url"
          value={data.url || ''}
          onChange={(e) => onUpdate({ url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="https://..."
        />
      </Field>
      <Field label="Filename">
        <input
          type="text"
          value={data.filename || ''}
          onChange={(e) => onUpdate({ filename: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="e.g., Worksheet.pdf"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="File type">
          <select
            value={data.file_type || 'pdf'}
            onChange={(e) => onUpdate({ file_type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="pdf">PDF</option>
            <option value="doc">DOC</option>
            <option value="xls">XLS</option>
            <option value="ppt">PPT</option>
            <option value="zip">ZIP</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="File size (bytes)">
          <input
            type="number"
            min={0}
            value={Number.isFinite(Number(data.file_size_bytes)) ? Number(data.file_size_bytes) : 0}
            onChange={(e) => onUpdate({ file_size_bytes: Number(e.target.value || 0) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </Field>
      </div>
      <Field label="Description (optional)">
        <textarea
          value={data.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
    </div>
  );
}

function AccordionBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', items: [{ title: '', content: '', default_open: false }], allow_multiple_open: false }) as {
    title?: string;
    items?: Array<{ title: string; content: string; default_open?: boolean }>;
    allow_multiple_open?: boolean;
  };
  const items = Array.isArray(data.items) && data.items.length ? data.items : [{ title: '', content: '', default_open: false }];
  if (!showProperties) {
    return (
      <div className="p-6">
        {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-4">{data.title}</h3> : null}
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="border border-gray-200 rounded-lg">
              <div className="px-4 py-3 font-medium text-gray-900">{it.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Allow multiple open</label>
        <input
          type="checkbox"
          checked={!!data.allow_multiple_open}
          onChange={(e) => onUpdate({ allow_multiple_open: e.target.checked })}
          className="w-5 h-5 text-primary-500 rounded"
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Items</p>
        {items.map((it, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Item {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ items: moveItem(items, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ items: moveItem(items, idx, idx + 1) })}
                onRemove={() => onUpdate({ items: items.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < items.length - 1}
              />
            </div>
            <Field label="Item title">
              <input
                type="text"
                value={it.title || ''}
                onChange={(e) => {
                  const next = items.slice();
                  next[idx] = { ...next[idx], title: e.target.value };
                  onUpdate({ items: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </Field>
            <Field label="Content">
              <textarea
                value={it.content || ''}
                onChange={(e) => {
                  const next = items.slice();
                  next[idx] = { ...next[idx], content: e.target.value };
                  onUpdate({ items: next });
                }}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </Field>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Open by default</label>
              <input
                type="checkbox"
                checked={!!it.default_open}
                onChange={(e) => {
                  const next = items.slice();
                  next[idx] = { ...next[idx], default_open: e.target.checked };
                  onUpdate({ items: next });
                }}
                className="w-5 h-5 text-primary-500 rounded"
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ items: [...items, { title: '', content: '', default_open: false }] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add item
        </button>
      </div>
    </div>
  );
}

function TabsBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { tabs: [{ label: '', icon: '', content: '' }], default_tab: 0 }) as {
    tabs?: Array<{ label: string; icon?: string; content: string }>;
    default_tab?: number;
  };
  const tabs = Array.isArray(data.tabs) && data.tabs.length ? data.tabs : [{ label: '', icon: '', content: '' }];
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="flex gap-2 border-b border-gray-200 mb-3">
          {tabs.map((t, i) => (
            <div key={i} className="px-3 py-2 text-sm font-medium text-gray-700">
              {t.icon ? <span className="mr-2">{t.icon}</span> : null}
              {t.label || `Tab ${i + 1}`}
            </div>
          ))}
        </div>
        <div className="text-gray-700 whitespace-pre-wrap">{tabs[data.default_tab ?? 0]?.content || ''}</div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Default tab">
        <input
          type="number"
          min={0}
          max={Math.max(0, tabs.length - 1)}
          value={Number.isFinite(Number(data.default_tab)) ? Number(data.default_tab) : 0}
          onChange={(e) => onUpdate({ default_tab: Number(e.target.value || 0) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Tabs</p>
        {tabs.map((t, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Tab {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ tabs: moveItem(tabs, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ tabs: moveItem(tabs, idx, idx + 1) })}
                onRemove={() => onUpdate({ tabs: tabs.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < tabs.length - 1}
              />
            </div>
            <Field label="Label">
              <input
                type="text"
                value={t.label || ''}
                onChange={(e) => {
                  const next = tabs.slice();
                  next[idx] = { ...next[idx], label: e.target.value };
                  onUpdate({ tabs: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </Field>
            <Field label="Icon (optional)">
              <input
                type="text"
                value={t.icon || ''}
                onChange={(e) => {
                  const next = tabs.slice();
                  next[idx] = { ...next[idx], icon: e.target.value };
                  onUpdate({ tabs: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 👂"
              />
            </Field>
            <Field label="Content">
              <textarea
                value={t.content || ''}
                onChange={(e) => {
                  const next = tabs.slice();
                  next[idx] = { ...next[idx], content: e.target.value };
                  onUpdate({ tabs: next });
                }}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </Field>
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ tabs: [...tabs, { label: '', icon: '', content: '' }] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add tab
        </button>
      </div>
    </div>
  );
}

function FlashcardBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { front: { text: '', image_url: '' }, back: { text: '', image_url: '' } }) as {
    front?: { text: string; image_url?: string };
    back?: { text: string; image_url?: string };
  };
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Front</p>
          <p className="font-medium text-gray-900">{data.front?.text}</p>
          <p className="text-xs text-gray-500 mt-4 mb-1">Back</p>
          <p className="text-gray-700 whitespace-pre-wrap">{data.back?.text}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Front text">
        <textarea
          value={data.front?.text || ''}
          onChange={(e) => onUpdate({ front: { ...(data.front || {}), text: e.target.value } })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <Field label="Front image URL (optional)">
        <input
          type="url"
          value={data.front?.image_url || ''}
          onChange={(e) => onUpdate({ front: { ...(data.front || {}), image_url: e.target.value } })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="https://..."
        />
      </Field>
      <Field label="Back text">
        <textarea
          value={data.back?.text || ''}
          onChange={(e) => onUpdate({ back: { ...(data.back || {}), text: e.target.value } })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <Field label="Back image URL (optional)">
        <input
          type="url"
          value={data.back?.image_url || ''}
          onChange={(e) => onUpdate({ back: { ...(data.back || {}), image_url: e.target.value } })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="https://..."
        />
      </Field>
    </div>
  );
}

function FlashcardDeckBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', cards: [{ front: '', back: '' }], shuffle: false, show_progress: true }) as {
    title?: string;
    cards?: Array<{ front: string; back: string }>;
    shuffle?: boolean;
    show_progress?: boolean;
  };
  const cards = Array.isArray(data.cards) && data.cards.length ? data.cards : [{ front: '', back: '' }];
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="font-semibold text-gray-900">{data.title || 'Flashcards'}</p>
          <p className="text-sm text-gray-600 mt-1">{cards.length} card(s)</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Shuffle</label>
        <input type="checkbox" checked={!!data.shuffle} onChange={(e) => onUpdate({ shuffle: e.target.checked })} className="w-5 h-5 text-primary-500 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Show progress</label>
        <input
          type="checkbox"
          checked={data.show_progress ?? true}
          onChange={(e) => onUpdate({ show_progress: e.target.checked })}
          className="w-5 h-5 text-primary-500 rounded"
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Cards</p>
        {cards.map((c, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Card {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ cards: moveItem(cards, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ cards: moveItem(cards, idx, idx + 1) })}
                onRemove={() => onUpdate({ cards: cards.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < cards.length - 1}
              />
            </div>
            <Field label="Front">
              <input
                type="text"
                value={c.front || ''}
                onChange={(e) => {
                  const next = cards.slice();
                  next[idx] = { ...next[idx], front: e.target.value };
                  onUpdate({ cards: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </Field>
            <Field label="Back">
              <textarea
                value={c.back || ''}
                onChange={(e) => {
                  const next = cards.slice();
                  next[idx] = { ...next[idx], back: e.target.value };
                  onUpdate({ cards: next });
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </Field>
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ cards: [...cards, { front: '', back: '' }] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add card
        </button>
      </div>
    </div>
  );
}

function HotspotImageBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { image_url: '', image_alt: '', hotspots: [{ id: '1', x: 25, y: 30, title: '', description: '', image_url: '' }] }) as {
    image_url?: string;
    image_alt?: string;
    hotspots?: Array<{ id: string; x: number; y: number; title: string; description: string; image_url?: string }>;
  };
  const hotspots = Array.isArray(data.hotspots) && data.hotspots.length ? data.hotspots : [{ id: '1', x: 25, y: 30, title: '', description: '', image_url: '' }];
  if (!showProperties) {
    return (
      <div className="p-6">
        {data.image_url ? (
          <div className="relative inline-block w-full">
            <img src={data.image_url} alt={data.image_alt || ''} className="w-full rounded-lg border border-gray-200" />
            <div className="absolute inset-0">
              {hotspots.slice(0, 8).map((h, i) => (
                <div
                  key={h.id || i}
                  className="absolute w-3 h-3 bg-primary-500 rounded-full border-2 border-white"
                  style={{ left: `${Number(h.x) || 0}%`, top: `${Number(h.y) || 0}%` }}
                  title={h.title || ''}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">
            Add image URL to configure hotspots
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Image URL">
        <input
          type="url"
          value={data.image_url || ''}
          onChange={(e) => onUpdate({ image_url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="https://..."
        />
      </Field>
      <Field label="Image alt text">
        <input
          type="text"
          value={data.image_alt || ''}
          onChange={(e) => onUpdate({ image_alt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Hotspots</p>
        {hotspots.map((h, idx) => (
          <div key={h.id || idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Hotspot {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ hotspots: moveItem(hotspots, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ hotspots: moveItem(hotspots, idx, idx + 1) })}
                onRemove={() => onUpdate({ hotspots: hotspots.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < hotspots.length - 1}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="ID">
                <input
                  type="text"
                  value={h.id || ''}
                  onChange={(e) => {
                    const next = hotspots.slice();
                    next[idx] = { ...next[idx], id: e.target.value };
                    onUpdate({ hotspots: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
              <Field label="X (%)">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={Number.isFinite(Number(h.x)) ? Number(h.x) : 0}
                  onChange={(e) => {
                    const next = hotspots.slice();
                    next[idx] = { ...next[idx], x: Number(e.target.value || 0) };
                    onUpdate({ hotspots: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
              <Field label="Y (%)">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={Number.isFinite(Number(h.y)) ? Number(h.y) : 0}
                  onChange={(e) => {
                    const next = hotspots.slice();
                    next[idx] = { ...next[idx], y: Number(e.target.value || 0) };
                    onUpdate({ hotspots: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
            </div>
            <Field label="Title">
              <input
                type="text"
                value={h.title || ''}
                onChange={(e) => {
                  const next = hotspots.slice();
                  next[idx] = { ...next[idx], title: e.target.value };
                  onUpdate({ hotspots: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={h.description || ''}
                onChange={(e) => {
                  const next = hotspots.slice();
                  next[idx] = { ...next[idx], description: e.target.value };
                  onUpdate({ hotspots: next });
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <Field label="Optional hotspot image URL">
              <input
                type="url"
                value={h.image_url || ''}
                onChange={(e) => {
                  const next = hotspots.slice();
                  next[idx] = { ...next[idx], image_url: e.target.value };
                  onUpdate({ hotspots: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onUpdate({ hotspots: [...hotspots, { id: String(hotspots.length + 1), x: 50, y: 50, title: '', description: '', image_url: '' }] })}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          + Add hotspot
        </button>
      </div>
    </div>
  );
}

function SliderBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', slides: [{ title: '', content: '', image_url: '' }], auto_play: false, show_dots: true, show_arrows: true }) as {
    title?: string;
    slides?: Array<{ title?: string; content: string; image_url?: string }>;
    auto_play?: boolean;
    show_dots?: boolean;
    show_arrows?: boolean;
  };
  const slides = Array.isArray(data.slides) && data.slides.length ? data.slides : [{ title: '', content: '', image_url: '' }];
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="font-semibold text-gray-900">{data.title || 'Slider'}</p>
          <p className="text-sm text-gray-600 mt-1">{slides.length} slide(s)</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Auto play</label>
        <input type="checkbox" checked={!!data.auto_play} onChange={(e) => onUpdate({ auto_play: e.target.checked })} className="w-5 h-5 text-primary-500 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Show dots</label>
        <input type="checkbox" checked={data.show_dots ?? true} onChange={(e) => onUpdate({ show_dots: e.target.checked })} className="w-5 h-5 text-primary-500 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Show arrows</label>
        <input
          type="checkbox"
          checked={data.show_arrows ?? true}
          onChange={(e) => onUpdate({ show_arrows: e.target.checked })}
          className="w-5 h-5 text-primary-500 rounded"
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Slides</p>
        {slides.map((s, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Slide {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ slides: moveItem(slides, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ slides: moveItem(slides, idx, idx + 1) })}
                onRemove={() => onUpdate({ slides: slides.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < slides.length - 1}
              />
            </div>
            <Field label="Slide title (optional)">
              <input
                type="text"
                value={s.title || ''}
                onChange={(e) => {
                  const next = slides.slice();
                  next[idx] = { ...next[idx], title: e.target.value };
                  onUpdate({ slides: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <Field label="Content">
              <textarea
                value={s.content || ''}
                onChange={(e) => {
                  const next = slides.slice();
                  next[idx] = { ...next[idx], content: e.target.value };
                  onUpdate({ slides: next });
                }}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <Field label="Image URL (optional)">
              <input
                type="url"
                value={s.image_url || ''}
                onChange={(e) => {
                  const next = slides.slice();
                  next[idx] = { ...next[idx], image_url: e.target.value };
                  onUpdate({ slides: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            </Field>
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ slides: [...slides, { title: '', content: '', image_url: '' }] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add slide
        </button>
      </div>
    </div>
  );
}

function RevealBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { prompt: '', hidden_content: '', button_text: 'Reveal Answer', style: 'button' }) as {
    prompt?: string;
    hidden_content?: string;
    button_text?: string;
    style?: 'button' | 'blur' | 'flip';
  };
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="font-medium text-gray-900">{data.prompt}</p>
          <p className="text-sm text-gray-600 mt-2">{data.button_text || 'Reveal Answer'}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Prompt">
        <textarea
          value={data.prompt || ''}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <Field label="Hidden content">
        <textarea
          value={data.hidden_content || ''}
          onChange={(e) => onUpdate({ hidden_content: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <Field label="Button text (optional)">
        <input
          type="text"
          value={data.button_text || ''}
          onChange={(e) => onUpdate({ button_text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <Field label="Style">
        <select
          value={data.style || 'button'}
          onChange={(e) => onUpdate({ style: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="button">Button</option>
          <option value="blur">Blur</option>
          <option value="flip">Flip</option>
        </select>
      </Field>
    </div>
  );
}

function TableBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', headers: [''], rows: [['']], striped: true, highlight_first_column: false }) as {
    title?: string;
    headers?: string[];
    rows?: string[][];
    striped?: boolean;
    highlight_first_column?: boolean;
  };
  const headers = Array.isArray(data.headers) && data.headers.length ? data.headers : [''];
  const rows = Array.isArray(data.rows) && data.rows.length ? data.rows : [headers.map(() => '')];
  const normalizedRows = rows.map((r) => {
    const row = Array.isArray(r) ? r.slice() : [];
    while (row.length < headers.length) row.push('');
    return row.slice(0, headers.length);
  });

  if (!showProperties) {
    return (
      <div className="p-6">
        {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-4">{data.title}</h3> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-3 py-2 text-left font-medium text-gray-700 border-b">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {normalizedRows.map((r, ri) => (
                <tr key={ri} className={data.striped && ri % 2 === 1 ? 'bg-gray-50' : ''}>
                  {r.map((c, ci) => (
                    <td key={ci} className={`px-3 py-2 text-gray-700 border-b ${data.highlight_first_column && ci === 0 ? 'font-semibold' : ''}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Headers</p>
        {headers.map((h, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={h}
              onChange={(e) => {
                const nextHeaders = headers.slice();
                nextHeaders[idx] = e.target.value;
                // resize rows to match headers count
                const nextRows = normalizedRows.map((r) => {
                  const rr = r.slice();
                  while (rr.length < nextHeaders.length) rr.push('');
                  return rr.slice(0, nextHeaders.length);
                });
                onUpdate({ headers: nextHeaders, rows: nextRows });
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={`Header ${idx + 1}`}
            />
            <RowActions
              onMoveUp={() => {
                const nextHeaders = moveItem(headers, idx, idx - 1);
                const nextRows = normalizedRows.map((r) => moveItem(r, idx, idx - 1));
                onUpdate({ headers: nextHeaders, rows: nextRows });
              }}
              onMoveDown={() => {
                const nextHeaders = moveItem(headers, idx, idx + 1);
                const nextRows = normalizedRows.map((r) => moveItem(r, idx, idx + 1));
                onUpdate({ headers: nextHeaders, rows: nextRows });
              }}
              onRemove={() => {
                const nextHeaders = headers.filter((_, i) => i !== idx);
                const nextRows = normalizedRows.map((r) => r.filter((_, i) => i !== idx));
                onUpdate({ headers: nextHeaders.length ? nextHeaders : [''], rows: nextRows.length ? nextRows : [['']] });
              }}
              canMoveUp={idx > 0}
              canMoveDown={idx < headers.length - 1}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const nextHeaders = [...headers, ''];
            const nextRows = normalizedRows.map((r) => [...r, '']);
            onUpdate({ headers: nextHeaders, rows: nextRows });
          }}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          + Add header
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Rows</p>
        {normalizedRows.map((r, ri) => (
          <div key={ri} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Row {ri + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ headers, rows: moveItem(normalizedRows, ri, ri - 1) })}
                onMoveDown={() => onUpdate({ headers, rows: moveItem(normalizedRows, ri, ri + 1) })}
                onRemove={() => onUpdate({ headers, rows: normalizedRows.filter((_, i) => i !== ri) })}
                canMoveUp={ri > 0}
                canMoveDown={ri < normalizedRows.length - 1}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              {r.map((cell, ci) => (
                <Field key={ci} label={headers[ci] || `Column ${ci + 1}`}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => {
                      const nextRows = normalizedRows.slice();
                      const nextRow = nextRows[ri].slice();
                      nextRow[ci] = e.target.value;
                      nextRows[ri] = nextRow;
                      onUpdate({ rows: nextRows });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </Field>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ headers, rows: [...normalizedRows, headers.map(() => '')] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add row
        </button>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Striped rows</label>
        <input type="checkbox" checked={data.striped ?? true} onChange={(e) => onUpdate({ striped: e.target.checked })} className="w-5 h-5 text-primary-500 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Highlight first column</label>
        <input
          type="checkbox"
          checked={!!data.highlight_first_column}
          onChange={(e) => onUpdate({ highlight_first_column: e.target.checked })}
          className="w-5 h-5 text-primary-500 rounded"
        />
      </div>
    </div>
  );
}

function ComparisonBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', columns: [{ header: '', highlight: false, items: [{ text: '', type: 'neutral' }] }, { header: '', highlight: false, items: [{ text: '', type: 'neutral' }] }] }) as {
    title?: string;
    columns?: Array<{ header: string; highlight?: boolean; items: Array<{ text: string; type: 'pro' | 'con' | 'neutral' }> }>;
  };
  const columns = (Array.isArray(data.columns) && data.columns.length
    ? data.columns
    : [{ header: '', highlight: false, items: [{ text: '', type: 'neutral' as const }] }]) as Array<{
    header: string;
    highlight?: boolean;
    items: Array<{ text: string; type: 'pro' | 'con' | 'neutral' }>;
  }>;
  if (!showProperties) {
    return (
      <div className="p-6">
        {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-4">{data.title}</h3> : null}
        <div className={`grid gap-4 ${columns.length >= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
          {columns.map((c, i) => (
            <div key={i} className={`border rounded-lg p-4 ${c.highlight ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'}`}>
              <p className="font-semibold text-gray-900 mb-3">{c.header}</p>
              <ul className="space-y-2 text-gray-700">
                {c.items.map((it, idx) => (
                  <li key={idx}>
                    <span className="text-gray-500 mr-2">{it.type === 'pro' ? '✓' : it.type === 'con' ? '✕' : '•'}</span>
                    {it.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </Field>
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Columns</p>
        {columns.map((c, colIdx) => (
          <div key={colIdx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Column {colIdx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ columns: moveItem(columns as any[], colIdx, colIdx - 1) as any })}
                onMoveDown={() => onUpdate({ columns: moveItem(columns as any[], colIdx, colIdx + 1) as any })}
                onRemove={() => onUpdate({ columns: columns.filter((_, i) => i !== colIdx) })}
                canMoveUp={colIdx > 0}
                canMoveDown={colIdx < columns.length - 1}
              />
            </div>
            <Field label="Header">
              <input
                type="text"
                value={c.header || ''}
                onChange={(e) => {
                  const next = columns.slice();
                  next[colIdx] = { ...next[colIdx], header: e.target.value };
                  onUpdate({ columns: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Highlight</label>
              <input
                type="checkbox"
                checked={!!c.highlight}
                onChange={(e) => {
                  const next = columns.slice();
                  next[colIdx] = { ...next[colIdx], highlight: e.target.checked };
                  onUpdate({ columns: next });
                }}
                className="w-5 h-5 text-primary-500 rounded"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Items</p>
              {c.items.map((it, itemIdx) => (
                <div key={itemIdx} className="flex items-start gap-2">
                  <select
                    value={it.type}
                    onChange={(e) => {
                      const next = columns.slice();
                      const itemsNext = next[colIdx].items.slice();
                      itemsNext[itemIdx] = { ...itemsNext[itemIdx], type: e.target.value as 'pro' | 'con' | 'neutral' };
                      next[colIdx] = { ...next[colIdx], items: itemsNext };
                      onUpdate({ columns: next });
                    }}
                    className="px-2 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pro">Pro</option>
                    <option value="con">Con</option>
                    <option value="neutral">Neutral</option>
                  </select>
                  <input
                    type="text"
                    value={it.text || ''}
                    onChange={(e) => {
                      const next = columns.slice();
                      const itemsNext = next[colIdx].items.slice();
                      itemsNext[itemIdx] = { ...itemsNext[itemIdx], text: e.target.value };
                      next[colIdx] = { ...next[colIdx], items: itemsNext };
                      onUpdate({ columns: next });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Item text"
                  />
                  <RowActions
                    onMoveUp={() => {
                      const next = columns.slice();
                      next[colIdx] = { ...next[colIdx], items: moveItem(next[colIdx].items, itemIdx, itemIdx - 1) };
                      onUpdate({ columns: next });
                    }}
                    onMoveDown={() => {
                      const next = columns.slice();
                      next[colIdx] = { ...next[colIdx], items: moveItem(next[colIdx].items, itemIdx, itemIdx + 1) };
                      onUpdate({ columns: next });
                    }}
                    onRemove={() => {
                      const next = columns.slice();
                      next[colIdx] = { ...next[colIdx], items: next[colIdx].items.filter((_: any, i: number) => i !== itemIdx) };
                      onUpdate({ columns: next });
                    }}
                    canMoveUp={itemIdx > 0}
                    canMoveDown={itemIdx < c.items.length - 1}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const next = columns.slice();
                  next[colIdx] = { ...next[colIdx], items: [...next[colIdx].items, { text: '', type: 'neutral' }] };
                  onUpdate({ columns: next });
                }}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                + Add item
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onUpdate({ columns: [...columns, { header: '', highlight: false, items: [{ text: '', type: 'neutral' }] }] })}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          + Add column
        </button>
      </div>
    </div>
  );
}

function TimelineBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', events: [{ date: '', title: '', description: '', icon: '', image_url: '' }], orientation: 'vertical' }) as {
    title?: string;
    events?: Array<{ date: string; title: string; description: string; icon?: string; image_url?: string }>;
    orientation?: 'vertical' | 'horizontal';
  };
  const events = Array.isArray(data.events) && data.events.length ? data.events : [{ date: '', title: '', description: '', icon: '', image_url: '' }];
  if (!showProperties) {
    return (
      <div className="p-6 space-y-3">
        {data.title ? <h3 className="text-lg font-semibold text-gray-900">{data.title}</h3> : null}
        <div className="space-y-2">
          {events.map((e, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500">{e.date}</p>
              <p className="font-medium text-gray-900">{e.title}</p>
              <p className="text-sm text-gray-600 mt-1">{e.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </Field>
      <Field label="Orientation">
        <select value={data.orientation || 'vertical'} onChange={(e) => onUpdate({ orientation: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Events</p>
        {events.map((e, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Event {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ events: moveItem(events, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ events: moveItem(events, idx, idx + 1) })}
                onRemove={() => onUpdate({ events: events.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < events.length - 1}
              />
            </div>
            <Field label="Date">
              <input
                type="text"
                value={e.date || ''}
                onChange={(ev) => {
                  const next = events.slice();
                  next[idx] = { ...next[idx], date: ev.target.value };
                  onUpdate({ events: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <Field label="Title">
              <input
                type="text"
                value={e.title || ''}
                onChange={(ev) => {
                  const next = events.slice();
                  next[idx] = { ...next[idx], title: ev.target.value };
                  onUpdate({ events: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={e.description || ''}
                onChange={(ev) => {
                  const next = events.slice();
                  next[idx] = { ...next[idx], description: ev.target.value };
                  onUpdate({ events: next });
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Icon (optional)">
                <input
                  type="text"
                  value={e.icon || ''}
                  onChange={(ev) => {
                    const next = events.slice();
                    next[idx] = { ...next[idx], icon: ev.target.value };
                    onUpdate({ events: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
              <Field label="Image URL (optional)">
                <input
                  type="url"
                  value={e.image_url || ''}
                  onChange={(ev) => {
                    const next = events.slice();
                    next[idx] = { ...next[idx], image_url: ev.target.value };
                    onUpdate({ events: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://..."
                />
              </Field>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onUpdate({ events: [...events, { date: '', title: '', description: '', icon: '', image_url: '' }] })}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          + Add event
        </button>
      </div>
    </div>
  );
}

function ProcessFlowBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', steps: [{ id: '1', label: '', type: 'start', next: ['2'] }, { id: '2', label: '', type: 'end', next: [] }] }) as {
    title?: string;
    steps?: Array<{ id: string; label: string; type: 'start' | 'process' | 'decision' | 'end'; next?: string[] }>;
  };
  const steps = (Array.isArray(data.steps) && data.steps.length
    ? data.steps
    : [{ id: '1', label: '', type: 'start' as const, next: [] as string[] }]) as Array<{
    id: string;
    label: string;
    type: 'start' | 'process' | 'decision' | 'end';
    next?: string[];
  }>;
  if (!showProperties) {
    return (
      <div className="p-6">
        {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
        <div className="space-y-2">
          {steps.map((s) => (
            <div key={s.id} className="border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500">{s.type}</p>
              <p className="font-medium text-gray-900">{s.label}</p>
              {Array.isArray(s.next) && s.next.length ? <p className="text-xs text-gray-500 mt-1">Next: {s.next.join(', ')}</p> : null}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input type="text" value={data.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Steps</p>
        {steps.map((s, idx) => (
          <div key={s.id || idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Step {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ steps: moveItem(steps as any[], idx, idx - 1) as any })}
                onMoveDown={() => onUpdate({ steps: moveItem(steps as any[], idx, idx + 1) as any })}
                onRemove={() => onUpdate({ steps: steps.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < steps.length - 1}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="ID">
                <input
                  type="text"
                  value={s.id || ''}
                  onChange={(e) => {
                    const next = steps.slice();
                    next[idx] = { ...next[idx], id: e.target.value };
                    onUpdate({ steps: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
              <Field label="Type">
                <select
                  value={s.type}
                  onChange={(e) => {
                    const next = steps.slice();
                    next[idx] = { ...next[idx], type: e.target.value as any };
                    onUpdate({ steps: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="start">Start</option>
                  <option value="process">Process</option>
                  <option value="decision">Decision</option>
                  <option value="end">End</option>
                </select>
              </Field>
            </div>
            <Field label="Label">
              <input
                type="text"
                value={s.label || ''}
                onChange={(e) => {
                  const next = steps.slice();
                  next[idx] = { ...next[idx], label: e.target.value };
                  onUpdate({ steps: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <Field label="Next step IDs (comma-separated)">
              <input
                type="text"
                value={Array.isArray(s.next) ? s.next.join(', ') : ''}
                onChange={(e) => {
                  const nextIds = e.target.value
                    .split(',')
                    .map((x) => x.trim())
                    .filter(Boolean);
                  const next = steps.slice();
                  next[idx] = { ...next[idx], next: nextIds };
                  onUpdate({ steps: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., 2, 3"
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onUpdate({ steps: [...steps, { id: String(steps.length + 1), label: '', type: 'process', next: [] }] })}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          + Add step
        </button>
      </div>
    </div>
  );
}

function StatsBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { stats: [{ value: '', label: '', prefix: '', suffix: '', icon: '' }], layout: 'row' }) as {
    stats?: Array<{ value: string; label: string; prefix?: string; suffix?: string; icon?: string }>;
    layout?: 'row' | 'grid';
  };
  const stats = Array.isArray(data.stats) && data.stats.length ? data.stats : [{ value: '', label: '', prefix: '', suffix: '', icon: '' }];
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className={`grid gap-3 ${data.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {stats.slice(0, data.layout === 'grid' ? 4 : 3).map((s, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-gray-900">{`${s.prefix || ''}${s.value || ''}${s.suffix || ''}`}</p>
              <p className="text-xs text-gray-600 mt-1">{s.label || ''}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Layout">
        <select value={data.layout || 'row'} onChange={(e) => onUpdate({ layout: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="row">Row</option>
          <option value="grid">Grid</option>
        </select>
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Stats</p>
        {stats.map((s, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Stat {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ stats: moveItem(stats, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ stats: moveItem(stats, idx, idx + 1) })}
                onRemove={() => onUpdate({ stats: stats.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < stats.length - 1}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Value">
                <input
                  type="text"
                  value={s.value || ''}
                  onChange={(e) => {
                    const next = stats.slice();
                    next[idx] = { ...next[idx], value: e.target.value };
                    onUpdate({ stats: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
              <Field label="Label">
                <input
                  type="text"
                  value={s.label || ''}
                  onChange={(e) => {
                    const next = stats.slice();
                    next[idx] = { ...next[idx], label: e.target.value };
                    onUpdate({ stats: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Prefix (optional)">
                <input
                  type="text"
                  value={s.prefix || ''}
                  onChange={(e) => {
                    const next = stats.slice();
                    next[idx] = { ...next[idx], prefix: e.target.value };
                    onUpdate({ stats: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
              <Field label="Suffix (optional)">
                <input
                  type="text"
                  value={s.suffix || ''}
                  onChange={(e) => {
                    const next = stats.slice();
                    next[idx] = { ...next[idx], suffix: e.target.value };
                    onUpdate({ stats: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
              <Field label="Icon (optional)">
                <input
                  type="text"
                  value={s.icon || ''}
                  onChange={(e) => {
                    const next = stats.slice();
                    next[idx] = { ...next[idx], icon: e.target.value };
                    onUpdate({ stats: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., ✅"
                />
              </Field>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onUpdate({ stats: [...stats, { value: '', label: '', prefix: '', suffix: '', icon: '' }] })}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          + Add stat
        </button>
      </div>
    </div>
  );
}

function CalloutBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { type: 'tip', title: '', text: '' }) as { type?: 'tip' | 'warning' | 'note' | 'danger' | 'info' | 'success'; title?: string; text?: string };
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {data.title ? <p className="font-semibold text-gray-900 mb-1">{data.title}</p> : null}
          <p className="text-gray-700 whitespace-pre-wrap">{data.text}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Type">
        <select value={data.type || 'tip'} onChange={(e) => onUpdate({ type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="tip">Tip</option>
          <option value="warning">Warning</option>
          <option value="note">Note</option>
          <option value="danger">Danger</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
        </select>
      </Field>
      <Field label="Title (optional)">
        <input type="text" value={data.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <Field label="Content">
        <textarea value={data.text || ''} onChange={(e) => onUpdate({ text: e.target.value })} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
    </div>
  );
}

function HighlightBoxBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', text: '', color: 'blue', icon: '' }) as { title?: string; text?: string; color?: 'blue' | 'green' | 'yellow' | 'purple' | 'gray'; icon?: string };
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4 bg-primary-50">
          {(data.icon || data.title) ? <p className="font-semibold text-gray-900 mb-1">{data.icon ? `${data.icon} ` : ''}{data.title}</p> : null}
          <p className="text-gray-700 whitespace-pre-wrap">{data.text}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input type="text" value={data.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <Field label="Icon (optional)">
        <input type="text" value={data.icon || ''} onChange={(e) => onUpdate({ icon: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 📌" />
      </Field>
      <Field label="Text">
        <textarea value={data.text || ''} onChange={(e) => onUpdate({ text: e.target.value })} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <Field label="Color">
        <select value={data.color || 'blue'} onChange={(e) => onUpdate({ color: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="purple">Purple</option>
          <option value="gray">Gray</option>
        </select>
      </Field>
    </div>
  );
}

function GlossaryBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', terms: [{ term: '', definition: '' }], searchable: true, alphabetized: true }) as {
    title?: string;
    terms?: Array<{ term: string; definition: string }>;
    searchable?: boolean;
    alphabetized?: boolean;
  };
  const terms = Array.isArray(data.terms) && data.terms.length ? data.terms : [{ term: '', definition: '' }];
  if (!showProperties) {
    return (
      <div className="p-6">
        {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-4">{data.title}</h3> : null}
        <dl className="space-y-3">
          {terms.map((t, i) => (
            <div key={i}>
              <dt className="font-semibold text-gray-900 mb-1">{t.term}</dt>
              <dd className="text-gray-700 ml-4">{t.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input type="text" value={data.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Searchable</label>
        <input type="checkbox" checked={data.searchable ?? true} onChange={(e) => onUpdate({ searchable: e.target.checked })} className="w-5 h-5 text-primary-500 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Alphabetized</label>
        <input type="checkbox" checked={data.alphabetized ?? true} onChange={(e) => onUpdate({ alphabetized: e.target.checked })} className="w-5 h-5 text-primary-500 rounded" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Terms</p>
        {terms.map((t, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Term {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ terms: moveItem(terms, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ terms: moveItem(terms, idx, idx + 1) })}
                onRemove={() => onUpdate({ terms: terms.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < terms.length - 1}
              />
            </div>
            <Field label="Term">
              <input
                type="text"
                value={t.term || ''}
                onChange={(e) => {
                  const next = terms.slice();
                  next[idx] = { ...next[idx], term: e.target.value };
                  onUpdate({ terms: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <Field label="Definition">
              <textarea
                value={t.definition || ''}
                onChange={(e) => {
                  const next = terms.slice();
                  next[idx] = { ...next[idx], definition: e.target.value };
                  onUpdate({ terms: next });
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ terms: [...terms, { term: '', definition: '' }] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add term
        </button>
      </div>
    </div>
  );
}

function DefinitionBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { term: '', definition: '', pronunciation: '' }) as { term?: string; definition?: string; pronunciation?: string };
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="font-semibold text-gray-900">
            {data.term} {data.pronunciation ? <span className="text-sm text-gray-500 font-normal">{data.pronunciation}</span> : null}
          </p>
          <p className="text-gray-700 mt-1 whitespace-pre-wrap">{data.definition}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Term">
        <input type="text" value={data.term || ''} onChange={(e) => onUpdate({ term: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <Field label="Pronunciation (optional)">
        <input
          type="text"
          value={data.pronunciation || ''}
          onChange={(e) => onUpdate({ pronunciation: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="/ˈempəTHē/"
        />
      </Field>
      <Field label="Definition">
        <textarea value={data.definition || ''} onChange={(e) => onUpdate({ definition: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
    </div>
  );
}

function CodeBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { language: 'javascript', code: '', filename: '', show_line_numbers: true, highlight_lines: [] }) as {
    language?: string;
    code?: string;
    filename?: string;
    show_line_numbers?: boolean;
    highlight_lines?: number[];
  };
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <p className="text-xs text-gray-300 mb-2">{data.filename || data.language || 'code'}</p>
          <pre className="text-sm text-gray-100 whitespace-pre-wrap">
            <code>{data.code || ''}</code>
          </pre>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Language">
          <input type="text" value={data.language || ''} onChange={(e) => onUpdate({ language: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="javascript" />
        </Field>
        <Field label="Filename (optional)">
          <input type="text" value={data.filename || ''} onChange={(e) => onUpdate({ filename: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="example.js" />
        </Field>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Show line numbers</label>
        <input type="checkbox" checked={data.show_line_numbers ?? true} onChange={(e) => onUpdate({ show_line_numbers: e.target.checked })} className="w-5 h-5 text-primary-500 rounded" />
      </div>
      <Field label="Highlight lines (comma-separated)">
        <input
          type="text"
          value={Array.isArray(data.highlight_lines) ? data.highlight_lines.join(', ') : ''}
          onChange={(e) => {
            const nums = e.target.value
              .split(',')
              .map((x) => Number(x.trim()))
              .filter((n) => Number.isFinite(n));
            onUpdate({ highlight_lines: nums });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="e.g., 2, 5"
        />
      </Field>
      <Field label="Code">
        <textarea value={data.code || ''} onChange={(e) => onUpdate({ code: e.target.value })} rows={10} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm" />
      </Field>
    </div>
  );
}

function FormulaBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { latex: '', caption: '' }) as { latex?: string; caption?: string };
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="font-mono text-gray-900 whitespace-pre-wrap">{data.latex}</p>
          {data.caption ? <p className="text-sm text-gray-600 mt-2">{data.caption}</p> : null}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="LaTeX">
        <textarea value={data.latex || ''} onChange={(e) => onUpdate({ latex: e.target.value })} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm" />
      </Field>
      <Field label="Caption (optional)">
        <input type="text" value={data.caption || ''} onChange={(e) => onUpdate({ caption: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
    </div>
  );
}

function CitationBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { text: '', source: { author: '', title: '', year: new Date().getFullYear(), url: '' } }) as {
    text?: string;
    source?: { author: string; title: string; year: number; url?: string };
  };
  const source = data.source || { author: '', title: '', year: new Date().getFullYear(), url: '' };
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-gray-800">{data.text}</p>
          <p className="text-xs text-gray-500 mt-2">
            {source.author} • {source.title} • {source.year}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Citation text">
        <textarea value={data.text || ''} onChange={(e) => onUpdate({ text: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Author">
          <input
            type="text"
            value={source.author || ''}
            onChange={(e) => onUpdate({ source: { ...source, author: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </Field>
        <Field label="Year">
          <input
            type="number"
            value={Number.isFinite(Number(source.year)) ? Number(source.year) : new Date().getFullYear()}
            onChange={(e) => onUpdate({ source: { ...source, year: Number(e.target.value || new Date().getFullYear()) } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </Field>
      </div>
      <Field label="Title">
        <input type="text" value={source.title || ''} onChange={(e) => onUpdate({ source: { ...source, title: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <Field label="URL (optional)">
        <input
          type="url"
          value={source.url || ''}
          onChange={(e) => onUpdate({ source: { ...source, url: e.target.value } })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="https://..."
        />
      </Field>
    </div>
  );
}

function KnowledgeCheckBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { question: '', type: 'multiple_choice', options: [''], correct_answer: 0, explanation: '' }) as {
    question?: string;
    type?: 'multiple_choice' | 'true_false';
    options?: string[];
    correct_answer?: number | string;
    explanation?: string;
  };
  const options = Array.isArray(data.options) && data.options.length ? data.options : [''];
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Knowledge check</p>
          <p className="font-medium text-gray-900">{data.question}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Question">
        <textarea value={data.question || ''} onChange={(e) => onUpdate({ question: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <Field label="Type">
        <select value={data.type || 'multiple_choice'} onChange={(e) => onUpdate({ type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="multiple_choice">Multiple choice</option>
          <option value="true_false">True / False</option>
        </select>
      </Field>
      {data.type !== 'true_false' ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Options</p>
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="radio"
                name={`kc-correct-${block.id}`}
                checked={Number(data.correct_answer) === idx}
                onChange={() => onUpdate({ correct_answer: idx })}
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => {
                  const next = options.slice();
                  next[idx] = e.target.value;
                  onUpdate({ options: next });
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder={`Option ${idx + 1}`}
              />
              <RowActions
                onMoveUp={() => onUpdate({ options: moveItem(options, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ options: moveItem(options, idx, idx + 1) })}
                onRemove={() => onUpdate({ options: options.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < options.length - 1}
              />
            </div>
          ))}
          <button type="button" onClick={() => onUpdate({ options: [...options, ''] })} className="text-sm text-primary-600 hover:text-primary-700">
            + Add option
          </button>
          <p className="text-xs text-gray-500">Select the correct option using the radio button.</p>
        </div>
      ) : (
        <Field label="Correct answer">
          <select value={String(data.correct_answer ?? 'true')} onChange={(e) => onUpdate({ correct_answer: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </Field>
      )}
      <Field label="Explanation">
        <textarea value={data.explanation || ''} onChange={(e) => onUpdate({ explanation: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
    </div>
  );
}

function ReflectionBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { prompt: '', allow_response: true, response_placeholder: 'Write your reflection here...', min_words: 0 }) as {
    prompt?: string;
    allow_response?: boolean;
    response_placeholder?: string;
    min_words?: number;
  };
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Reflection</p>
          <p className="text-gray-800 whitespace-pre-wrap">{data.prompt}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Prompt">
        <textarea value={data.prompt || ''} onChange={(e) => onUpdate({ prompt: e.target.value })} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Allow learner response</label>
        <input type="checkbox" checked={data.allow_response ?? true} onChange={(e) => onUpdate({ allow_response: e.target.checked })} className="w-5 h-5 text-primary-500 rounded" />
      </div>
      {data.allow_response && (
        <>
          <Field label="Response placeholder (optional)">
            <input
              type="text"
              value={data.response_placeholder || ''}
              onChange={(e) => onUpdate({ response_placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </Field>
          <Field label="Minimum words (optional)">
            <input
              type="number"
              min={0}
              value={Number.isFinite(Number(data.min_words)) ? Number(data.min_words) : 0}
              onChange={(e) => onUpdate({ min_words: Number(e.target.value || 0) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </Field>
        </>
      )}
    </div>
  );
}

function PollBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { question: '', options: [''], show_results: true, allow_multiple: false }) as {
    question?: string;
    options?: string[];
    show_results?: boolean;
    allow_multiple?: boolean;
  };
  const options = Array.isArray(data.options) && data.options.length ? data.options : [''];
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="font-medium text-gray-900">{data.question}</p>
          <p className="text-sm text-gray-600 mt-2">{options.length} option(s)</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Question">
        <textarea value={data.question || ''} onChange={(e) => onUpdate({ question: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Allow multiple selections</label>
        <input type="checkbox" checked={!!data.allow_multiple} onChange={(e) => onUpdate({ allow_multiple: e.target.checked })} className="w-5 h-5 text-primary-500 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Show results</label>
        <input type="checkbox" checked={data.show_results ?? true} onChange={(e) => onUpdate({ show_results: e.target.checked })} className="w-5 h-5 text-primary-500 rounded" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Options</p>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={opt}
              onChange={(e) => {
                const next = options.slice();
                next[idx] = e.target.value;
                onUpdate({ options: next });
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder={`Option ${idx + 1}`}
            />
            <RowActions
              onMoveUp={() => onUpdate({ options: moveItem(options, idx, idx - 1) })}
              onMoveDown={() => onUpdate({ options: moveItem(options, idx, idx + 1) })}
              onRemove={() => onUpdate({ options: options.filter((_, i) => i !== idx) })}
              canMoveUp={idx > 0}
              canMoveDown={idx < options.length - 1}
            />
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ options: [...options, ''] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add option
        </button>
      </div>
    </div>
  );
}

function DiscussionPromptBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { prompt: '', allow_comments: true, require_response: false }) as {
    prompt?: string;
    allow_comments?: boolean;
    require_response?: boolean;
  };
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-gray-800 whitespace-pre-wrap">{data.prompt}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Prompt">
        <textarea value={data.prompt || ''} onChange={(e) => onUpdate({ prompt: e.target.value })} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Allow comments</label>
        <input type="checkbox" checked={data.allow_comments ?? true} onChange={(e) => onUpdate({ allow_comments: e.target.checked })} className="w-5 h-5 text-primary-500 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Require response</label>
        <input type="checkbox" checked={!!data.require_response} onChange={(e) => onUpdate({ require_response: e.target.checked })} className="w-5 h-5 text-primary-500 rounded" />
      </div>
    </div>
  );
}

function ScenarioBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', situation: '', image_url: '', question: '', options: [{ text: '', feedback: '', is_best: false }] }) as {
    title?: string;
    situation?: string;
    image_url?: string;
    question?: string;
    options?: Array<{ text: string; feedback: string; is_best: boolean }>;
  };
  const options = Array.isArray(data.options) && data.options.length ? data.options : [{ text: '', feedback: '', is_best: false }];
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="font-semibold text-gray-900">{data.title}</p>
          <p className="text-gray-700 mt-2 whitespace-pre-wrap">{data.situation}</p>
          <p className="font-medium text-gray-900 mt-3">{data.question}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title">
        <input type="text" value={data.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <Field label="Situation">
        <textarea value={data.situation || ''} onChange={(e) => onUpdate({ situation: e.target.value })} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <Field label="Image URL (optional)">
        <input type="url" value={data.image_url || ''} onChange={(e) => onUpdate({ image_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="https://..." />
      </Field>
      <Field label="Question">
        <input type="text" value={data.question || ''} onChange={(e) => onUpdate({ question: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Options</p>
        {options.map((opt, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Option {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ options: moveItem(options, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ options: moveItem(options, idx, idx + 1) })}
                onRemove={() => onUpdate({ options: options.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < options.length - 1}
              />
            </div>
            <Field label="Option text">
              <input
                type="text"
                value={opt.text || ''}
                onChange={(e) => {
                  const next = options.slice();
                  next[idx] = { ...next[idx], text: e.target.value };
                  onUpdate({ options: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <Field label="Feedback">
              <textarea
                value={opt.feedback || ''}
                onChange={(e) => {
                  const next = options.slice();
                  next[idx] = { ...next[idx], feedback: e.target.value };
                  onUpdate({ options: next });
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Mark as best answer</label>
              <input
                type="radio"
                name={`scenario-best-${block.id}`}
                checked={!!opt.is_best}
                onChange={() => {
                  const next = options.map((o, i) => ({ ...o, is_best: i === idx }));
                  onUpdate({ options: next });
                }}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ options: [...options, { text: '', feedback: '', is_best: false }] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add option
        </button>
      </div>
    </div>
  );
}

function DragDropBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', type: 'match', items: [{ id: '1', content: '' }], targets: [{ id: 'a', label: '', correct_items: ['1'] }], correct_order: [] }) as {
    title?: string;
    type?: 'match' | 'sort' | 'order';
    items?: Array<{ id: string; content: string }>;
    targets?: Array<{ id: string; label: string; correct_items: string[] }>;
    correct_order?: string[];
  };
  const items = Array.isArray(data.items) && data.items.length ? data.items : [{ id: '1', content: '' }];
  const targets = Array.isArray(data.targets) ? data.targets : [];
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="font-semibold text-gray-900">{data.title || 'Drag & drop'}</p>
          <p className="text-sm text-gray-600 mt-1">Type: {data.type}</p>
          <p className="text-sm text-gray-600 mt-1">{items.length} item(s)</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input type="text" value={data.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <Field label="Type">
        <select value={data.type || 'match'} onChange={(e) => onUpdate({ type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="match">Match</option>
          <option value="sort">Sort</option>
          <option value="order">Order</option>
        </select>
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Items</p>
        {items.map((it, idx) => (
          <div key={it.id || idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Item {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ items: moveItem(items, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ items: moveItem(items, idx, idx + 1) })}
                onRemove={() => onUpdate({ items: items.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < items.length - 1}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="ID">
                <input
                  type="text"
                  value={it.id || ''}
                  onChange={(e) => {
                    const next = items.slice();
                    next[idx] = { ...next[idx], id: e.target.value };
                    onUpdate({ items: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
              <Field label="Content">
                <input
                  type="text"
                  value={it.content || ''}
                  onChange={(e) => {
                    const next = items.slice();
                    next[idx] = { ...next[idx], content: e.target.value };
                    onUpdate({ items: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ items: [...items, { id: String(items.length + 1), content: '' }] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add item
        </button>
      </div>

      {(data.type === 'match' || data.type === 'sort') && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Targets</p>
          {targets.map((t, idx) => (
            <div key={t.id || idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Target {idx + 1}</p>
                <RowActions
                  onMoveUp={() => onUpdate({ targets: moveItem(targets, idx, idx - 1) })}
                  onMoveDown={() => onUpdate({ targets: moveItem(targets, idx, idx + 1) })}
                  onRemove={() => onUpdate({ targets: targets.filter((_, i) => i !== idx) })}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < targets.length - 1}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="ID">
                  <input
                    type="text"
                    value={t.id || ''}
                    onChange={(e) => {
                      const next = targets.slice();
                      next[idx] = { ...next[idx], id: e.target.value };
                      onUpdate({ targets: next });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </Field>
                <Field label="Label">
                  <input
                    type="text"
                    value={t.label || ''}
                    onChange={(e) => {
                      const next = targets.slice();
                      next[idx] = { ...next[idx], label: e.target.value };
                      onUpdate({ targets: next });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </Field>
              </div>
              <Field label="Correct item IDs (comma-separated)">
                <input
                  type="text"
                  value={Array.isArray(t.correct_items) ? t.correct_items.join(', ') : ''}
                  onChange={(e) => {
                    const ids = e.target.value
                      .split(',')
                      .map((x) => x.trim())
                      .filter(Boolean);
                    const next = targets.slice();
                    next[idx] = { ...next[idx], correct_items: ids };
                    onUpdate({ targets: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
            </div>
          ))}
          <button type="button" onClick={() => onUpdate({ targets: [...targets, { id: String(targets.length + 1), label: '', correct_items: [] }] })} className="text-sm text-primary-600 hover:text-primary-700">
            + Add target
          </button>
        </div>
      )}

      {data.type === 'order' && (
        <Field label="Correct order (comma-separated item IDs)">
          <input
            type="text"
            value={Array.isArray(data.correct_order) ? data.correct_order.join(', ') : ''}
            onChange={(e) => onUpdate({ correct_order: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., 1, 2, 3"
          />
        </Field>
      )}
    </div>
  );
}

function TwoColumnBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { left: { type: 'text', content: '' }, right: { type: 'text', content: '' }, ratio: '50-50', vertical_align: 'top' }) as any;
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-3">{data.left?.type === 'image' ? <img src={data.left?.content} alt="" className="w-full rounded-lg" /> : <p className="text-gray-700 whitespace-pre-wrap">{data.left?.content}</p>}</div>
          <div className="border border-gray-200 rounded-lg p-3">{data.right?.type === 'image' ? <img src={data.right?.content} alt="" className="w-full rounded-lg" /> : <p className="text-gray-700 whitespace-pre-wrap">{data.right?.content}</p>}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Ratio">
        <select value={data.ratio || '50-50'} onChange={(e) => onUpdate({ ratio: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="50-50">50 / 50</option>
          <option value="30-70">30 / 70</option>
          <option value="70-30">70 / 30</option>
        </select>
      </Field>
      <Field label="Vertical align">
        <select value={data.vertical_align || 'top'} onChange={(e) => onUpdate({ vertical_align: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="top">Top</option>
          <option value="center">Center</option>
          <option value="bottom">Bottom</option>
        </select>
      </Field>
      <div className="grid grid-cols-1 gap-4">
        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
          <p className="text-sm font-semibold text-gray-900">Left column</p>
          <Field label="Type">
            <select
              value={data.left?.type || 'text'}
              onChange={(e) => onUpdate({ left: { ...(data.left || {}), type: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
          </Field>
          <Field label={data.left?.type === 'image' ? 'Image URL' : 'Text'}>
            {data.left?.type === 'image' ? (
              <input
                type="url"
                value={data.left?.content || ''}
                onChange={(e) => onUpdate({ left: { ...(data.left || {}), content: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            ) : (
              <textarea
                value={data.left?.content || ''}
                onChange={(e) => onUpdate({ left: { ...(data.left || {}), content: e.target.value } })}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            )}
          </Field>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
          <p className="text-sm font-semibold text-gray-900">Right column</p>
          <Field label="Type">
            <select
              value={data.right?.type || 'text'}
              onChange={(e) => onUpdate({ right: { ...(data.right || {}), type: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>
          </Field>
          <Field label={data.right?.type === 'image' ? 'Image URL' : 'Text'}>
            {data.right?.type === 'image' ? (
              <input
                type="url"
                value={data.right?.content || ''}
                onChange={(e) => onUpdate({ right: { ...(data.right || {}), content: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            ) : (
              <textarea
                value={data.right?.content || ''}
                onChange={(e) => onUpdate({ right: { ...(data.right || {}), content: e.target.value } })}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            )}
          </Field>
        </div>
      </div>
    </div>
  );
}

function ThreeColumnBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { columns: [{ title: '', icon: '', content: '' }, { title: '', icon: '', content: '' }, { title: '', icon: '', content: '' }] }) as {
    columns?: Array<{ title?: string; icon?: string; content: string }>;
  };
  const columns = Array.isArray(data.columns) && data.columns.length ? data.columns : [{ title: '', icon: '', content: '' }];
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.slice(0, 3).map((c, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <p className="font-semibold text-gray-900">{c.icon ? `${c.icon} ` : ''}{c.title}</p>
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Columns</p>
        {columns.map((c, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Column {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ columns: moveItem(columns, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ columns: moveItem(columns, idx, idx + 1) })}
                onRemove={() => onUpdate({ columns: columns.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < columns.length - 1}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title (optional)">
                <input
                  type="text"
                  value={c.title || ''}
                  onChange={(e) => {
                    const next = columns.slice();
                    next[idx] = { ...next[idx], title: e.target.value };
                    onUpdate({ columns: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </Field>
              <Field label="Icon (optional)">
                <input
                  type="text"
                  value={c.icon || ''}
                  onChange={(e) => {
                    const next = columns.slice();
                    next[idx] = { ...next[idx], icon: e.target.value };
                    onUpdate({ columns: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., ✅"
                />
              </Field>
            </div>
            <Field label="Content">
              <textarea
                value={c.content || ''}
                onChange={(e) => {
                  const next = columns.slice();
                  next[idx] = { ...next[idx], content: e.target.value };
                  onUpdate({ columns: next });
                }}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ columns: [...columns, { title: '', icon: '', content: '' }] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add column
        </button>
      </div>
    </div>
  );
}

function CardGridBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { title: '', cards: [{ title: '', description: '', image_url: '', link_url: '', link_text: '' }], columns: 2 }) as {
    title?: string;
    cards?: Array<{ title: string; description: string; image_url?: string; link_url?: string; link_text?: string }>;
    columns?: 2 | 3 | 4;
  };
  const cards = Array.isArray(data.cards) && data.cards.length ? data.cards : [{ title: '', description: '', image_url: '', link_url: '', link_text: '' }];
  if (!showProperties) {
    return (
      <div className="p-6 space-y-3">
        {data.title ? <h3 className="text-lg font-semibold text-gray-900">{data.title}</h3> : null}
        <div className={`grid gap-3 ${data.columns === 2 ? 'grid-cols-2' : data.columns === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
          {cards.slice(0, 4).map((c, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3">
              <p className="font-medium text-gray-900">{c.title}</p>
              <p className="text-sm text-gray-600 mt-1">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Title (optional)">
        <input type="text" value={data.title || ''} onChange={(e) => onUpdate({ title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </Field>
      <Field label="Columns">
        <select value={data.columns || 2} onChange={(e) => onUpdate({ columns: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </Field>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Cards</p>
        {cards.map((c, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Card {idx + 1}</p>
              <RowActions
                onMoveUp={() => onUpdate({ cards: moveItem(cards, idx, idx - 1) })}
                onMoveDown={() => onUpdate({ cards: moveItem(cards, idx, idx + 1) })}
                onRemove={() => onUpdate({ cards: cards.filter((_, i) => i !== idx) })}
                canMoveUp={idx > 0}
                canMoveDown={idx < cards.length - 1}
              />
            </div>
            <Field label="Title">
              <input
                type="text"
                value={c.title || ''}
                onChange={(e) => {
                  const next = cards.slice();
                  next[idx] = { ...next[idx], title: e.target.value };
                  onUpdate({ cards: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={c.description || ''}
                onChange={(e) => {
                  const next = cards.slice();
                  next[idx] = { ...next[idx], description: e.target.value };
                  onUpdate({ cards: next });
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </Field>
            <Field label="Image URL (optional)">
              <input
                type="url"
                value={c.image_url || ''}
                onChange={(e) => {
                  const next = cards.slice();
                  next[idx] = { ...next[idx], image_url: e.target.value };
                  onUpdate({ cards: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://..."
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Link URL (optional)">
                <input
                  type="url"
                  value={c.link_url || ''}
                  onChange={(e) => {
                    const next = cards.slice();
                    next[idx] = { ...next[idx], link_url: e.target.value };
                    onUpdate({ cards: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://..."
                />
              </Field>
              <Field label="Link text (optional)">
                <input
                  type="text"
                  value={c.link_text || ''}
                  onChange={(e) => {
                    const next = cards.slice();
                    next[idx] = { ...next[idx], link_text: e.target.value };
                    onUpdate({ cards: next });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Download PDF"
                />
              </Field>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => onUpdate({ cards: [...cards, { title: '', description: '', image_url: '', link_url: '', link_text: '' }] })} className="text-sm text-primary-600 hover:text-primary-700">
          + Add card
        </button>
      </div>
    </div>
  );
}

function SpacerBlock({ block, onUpdate, showProperties }: Omit<ContentBlockProps, 'onDelete' | 'onDuplicate'> & { onUpdate: (data: any) => void }) {
  const data = (block.data || { height: 'medium' }) as { height?: 'small' | 'medium' | 'large' | 'xlarge' };
  if (!showProperties) {
    return (
      <div className="p-6">
        <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500">Spacer ({data.height || 'medium'})</div>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <Field label="Height">
        <select value={data.height || 'medium'} onChange={(e) => onUpdate({ height: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="xlarge">XLarge</option>
        </select>
      </Field>
    </div>
  );
}

