'use client';

import { useState } from 'react';

interface ContentBlockRendererProps {
  blockType: string;
  content: any;
}

export function ContentBlockRenderer({ blockType, content }: ContentBlockRendererProps) {
  switch (blockType) {
    case 'text':
      return <TextBlock content={content} />;
    case 'heading':
      return <HeadingBlock content={content} />;
    case 'divider':
      return <DividerBlock content={content} />;
    case 'bullet_list':
      return <BulletListBlock content={content} />;
    case 'numbered_list':
      return <NumberedListBlock content={content} />;
    case 'numbered_steps':
      return <NumberedStepsBlock content={content} />;
    case 'accordion':
      return <AccordionBlock content={content} />;
    case 'flashcard':
      return <FlashcardBlock content={content} />;
    case 'flashcard_deck':
      return <FlashcardDeckBlock content={content} />;
    case 'slider':
      return <SliderBlock content={content} />;
    case 'reveal':
      return <RevealBlock content={content} />;
    case 'callout':
      return <CalloutBlock content={content} />;
    case 'highlight_box':
      return <HighlightBoxBlock content={content} />;
    case 'table':
      return <TableBlock content={content} />;
    case 'tabs':
      return <TabsBlock content={content} />;
    case 'image':
      return <ImageBlock content={content} />;
    case 'image_gallery':
      return <ImageGalleryBlock content={content} />;
    case 'video':
      return <VideoBlock content={content} />;
    case 'audio':
      return <AudioBlock content={content} />;
    case 'file_download':
      return <FileDownloadBlock content={content} />;
    case 'embed':
      return <EmbedBlock content={content} />;
    case 'checklist':
      return <ChecklistBlock content={content} />;
    case 'quote':
      return <QuoteBlock content={content} />;
    case 'glossary':
      return <GlossaryBlock content={content} />;
    case 'definition':
      return <DefinitionBlock content={content} />;
    case 'comparison':
      return <ComparisonBlock content={content} />;
    case 'timeline':
      return <TimelineBlock content={content} />;
    case 'process_flow':
      return <ProcessFlowBlock content={content} />;
    case 'stats':
      return <StatsBlock content={content} />;
    case 'code':
      return <CodeBlock content={content} />;
    case 'formula':
      return <FormulaBlock content={content} />;
    case 'citation':
      return <CitationBlock content={content} />;
    case 'knowledge_check':
      return <KnowledgeCheckBlock content={content} />;
    case 'reflection':
      return <ReflectionBlock content={content} />;
    case 'poll':
      return <PollBlock content={content} />;
    case 'discussion':
      return <DiscussionPromptBlock content={content} />;
    case 'scenario':
      return <ScenarioBlock content={content} />;
    case 'drag_drop':
      return <DragDropBlock content={content} />;
    case 'two_column':
      return <TwoColumnBlock content={content} />;
    case 'three_column':
      return <ThreeColumnBlock content={content} />;
    case 'card_grid':
      return <CardGridBlock content={content} />;
    case 'spacer':
      return <SpacerBlock content={content} />;
    case 'hotspot_image':
      return <HotspotImageBlock content={content} />;
    default:
      return <div className="text-gray-500 italic">Unknown block type: {blockType}</div>;
  }
}

function TextBlock({ content }: { content: { text?: string; content?: string } }) {
  const text = (content?.text ?? (content as any)?.content ?? '') as string;
  return (
    <div className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: String(text).replace(/\n/g, '<br />') }} />
    </div>
  );
}

function HeadingBlock({ content }: { content: { text?: string; level?: 1 | 2 | 3 | 4 } }) {
  const level = (content?.level ?? 2) as 1 | 2 | 3 | 4;
  const text = content?.text || '';
  switch (level) {
    case 1:
      return <h1 className="text-2xl font-bold text-gray-900">{text}</h1>;
    case 2:
      return <h2 className="text-xl font-bold text-gray-900">{text}</h2>;
    case 3:
      return <h3 className="text-lg font-bold text-gray-900">{text}</h3>;
    default:
      return <h4 className="text-base font-bold text-gray-900">{text}</h4>;
  }
}

function DividerBlock({ content }: { content: { style?: 'line' | 'dots' | 'space'; spacing?: 'small' | 'medium' | 'large' } }) {
  const spacing = content?.spacing || 'medium';
  const py = spacing === 'small' ? 'py-2' : spacing === 'large' ? 'py-8' : 'py-4';
  if (content?.style === 'space') return <div className={py} />;
  if (content?.style === 'dots') {
    return (
      <div className={py}>
        <div className="flex items-center justify-center gap-2 text-gray-300">
          <span>•</span><span>•</span><span>•</span>
        </div>
      </div>
    );
  }
  return (
    <div className={py}>
      <hr className="border-gray-200" />
    </div>
  );
}

function BulletListBlock({ content }: { content: { title?: string; items: string[] } }) {
  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{content.title}</h3>}
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        {content.items?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function NumberedListBlock({ content }: { content: { title?: string; items: string[]; start?: number } }) {
  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{content.title}</h3>}
      <ol className="list-decimal list-inside space-y-2 text-gray-700" start={content.start ?? 1}>
        {content.items?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    </div>
  );
}

function NumberedStepsBlock({ content }: { content: { title?: string; steps: Array<{ title: string; description: string }> } }) {
  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <ol className="list-decimal list-inside space-y-4">
        {content.steps?.map((step, index) => (
          <li key={index} className="text-gray-700">
            <span className="font-medium">{step.title}</span>
            {step.description && <p className="ml-6 text-gray-600">{step.description}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function AccordionBlock({ content }: { content: { title?: string; items?: Array<{ title: string; content: string }>; sections?: Array<{ title: string; content: string }>; allow_multiple_open?: boolean } }) {
  const items = (content.items || content.sections || []) as Array<{ title: string; content: string }>;
  const allowMultiple = !!content.allow_multiple_open;
  const [open, setOpen] = useState<number[]>([]);

  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <div className="space-y-2">
        {items?.map((section, index) => {
          const isOpen = open.includes(index);
          return (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => {
                setOpen((prev) => {
                  const has = prev.includes(index);
                  if (allowMultiple) {
                    return has ? prev.filter((x) => x !== index) : [...prev, index];
                  }
                  return has ? [] : [index];
                });
              }}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">{section.title}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-gray-700">{section.content}</div>
            )}
          </div>
        )})}
      </div>
    </div>
  );
}

function FlashcardBlock({ content }: { content: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Support both:
  // - reference spec: { front: {text}, back: {text} }
  // - legacy deck-ish: { cards: [{ front, back }] }
  const cards: Array<{ front: string; back: string }> = Array.isArray(content?.cards)
    ? content.cards
    : content?.front || content?.back
      ? [{ front: content?.front?.text || '', back: content?.back?.text || '' }]
      : [];
  const card = cards[currentIndex];
  if (!card) return null;

  return (
    <div className="perspective-1000">
      <div
        className={`relative w-full h-64 transition-transform duration-500 transform-style-preserve-3d ${flipped ? 'rotate-y-180' : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="absolute inset-0 backface-hidden bg-white border-2 border-gray-200 rounded-lg p-6 flex items-center justify-center cursor-pointer">
          <p className="text-lg font-medium text-gray-900">{card.front}</p>
        </div>
        <div className="absolute inset-0 backface-hidden bg-primary-50 border-2 border-primary-200 rounded-lg p-6 flex items-center justify-center cursor-pointer rotate-y-180">
          <p className="text-lg text-gray-900">{card.back}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => {
            setCurrentIndex(Math.max(0, currentIndex - 1));
            setFlipped(false);
          }}
          disabled={currentIndex === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          {currentIndex + 1} / {cards.length || 0}
        </span>
        <button
          onClick={() => {
            setCurrentIndex(Math.min((cards.length || 1) - 1, currentIndex + 1));
            setFlipped(false);
          }}
          disabled={currentIndex >= (cards.length || 1) - 1}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function CalloutBlock({ content }: { content: { type: string; title?: string; text: string } }) {
  const colors = {
    tip: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    note: 'bg-gray-50 border-gray-200 text-gray-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  return (
    <div className={`border rounded-lg p-4 ${colors[content.type as keyof typeof colors] || colors.note}`}>
      {content.title && <h4 className="font-semibold mb-2">{content.title}</h4>}
      <p>{content.text}</p>
    </div>
  );
}

function TableBlock({ content }: { content: { title?: string; headers: string[]; rows: string[][] } }) {
  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {content.headers?.map((header, index) => (
                <th key={index} className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.rows?.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-sm text-gray-700 border-b">
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
}

function TimelineBlock({ content }: { content: { title?: string; orientation?: 'vertical' | 'horizontal'; events: Array<{ time?: string; date?: string; title: string; description: string }> } }) {
  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-6">
          {content.events?.map((event, index) => (
            <div key={index} className="relative flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium z-10">
                {index + 1}
              </div>
              <div className="flex-1 pb-6">
                <p className="text-sm text-gray-500 mb-1">{event.date ?? event.time}</p>
                <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                <p className="text-gray-700">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabsBlock({ content }: { content: { tabs: Array<{ title?: string; label?: string; icon?: string; content: string }>; default_tab?: number } }) {
  const [activeTab, setActiveTab] = useState(content.default_tab ?? 0);

  return (
    <div>
      <div className="border-b border-gray-200 mb-4">
        <div className="flex gap-2">
          {content.tabs?.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === index
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon ? <span className="mr-2">{tab.icon}</span> : null}
              {tab.label || tab.title}
            </button>
          ))}
        </div>
      </div>
      <div className="text-gray-700">{content.tabs?.[activeTab]?.content}</div>
    </div>
  );
}

function ImageBlock({ content }: { content: { url: string; alt?: string; caption?: string } }) {
  return (
    <div>
      <img src={content.url} alt={content.alt || ''} className="w-full rounded-lg" />
      {content.caption && <p className="text-sm text-gray-600 mt-2 text-center">{content.caption}</p>}
    </div>
  );
}

function VideoBlock({ content }: { content: { url: string; title?: string; thumbnail_url?: string; show_controls?: boolean } }) {
  const url = content?.url;
  const isDirectVideo = typeof url === 'string' && /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
  const isLikelyEmbed = typeof url === 'string' && !isDirectVideo;
  return (
    <div>
      {content.title && <h4 className="font-semibold text-gray-900 mb-2">{content.title}</h4>}
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
        {isLikelyEmbed ? (
          <iframe
            src={url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={content.title || 'Video'}
          />
        ) : (
          <video src={url} controls={content.show_controls ?? true} className="w-full h-full" />
        )}
      </div>
    </div>
  );
}

function ChecklistBlock({ content }: { content: { title?: string; items: any; allow_interaction?: boolean } }) {
  const items: Array<{ text: string; checked?: boolean }> = Array.isArray(content.items)
    ? content.items.map((it: any) => (typeof it === 'string' ? { text: it } : it))
    : [];
  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{content.title}</h3>}
      <div className="space-y-2">
        {items?.map((item, index) => (
          <label key={index} className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked={!!item.checked} disabled={!content.allow_interaction} className="w-5 h-5 text-primary-500 rounded" />
            <span className="text-gray-700">{item.text}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function QuoteBlock({ content }: { content: { text: string; author?: string; source?: string } }) {
  return (
    <blockquote className="border-l-4 border-primary-500 pl-4 py-2 italic text-gray-700">
      <p className="mb-2">&quot;{content.text}&quot;</p>
      {(content.author || content.source) && (
        <footer className="text-sm text-gray-600">
          — {content.author}
          {content.source && <span className="text-gray-500">, {content.source}</span>}
        </footer>
      )}
    </blockquote>
  );
}

function GlossaryBlock({ content }: { content: { title?: string; terms: Array<{ term: string; definition: string }> } }) {
  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <dl className="space-y-3">
        {content.terms?.map((item, index) => (
          <div key={index}>
            <dt className="font-semibold text-gray-900 mb-1">{item.term}</dt>
            <dd className="text-gray-700 ml-4">{item.definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ComparisonBlock({ content }: { content: any }) {
  type ComparisonItem = { text: string; type?: 'pro' | 'con' | 'neutral' };
  type ComparisonCol = { header: string; highlight?: boolean; items: ComparisonItem[] };

  const columns: ComparisonCol[] = Array.isArray(content?.columns) ? (content.columns as ComparisonCol[]) : [];
  // Backward-compat: { left: {label, items}, right: {label, items} }
  const legacyColumns: ComparisonCol[] =
    content?.left && content?.right
      ? [
          { header: content.left.label || 'Left', highlight: false, items: (content.left.items || []).map((t: string) => ({ text: t, type: 'pro' as const })) },
          { header: content.right.label || 'Right', highlight: false, items: (content.right.items || []).map((t: string) => ({ text: t, type: 'con' as const })) },
        ]
      : [];
  const cols = columns.length ? columns : legacyColumns;

  const iconFor = (type?: string) => {
    if (type === 'pro') return '✓';
    if (type === 'con') return '✕';
    return '•';
  };

  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <div className={`grid gap-4 ${cols.length >= 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
        {cols.map((col: ComparisonCol, idx: number) => (
          <div key={idx} className={`border rounded-lg p-4 ${col.highlight ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'}`}>
            <h4 className="font-semibold text-gray-900 mb-3">{col.header}</h4>
            <ul className="space-y-2">
              {(col.items || []).map((it: ComparisonItem, i: number) => (
                <li key={i} className="flex items-start gap-2 text-gray-800">
                  <span className="mt-0.5 text-gray-500">{iconFor(it.type)}</span>
                  <span>{it.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeBlock({ content }: { content: { language?: string; code: string } }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
      <pre className="text-sm text-gray-100">
        <code>{content.code}</code>
      </pre>
    </div>
  );
}

function HotspotImageBlock({ content }: { content: { image_url: string; image_alt?: string; title?: string; hotspots: Array<{ x: number; y: number; title?: string; label?: string; description: string }> } }) {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <div className="relative inline-block">
        <img src={content.image_url} alt={content.image_alt || content.title || ''} className="max-w-full rounded-lg" />
        {content.hotspots?.map((hotspot, index) => (
          <div
            key={index}
            className="absolute cursor-pointer"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            onMouseEnter={() => setActiveHotspot(index)}
            onMouseLeave={() => setActiveHotspot(null)}
          >
            <div className="w-4 h-4 bg-primary-500 rounded-full border-2 border-white shadow-lg" />
            {activeHotspot === index && (
              <div className="absolute left-0 top-6 bg-white rounded-lg shadow-lg p-3 min-w-[200px] z-10">
                <p className="font-semibold text-gray-900 mb-1">{hotspot.title || hotspot.label}</p>
                <p className="text-sm text-gray-600">{hotspot.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageGalleryBlock({ content }: { content: { title?: string; images: Array<{ url: string; alt?: string; caption?: string }>; columns?: 2 | 3 | 4 } }) {
  const cols = content.columns || 3;
  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <div className={`grid gap-3 ${cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
        {(content.images || []).map((img, i) => (
          <figure key={i} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <img src={img.url} alt={img.alt || ''} className="w-full h-40 object-cover" />
            {img.caption && <figcaption className="text-xs text-gray-600 p-2">{img.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  );
}

function AudioBlock({ content }: { content: { url: string; title?: string; show_transcript?: boolean; transcript?: string } }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {content.title && <h4 className="font-semibold text-gray-900 mb-2">{content.title}</h4>}
      <audio src={content.url} controls className="w-full" />
      {content.show_transcript && content.transcript && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-primary-600">View transcript</summary>
          <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{content.transcript}</div>
        </details>
      )}
    </div>
  );
}

function FileDownloadBlock({ content }: { content: { url: string; filename: string; description?: string; file_type?: string; file_size_bytes?: number } }) {
  const sizeKb = content.file_size_bytes ? Math.round(content.file_size_bytes / 1024) : null;
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <p className="font-semibold text-gray-900">{content.filename}</p>
      {content.description && <p className="text-sm text-gray-600 mt-1">{content.description}</p>}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {(content.file_type || 'file').toUpperCase()}
          {sizeKb != null ? ` • ${sizeKb} KB` : ''}
        </p>
        <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700">
          Download
        </a>
      </div>
    </div>
  );
}

function EmbedBlock({ content }: { content: { url?: string; title?: string; height?: number; embedCode?: string } }) {
  if (content.embedCode) {
    return <div className="border border-gray-200 rounded-lg overflow-hidden" dangerouslySetInnerHTML={{ __html: content.embedCode }} />;
  }
  if (!content.url) return <div className="text-gray-500 italic">No embed URL provided.</div>;
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <iframe src={content.url} title={content.title || 'Embedded content'} className="w-full" style={{ height: content.height ?? 400 }} />
    </div>
  );
}

function FlashcardDeckBlock({ content }: { content: { title?: string; cards: Array<{ front: string; back: string }>; shuffle?: boolean; show_progress?: boolean } }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const cards = Array.isArray(content.cards) ? content.cards : [];
  const card = cards[index];
  if (!card) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-900">{content.title || 'Flashcards'}</h4>
        {content.show_progress !== false && (
          <span className="text-xs text-gray-500">
            Card {index + 1} of {cards.length}
          </span>
        )}
      </div>
      <div
        className={`relative w-full h-56 border-2 rounded-lg cursor-pointer overflow-hidden ${
          flipped ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'
        }`}
        onClick={() => setFlipped((v) => !v)}
      >
        <div className="h-full flex items-center justify-center p-6 text-center text-gray-900">
          {flipped ? card.back : card.front}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => {
            setIndex((i) => Math.max(0, i - 1));
            setFlipped(false);
          }}
          disabled={index === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => {
            setIndex((i) => Math.min(cards.length - 1, i + 1));
            setFlipped(false);
          }}
          disabled={index >= cards.length - 1}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function SliderBlock({ content }: { content: { title?: string; slides: Array<{ title?: string; content: string; image_url?: string }>; show_arrows?: boolean; show_dots?: boolean } }) {
  const [index, setIndex] = useState(0);
  const slides = Array.isArray(content.slides) ? content.slides : [];
  const slide = slides[index];
  if (!slide) return null;
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      {content.title && <h4 className="font-semibold text-gray-900 mb-3">{content.title}</h4>}
      <div className="flex items-center gap-3">
        {content.show_arrows !== false && (
          <button
            type="button"
            onClick={() => setIndex((i: number) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            ←
          </button>
        )}
        <div className="flex-1">
          {slide.image_url && <img src={slide.image_url} alt="" className="w-full max-h-64 object-cover rounded-lg mb-3" />}
          {slide.title && <p className="font-semibold text-gray-900 mb-1">{slide.title}</p>}
          <p className="text-gray-700 whitespace-pre-wrap">{slide.content}</p>
        </div>
        {content.show_arrows !== false && (
          <button
            type="button"
            onClick={() => setIndex((i: number) => Math.min(slides.length - 1, i + 1))}
            disabled={index >= slides.length - 1}
            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            →
          </button>
        )}
      </div>
      {content.show_dots !== false && slides.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((_: unknown, i: number) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full ${i === index ? 'bg-primary-500' : 'bg-gray-300'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RevealBlock({ content }: { content: { prompt: string; hidden_content: string; button_text?: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <p className="font-medium text-gray-900">{content.prompt}</p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          {content.button_text || 'Reveal Answer'}
        </button>
      ) : (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 whitespace-pre-wrap">
          {content.hidden_content}
        </div>
      )}
    </div>
  );
}

function HighlightBoxBlock({ content }: { content: { title?: string; text: string; color?: string; icon?: string } }) {
  const palette: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
    gray: 'bg-gray-50 border-gray-200',
  };
  return (
    <div className={`border rounded-lg p-4 ${palette[content.color || 'blue'] || palette.blue}`}>
      {(content.title || content.icon) && (
        <p className="font-semibold text-gray-900 mb-2">
          {content.icon ? <span className="mr-2">{content.icon}</span> : null}
          {content.title}
        </p>
      )}
      <p className="text-gray-800 whitespace-pre-wrap">{content.text}</p>
    </div>
  );
}

function DefinitionBlock({ content }: { content: { term: string; definition: string; pronunciation?: string } }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="font-semibold text-gray-900">
        {content.term}{' '}
        {content.pronunciation ? <span className="text-sm font-normal text-gray-500">{content.pronunciation}</span> : null}
      </p>
      <p className="text-gray-700 mt-1 whitespace-pre-wrap">{content.definition}</p>
    </div>
  );
}

function ProcessFlowBlock({ content }: { content: { title?: string; steps: Array<{ id: string; label: string; type: string; next?: string[] }> } }) {
  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <div className="space-y-2">
        {(content.steps || []).map((s) => (
          <div key={s.id} className="border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">{s.type}</p>
            <p className="font-medium text-gray-900">{s.label}</p>
            {Array.isArray(s.next) && s.next.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">Next: {s.next.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsBlock({ content }: { content: { layout?: 'row' | 'grid'; stats: Array<{ value: string; label: string; prefix?: string; suffix?: string; icon?: string }> } }) {
  const grid = content.layout === 'grid';
  return (
    <div className={`grid gap-4 ${grid ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
      {(content.stats || []).map((s, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 text-center bg-white">
          <p className="text-2xl font-bold text-gray-900">
            {s.icon ? <span className="mr-2">{s.icon}</span> : null}
            {`${s.prefix || ''}${s.value}${s.suffix || ''}`}
          </p>
          <p className="text-xs text-gray-600 mt-2">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

function FormulaBlock({ content }: { content: { latex: string; caption?: string } }) {
  // LaTeX rendering would require a lib; show raw for now.
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <p className="font-mono text-sm text-gray-900 whitespace-pre-wrap">{content.latex}</p>
      {content.caption && <p className="text-xs text-gray-600 mt-2">{content.caption}</p>}
    </div>
  );
}

function CitationBlock({ content }: { content: { text: string; source: { author: string; title: string; year: number; url?: string } } }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <p className="text-gray-800">{content.text}</p>
      <p className="text-xs text-gray-500 mt-2">
        {content.source.author} • {content.source.title} • {content.source.year}
        {content.source.url ? (
          <>
            {' '}
            •{' '}
            <a href={content.source.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
              Source
            </a>
          </>
        ) : null}
      </p>
    </div>
  );
}

function KnowledgeCheckBlock({ content }: { content: any }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const options: string[] = Array.isArray(content.options) ? content.options : [];
  const correctIndex = typeof content.correct_answer === 'number' ? content.correct_answer : -1;
  const isCorrect = selected != null && selected === correctIndex;
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-xs font-semibold text-gray-500 mb-2">Quick Check</p>
      <p className="font-medium text-gray-900">{content.question}</p>
      <div className="mt-3 space-y-2">
        {options.map((opt, i) => (
          <label key={i} className="flex items-center gap-2 text-gray-700">
            <input
              type="radio"
              name="kc"
              checked={selected === i}
              onChange={() => {
                setSelected(i);
                setChecked(false);
              }}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setChecked(true)}
          disabled={selected == null}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg disabled:opacity-50"
        >
          Check Answer
        </button>
      </div>
      {checked && (
        <div className={`mt-3 p-3 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <p className="font-semibold">{isCorrect ? 'Correct' : 'Not quite'}</p>
          {content.explanation && <p className="text-sm mt-1">{content.explanation}</p>}
        </div>
      )}
    </div>
  );
}

function ReflectionBlock({ content }: { content: { prompt: string; allow_response?: boolean; response_placeholder?: string; min_words?: number } }) {
  const [value, setValue] = useState('');
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-xs font-semibold text-gray-500 mb-2">Reflection</p>
      <p className="text-gray-800 whitespace-pre-wrap">{content.prompt}</p>
      {content.allow_response && (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={content.response_placeholder || 'Write here...'}
          rows={5}
          className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg"
        />
      )}
      {content.min_words ? <p className="text-xs text-gray-500 mt-2">Suggested minimum: {content.min_words} words</p> : null}
    </div>
  );
}

function PollBlock({ content }: { content: { question: string; options: string[]; allow_multiple?: boolean; show_results?: boolean } }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (opt: string) => {
    setSelected((prev) => {
      if (content.allow_multiple) return prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt];
      return [opt];
    });
  };
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-xs font-semibold text-gray-500 mb-2">Poll</p>
      <p className="font-medium text-gray-900">{content.question}</p>
      <div className="mt-3 space-y-2">
        {(content.options || []).map((opt, i) => (
          <label key={i} className="flex items-center gap-2 text-gray-700">
            <input
              type={content.allow_multiple ? 'checkbox' : 'radio'}
              name="poll"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      {content.show_results && selected.length > 0 && (
        <p className="text-xs text-gray-500 mt-3">Thanks! (Results display not implemented yet.)</p>
      )}
    </div>
  );
}

function DiscussionPromptBlock({ content }: { content: { prompt: string } }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <p className="text-xs font-semibold text-gray-500 mb-2">Discussion</p>
      <p className="text-gray-800 whitespace-pre-wrap">{content.prompt}</p>
    </div>
  );
}

function ScenarioBlock({ content }: { content: any }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const options: Array<{ text: string; feedback: string; is_best: boolean }> = Array.isArray(content.options) ? content.options : [];
  const chosen = selected != null ? options[selected] : null;
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p className="text-xs font-semibold text-gray-500 mb-2">Scenario</p>
      {content.title && <p className="font-semibold text-gray-900">{content.title}</p>}
      {content.situation && <p className="text-gray-700 mt-2 whitespace-pre-wrap">{content.situation}</p>}
      <p className="font-medium text-gray-900 mt-3">{content.question}</p>
      <div className="mt-3 space-y-2">
        {options.map((opt, i) => (
          <label key={i} className="flex items-start gap-2 text-gray-700">
            <input type="radio" name="scenario" checked={selected === i} onChange={() => { setSelected(i); setSubmitted(false); }} />
            <span>{opt.text}</span>
          </label>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg disabled:opacity-50"
        disabled={selected == null}
        onClick={() => setSubmitted(true)}
      >
        Submit Answer
      </button>
      {submitted && chosen && (
        <div className={`mt-3 p-3 rounded-lg border ${chosen.is_best ? 'bg-green-50 border-green-200 text-green-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
          <p className="font-semibold">{chosen.is_best ? 'Best choice' : 'Consider another approach'}</p>
          {chosen.feedback && <p className="text-sm mt-1">{chosen.feedback}</p>}
        </div>
      )}
    </div>
  );
}

function DragDropBlock({ content }: { content: any }) {
  // Full drag & drop would require a DnD library on the learner side.
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <p className="text-xs font-semibold text-gray-500 mb-2">Drag & Drop</p>
      {content.title && <p className="font-semibold text-gray-900">{content.title}</p>}
      <p className="text-sm text-gray-600 mt-2">Interactive drag & drop is not implemented yet.</p>
    </div>
  );
}

function TwoColumnBlock({ content }: { content: any }) {
  const left = content.left || { type: 'text', content: '' };
  const right = content.right || { type: 'text', content: '' };
  const ratio = content.ratio || '50-50';
  const cols = ratio === '30-70' ? 'grid-cols-1 md:grid-cols-[3fr_7fr]' : ratio === '70-30' ? 'grid-cols-1 md:grid-cols-[7fr_3fr]' : 'grid-cols-1 md:grid-cols-2';
  const renderSide = (side: any) => {
    if (side.type === 'image') return <img src={side.content} alt="" className="w-full rounded-lg border border-gray-200" />;
    return <div className="text-gray-700 whitespace-pre-wrap">{side.content}</div>;
  };
  return (
    <div className={`grid gap-4 ${cols}`}>
      <div>{renderSide(left)}</div>
      <div>{renderSide(right)}</div>
    </div>
  );
}

function ThreeColumnBlock({ content }: { content: { columns: Array<{ title?: string; icon?: string; content: string }> } }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {(content.columns || []).map((c, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white">
          {(c.icon || c.title) && (
            <p className="font-semibold text-gray-900 mb-2">
              {c.icon ? <span className="mr-2">{c.icon}</span> : null}
              {c.title}
            </p>
          )}
          <p className="text-gray-700 whitespace-pre-wrap">{c.content}</p>
        </div>
      ))}
    </div>
  );
}

function CardGridBlock({ content }: { content: { title?: string; cards: Array<{ title: string; description: string; image_url?: string; link_url?: string; link_text?: string }>; columns?: 2 | 3 | 4 } }) {
  const cols = content.columns || 3;
  const grid = cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : cols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <div className={`grid gap-4 ${grid}`}>
        {(content.cards || []).map((c, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {c.image_url && <img src={c.image_url} alt="" className="w-full h-36 object-cover" />}
            <div className="p-4">
              <p className="font-semibold text-gray-900">{c.title}</p>
              <p className="text-sm text-gray-600 mt-1">{c.description}</p>
              {c.link_url && (
                <a href={c.link_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 mt-3 inline-block">
                  {c.link_text || 'Learn more'}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpacerBlock({ content }: { content: { height?: 'small' | 'medium' | 'large' | 'xlarge' } }) {
  const h = content.height || 'medium';
  const cls = h === 'small' ? 'h-4' : h === 'large' ? 'h-12' : h === 'xlarge' ? 'h-20' : 'h-8';
  return <div className={cls} />;
}

