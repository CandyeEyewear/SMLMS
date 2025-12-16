'use client';

import { useEffect, useMemo, useState } from 'react';
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

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return '{\n}';
  }
}

function JsonEditorBlock({
  block,
  onUpdate,
  showProperties,
  defaultData,
  preview,
}: {
  block: ContentBlockType;
  onUpdate: (data: any) => void;
  showProperties: boolean;
  defaultData: any;
  preview: ReactNode;
}) {
  const initial = useMemo(() => safeJsonStringify(block.data ?? defaultData), [block.data, defaultData]);
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(initial);
    setError(null);
  }, [initial]);

  if (showProperties) {
    return (
      <div className="p-4 space-y-3">
        <p className="text-xs text-gray-500">
          Edit this block as JSON. (This matches the structures in <span className="font-mono">CONTENT_BLOCKS_REFERENCE.md</span>.)
        </p>
        <textarea
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          rows={14}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-xs"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              try {
                const parsed = JSON.parse(draft);
                onUpdate(parsed);
                setError(null);
              } catch (e: any) {
                setError(e?.message || 'Invalid JSON');
              }
            }}
            className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(safeJsonStringify(defaultData));
              setError(null);
            }}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
          >
            Reset template
          </button>
        </div>
      </div>
    );
  }

  return <div className="p-6">{preview}</div>;
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

// ---- Additional block types (JSON-template editors + simple previews) ----

function HeadingBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const text = data.text || 'Heading text';
  const level = data.level || 2;
  const preview = (
    <div>
      <p className="text-xs text-gray-500 mb-2">Heading (H{level})</p>
      <p className="font-semibold text-gray-900 text-xl">{text}</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ text: '', level: 2 }}
      preview={preview}
    />
  );
}

function QuoteBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <blockquote className="border-l-4 border-primary-500 pl-4 py-2 italic text-gray-700">
      <p className="mb-2">&quot;{data.text || 'Quote text'}&quot;</p>
      {(data.author || data.source) && (
        <footer className="text-sm text-gray-600">
          — {data.author || 'Author'}
          {data.source ? <span className="text-gray-500">, {data.source}</span> : null}
        </footer>
      )}
    </blockquote>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ text: '', author: '', source: '', style: 'default' }}
      preview={preview}
    />
  );
}

function DividerBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const style = data.style || 'line';
  const preview = (
    <div className="py-2">
      <p className="text-xs text-gray-500 mb-2">Divider ({style})</p>
      <div className="border-t border-gray-200" />
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ style: 'line', spacing: 'medium' }}
      preview={preview}
    />
  );
}

function BulletListBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const items = asArray<string>(data.items, []);
  const preview = (
    <div>
      {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {(items.length ? items : ['List item 1', 'List item 2']).map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', items: [''], style: 'disc' }}
      preview={preview}
    />
  );
}

function NumberedListBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const items = asArray<string>(data.items, []);
  const start = Number.isFinite(Number(data.start)) ? Number(data.start) : 1;
  const preview = (
    <div>
      {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
      <ol className="list-decimal list-inside space-y-1 text-gray-700" start={start}>
        {(items.length ? items : ['Item 1', 'Item 2']).map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ol>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', items: [''], start: 1 }}
      preview={preview}
    />
  );
}

function NumberedStepsBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const steps = asArray<any>(data.steps, []);
  const preview = (
    <div>
      {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-4">{data.title}</h3> : null}
      <ol className="list-decimal list-inside space-y-3">
        {(steps.length ? steps : [{ title: 'Step 1', description: 'Describe the step...' }]).map((s, i) => (
          <li key={i} className="text-gray-700">
            <span className="font-medium">{s.title || `Step ${i + 1}`}</span>
            {s.description ? <p className="ml-6 text-gray-600">{s.description}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', steps: [{ title: '', description: '', image_url: '' }] }}
      preview={preview}
    />
  );
}

function ChecklistBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const items = asArray<any>(data.items, []);
  const preview = (
    <div>
      {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
      <div className="space-y-2">
        {(items.length ? items : [{ text: 'Checklist item', checked: false }]).map((it, i) => (
          <label key={i} className="flex items-center gap-3">
            <input type="checkbox" checked={!!it.checked} readOnly className="w-5 h-5 text-primary-500 rounded" />
            <span className="text-gray-700">{it.text || `Item ${i + 1}`}</span>
          </label>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">allow_interaction: {String(!!data.allow_interaction)}</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', items: [{ text: '', checked: false }], allow_interaction: true }}
      preview={preview}
    />
  );
}

function ImageGalleryBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const images = asArray<any>(data.images, []);
  const preview = (
    <div>
      {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
      <div className="grid grid-cols-2 gap-3">
        {(images.length ? images : [{ url: '', alt: '' }, { url: '', alt: '' }]).slice(0, 4).map((img, i) => (
          <div key={i} className="bg-gray-100 rounded-lg border border-gray-200 aspect-video flex items-center justify-center overflow-hidden">
            {img.url ? <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-500">Image {i + 1}</span>}
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', images: [{ url: '', alt: '', caption: '' }], layout: 'grid', columns: 3 }}
      preview={preview}
    />
  );
}

function AudioBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-sm font-medium text-gray-900">{data.title || 'Audio'}</p>
      {data.url ? <audio src={data.url} controls className="w-full mt-2" /> : <p className="text-sm text-gray-500 mt-2">Add an audio URL</p>}
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ url: '', title: '', duration_seconds: 0, show_transcript: false, transcript: '' }}
      preview={preview}
    />
  );
}

function FileDownloadBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
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
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ url: '', filename: '', file_type: 'pdf', file_size_bytes: 0, description: '' }}
      preview={preview}
    />
  );
}

function AccordionBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const items = asArray<any>(data.items ?? data.sections, []);
  const preview = (
    <div>
      {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
      <div className="space-y-2">
        {(items.length ? items : [{ title: 'Accordion item', content: 'Item content...' }]).slice(0, 4).map((it, i) => (
          <div key={i} className="border border-gray-200 rounded-lg">
            <div className="px-4 py-3 font-medium text-gray-900">{it.title || `Item ${i + 1}`}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">allow_multiple_open: {String(!!data.allow_multiple_open)}</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', items: [{ title: '', content: '', default_open: false }], allow_multiple_open: false }}
      preview={preview}
    />
  );
}

function TabsBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const tabs = asArray<any>(data.tabs, []);
  const preview = (
    <div>
      <div className="flex gap-2 border-b border-gray-200 mb-3">
        {(tabs.length ? tabs : [{ label: 'Tab 1', content: '' }, { label: 'Tab 2', content: '' }]).slice(0, 3).map((t, i) => (
          <div key={i} className="px-3 py-2 text-sm font-medium text-gray-700">
            {t.label || t.title || `Tab ${i + 1}`}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600">Edit tabs in properties.</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ tabs: [{ label: '', icon: '', content: '' }], default_tab: 0 }}
      preview={preview}
    />
  );
}

function FlashcardBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-xs text-gray-500 mb-2">Flashcard</p>
      <p className="font-medium text-gray-900">{data.front?.text || 'Front'}</p>
      <p className="text-sm text-gray-600 mt-2">{data.back?.text || 'Back'}</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ front: { text: '', image_url: '' }, back: { text: '', image_url: '' } }}
      preview={preview}
    />
  );
}

function FlashcardDeckBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const cards = asArray<any>(data.cards, []);
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="font-semibold text-gray-900">{data.title || 'Flashcard deck'}</p>
      <p className="text-sm text-gray-600 mt-1">{cards.length || 0} card(s)</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', cards: [{ front: '', back: '' }], shuffle: false, show_progress: true }}
      preview={preview}
    />
  );
}

function HotspotImageBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const hotspots = asArray<any>(data.hotspots, []);
  const preview = (
    <div>
      {data.image_url ? (
        <div className="relative inline-block w-full">
          <img src={data.image_url} alt={data.image_alt || ''} className="w-full rounded-lg border border-gray-200" />
          <div className="absolute inset-0">
            {hotspots.slice(0, 6).map((h, i) => (
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
          Add image_url + hotspots in properties
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">{hotspots.length || 0} hotspot(s)</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ image_url: '', image_alt: '', hotspots: [{ id: '1', x: 25, y: 30, title: '', description: '', image_url: '' }] }}
      preview={preview}
    />
  );
}

function SliderBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const slides = asArray<any>(data.slides, []);
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="font-semibold text-gray-900">{data.title || 'Slider'}</p>
      <p className="text-sm text-gray-600 mt-1">{slides.length || 0} slide(s)</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', slides: [{ title: '', content: '', image_url: '' }], auto_play: false, show_dots: true, show_arrows: true }}
      preview={preview}
    />
  );
}

function RevealBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="font-medium text-gray-900">{data.prompt || 'Reveal prompt'}</p>
      <p className="text-sm text-gray-600 mt-2">Hidden content: {data.hidden_content ? 'configured' : 'not set'}</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ prompt: '', hidden_content: '', button_text: 'Reveal Answer', style: 'button' }}
      preview={preview}
    />
  );
}

function TableBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const headers = asArray<string>(data.headers, []);
  const rows = asArray<any>(data.rows, []);
  const preview = (
    <div>
      {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {(headers.length ? headers : ['Header 1', 'Header 2']).map((h, i) => (
                <th key={i} className="px-3 py-2 text-left font-medium text-gray-700 border-b">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(rows.length ? rows : [['Cell 1', 'Cell 2']]).slice(0, 5).map((r, ri) => (
              <tr key={ri}>
                {asArray<string>(r, []).map((c, ci) => (
                  <td key={ci} className="px-3 py-2 text-gray-700 border-b">{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', headers: [''], rows: [['']], striped: true, highlight_first_column: false }}
      preview={preview}
    />
  );
}

function ComparisonBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const cols = asArray<any>(data.columns, []);
  const preview = (
    <div>
      {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
      <div className="grid grid-cols-2 gap-3">
        {(cols.length ? cols : [{ header: 'Option A', items: [] }, { header: 'Option B', items: [] }]).slice(0, 2).map((c, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3">
            <p className="font-medium text-gray-900">{c.header || `Column ${i + 1}`}</p>
            <p className="text-xs text-gray-500 mt-1">{asArray<any>(c.items, []).length} item(s)</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">Edit full comparison structure in properties.</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', columns: [{ header: '', highlight: false, items: [{ text: '', type: 'neutral' }] }, { header: '', highlight: false, items: [{ text: '', type: 'neutral' }] }] }}
      preview={preview}
    />
  );
}

function TimelineBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const events = asArray<any>(data.events, []);
  const preview = (
    <div>
      {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
      <div className="space-y-2">
        {(events.length ? events : [{ date: 'Date', title: 'Event', description: '' }]).slice(0, 4).map((e, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">{e.date || ''}</p>
            <p className="font-medium text-gray-900">{e.title || `Event ${i + 1}`}</p>
            {e.description ? <p className="text-sm text-gray-600 mt-1">{e.description}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', events: [{ date: '', title: '', description: '', icon: '', image_url: '' }], orientation: 'vertical' }}
      preview={preview}
    />
  );
}

function ProcessFlowBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const steps = asArray<any>(data.steps, []);
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="font-semibold text-gray-900">{data.title || 'Process flow'}</p>
      <p className="text-sm text-gray-600 mt-1">{steps.length || 0} step(s)</p>
      <p className="text-xs text-gray-500 mt-2">Configure links/decisions in properties.</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', steps: [{ id: '1', label: '', type: 'start', next: ['2'] }, { id: '2', label: '', type: 'end', next: [] }] }}
      preview={preview}
    />
  );
}

function StatsBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const stats = asArray<any>(data.stats, []);
  const preview = (
    <div className="grid grid-cols-3 gap-3">
      {(stats.length ? stats : [{ value: '0', label: 'Stat' }, { value: '0', label: 'Stat' }, { value: '0', label: 'Stat' }]).slice(0, 3).map((s, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-gray-900">{`${s.prefix || ''}${s.value || ''}${s.suffix || ''}`}</p>
          <p className="text-xs text-gray-600 mt-1">{s.label || ''}</p>
        </div>
      ))}
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ stats: [{ value: '', label: '', prefix: '', suffix: '', icon: '' }], layout: 'row' }}
      preview={preview}
    />
  );
}

function CalloutBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const type = data.type || 'note';
  const preview = (
    <div className="border rounded-lg p-4 bg-gray-50 border-gray-200">
      <p className="text-xs text-gray-500 mb-1">Callout ({type})</p>
      {data.title ? <p className="font-semibold text-gray-900">{data.title}</p> : null}
      <p className="text-gray-700 mt-1">{data.text || 'Callout text...'}</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ type: 'tip', title: '', text: '' }}
      preview={preview}
    />
  );
}

function HighlightBoxBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4 bg-primary-50">
      {data.title ? <p className="font-semibold text-gray-900 mb-1">{data.title}</p> : null}
      <p className="text-gray-700">{data.text || 'Highlight text...'}</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', text: '', color: 'blue', icon: '' }}
      preview={preview}
    />
  );
}

function GlossaryBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const terms = asArray<any>(data.terms, []);
  const preview = (
    <div>
      {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
      <dl className="space-y-2">
        {(terms.length ? terms : [{ term: 'Term', definition: 'Definition' }]).slice(0, 5).map((t, i) => (
          <div key={i}>
            <dt className="font-medium text-gray-900">{t.term || `Term ${i + 1}`}</dt>
            <dd className="text-sm text-gray-700 ml-3">{t.definition || ''}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', terms: [{ term: '', definition: '' }], searchable: true, alphabetized: true }}
      preview={preview}
    />
  );
}

function DefinitionBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="font-semibold text-gray-900">
        {data.term || 'Term'} {data.pronunciation ? <span className="text-sm text-gray-500 font-normal">{data.pronunciation}</span> : null}
      </p>
      <p className="text-gray-700 mt-1">{data.definition || 'Definition...'}</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ term: '', definition: '', pronunciation: '' }}
      preview={preview}
    />
  );
}

function CodeBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
      <p className="text-xs text-gray-300 mb-2">{data.filename || data.language || 'code'}</p>
      <pre className="text-sm text-gray-100 whitespace-pre-wrap">
        <code>{data.code || '// code...'}</code>
      </pre>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ language: 'javascript', code: '', filename: '', show_line_numbers: true, highlight_lines: [] }}
      preview={preview}
    />
  );
}

function FormulaBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="font-mono text-gray-900 whitespace-pre-wrap">{data.latex || 'LaTeX here'}</p>
      {data.caption ? <p className="text-sm text-gray-600 mt-2">{data.caption}</p> : null}
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ latex: '', caption: '' }}
      preview={preview}
    />
  );
}

function CitationBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-gray-800">{data.text || 'Citation text...'}</p>
      <p className="text-xs text-gray-500 mt-2">
        {data.source?.author || 'Author'} • {data.source?.title || 'Title'} • {data.source?.year || 'Year'}
      </p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ text: '', source: { author: '', title: '', year: new Date().getFullYear(), url: '' } }}
      preview={preview}
    />
  );
}

function KnowledgeCheckBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-xs text-gray-500 mb-1">Knowledge check</p>
      <p className="font-medium text-gray-900">{data.question || 'Question...'}</p>
      <p className="text-sm text-gray-600 mt-2">Edit options/answer in properties.</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ question: '', type: 'multiple_choice', options: [''], correct_answer: 0, explanation: '' }}
      preview={preview}
    />
  );
}

function ReflectionBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-xs text-gray-500 mb-1">Reflection</p>
      <p className="text-gray-800">{data.prompt || 'Prompt...'}</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ prompt: '', allow_response: true, response_placeholder: 'Write your response...', min_words: 0 }}
      preview={preview}
    />
  );
}

function PollBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-xs text-gray-500 mb-1">Poll</p>
      <p className="font-medium text-gray-900">{data.question || 'Question...'}</p>
      <p className="text-sm text-gray-600 mt-2">{asArray<any>(data.options, []).length || 0} option(s)</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ question: '', options: [''], show_results: true, allow_multiple: false }}
      preview={preview}
    />
  );
}

function DiscussionPromptBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-xs text-gray-500 mb-1">Discussion</p>
      <p className="text-gray-800">{data.prompt || 'Prompt...'}</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ prompt: '', allow_comments: true, require_response: false }}
      preview={preview}
    />
  );
}

function ScenarioBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="font-semibold text-gray-900">{data.title || 'Scenario'}</p>
      <p className="text-sm text-gray-600 mt-2">{data.question || 'Question...'}</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', situation: '', image_url: '', question: '', options: [{ text: '', feedback: '', is_best: false }] }}
      preview={preview}
    />
  );
}

function DragDropBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="font-semibold text-gray-900">{data.title || 'Drag & drop'}</p>
      <p className="text-sm text-gray-600 mt-1">type: {data.type || 'match'}</p>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', type: 'match', items: [{ id: '1', content: '' }], targets: [{ id: 'a', label: '', correct_items: ['1'] }], correct_order: [] }}
      preview={preview}
    />
  );
}

function TwoColumnBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const preview = (
    <div className="grid grid-cols-2 gap-3">
      <div className="border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-500">Left</p>
        <p className="text-sm text-gray-700">{data.left?.content ? String(data.left.content).slice(0, 60) : '...'}</p>
      </div>
      <div className="border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-500">Right</p>
        <p className="text-sm text-gray-700">{data.right?.content ? String(data.right.content).slice(0, 60) : '...'}</p>
      </div>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ left: { type: 'text', content: '' }, right: { type: 'text', content: '' }, ratio: '50-50', vertical_align: 'top' }}
      preview={preview}
    />
  );
}

function ThreeColumnBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const cols = asArray<any>(data.columns, []);
  const preview = (
    <div className="grid grid-cols-3 gap-3">
      {(cols.length ? cols : [{ title: 'Col 1', content: '' }, { title: 'Col 2', content: '' }, { title: 'Col 3', content: '' }]).slice(0, 3).map((c, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3">
          <p className="font-medium text-gray-900 text-sm">{c.title || `Column ${i + 1}`}</p>
          <p className="text-xs text-gray-600 mt-1">{String(c.content || '').slice(0, 60)}</p>
        </div>
      ))}
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ columns: [{ title: '', icon: '', content: '' }, { title: '', icon: '', content: '' }, { title: '', icon: '', content: '' }] }}
      preview={preview}
    />
  );
}

function CardGridBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const cards = asArray<any>(data.cards, []);
  const preview = (
    <div>
      {data.title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{data.title}</h3> : null}
      <div className="grid grid-cols-2 gap-3">
        {(cards.length ? cards : [{ title: 'Card', description: '' }, { title: 'Card', description: '' }]).slice(0, 4).map((c, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3">
            <p className="font-medium text-gray-900">{c.title || `Card ${i + 1}`}</p>
            <p className="text-sm text-gray-600 mt-1">{c.description || ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ title: '', cards: [{ title: '', description: '', image_url: '', link_url: '', link_text: '' }], columns: 2 }}
      preview={preview}
    />
  );
}

function SpacerBlock({ block, onUpdate, showProperties }: { block: ContentBlockType; onUpdate: (data: any) => void; showProperties: boolean } & any) {
  const data = block.data ?? {};
  const height = data.height || 'medium';
  const preview = (
    <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500">
      Spacer ({height})
    </div>
  );
  return (
    <JsonEditorBlock
      block={block}
      onUpdate={(parsed) => onUpdate(parsed)}
      showProperties={showProperties}
      defaultData={{ height: 'medium' }}
      preview={preview}
    />
  );
}

