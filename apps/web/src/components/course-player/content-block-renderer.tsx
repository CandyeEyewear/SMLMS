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
    case 'bullet_list':
      return <BulletListBlock content={content} />;
    case 'numbered_steps':
      return <NumberedStepsBlock content={content} />;
    case 'accordion':
      return <AccordionBlock content={content} />;
    case 'flashcard':
      return <FlashcardBlock content={content} />;
    case 'callout':
      return <CalloutBlock content={content} />;
    case 'table':
      return <TableBlock content={content} />;
    case 'timeline':
      return <TimelineBlock content={content} />;
    case 'tabs':
      return <TabsBlock content={content} />;
    case 'image':
      return <ImageBlock content={content} />;
    case 'video':
      return <VideoBlock content={content} />;
    case 'file':
      return <FileBlock content={content} />;
    case 'embed':
      return <EmbedBlock content={content} />;
    case 'quiz':
      return <QuizBlock content={content} />;
    case 'checklist':
      return <ChecklistBlock content={content} />;
    case 'quote':
      return <QuoteBlock content={content} />;
    case 'glossary':
      return <GlossaryBlock content={content} />;
    case 'comparison':
      return <ComparisonBlock content={content} />;
    case 'code':
      return <CodeBlock content={content} />;
    case 'hotspot_image':
      return <HotspotImageBlock content={content} />;
    default:
      return <div className="text-gray-500 italic">Unknown block type: {blockType}</div>;
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function toSafeHtmlText(raw: string) {
  // Render as plain text (escaped) while preserving newlines.
  return escapeHtml(raw).replace(/\n/g, '<br />');
}

function TextBlock({ content }: { content: { text?: string; content?: string; title?: string } }) {
  const title = typeof content?.title === 'string' ? content.title : '';
  const raw = typeof content?.text === 'string' ? content.text : (typeof content?.content === 'string' ? content.content : '');
  return (
    <div className="prose max-w-none">
      {title ? <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3> : null}
      <div dangerouslySetInnerHTML={{ __html: toSafeHtmlText(raw) }} />
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

function AccordionBlock({ content }: { content: { title?: string; sections: Array<{ title: string; content: string }> } }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <div className="space-y-2">
        {content.sections?.map((section, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">{section.title}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-700">{section.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlashcardBlock({ content }: { content: { cards: Array<{ front: string; back: string }> } }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = content.cards?.[currentIndex];
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
          {currentIndex + 1} / {content.cards?.length || 0}
        </span>
        <button
          onClick={() => {
            setCurrentIndex(Math.min((content.cards?.length || 1) - 1, currentIndex + 1));
            setFlipped(false);
          }}
          disabled={currentIndex >= (content.cards?.length || 1) - 1}
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

function TimelineBlock({ content }: { content: { title?: string; events: Array<{ time: string; title: string; description: string }> } }) {
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
                <p className="text-sm text-gray-500 mb-1">{event.time}</p>
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

function TabsBlock({ content }: { content: { tabs: Array<{ title: string; content: string }> } }) {
  const [activeTab, setActiveTab] = useState(0);

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
              {tab.title}
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

function VideoBlock({ content }: { content: { url: string; title?: string; thumbnail?: string } }) {
  return (
    <div>
      {content.title && <h4 className="font-semibold text-gray-900 mb-2">{content.title}</h4>}
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
        {typeof content.url === 'string' && content.url.trim().startsWith('<') ? (
          <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: content.url }} />
        ) : (
          <video src={content.url} controls className="w-full h-full" />
        )}
      </div>
    </div>
  );
}

function FileBlock({ content }: { content: { url?: string; title?: string; description?: string } }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{content.title || 'File'}</p>
          {content.description ? <p className="text-sm text-gray-600 mt-1">{content.description}</p> : null}
        </div>
        {content.url ? (
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Download
          </a>
        ) : null}
      </div>
    </div>
  );
}

function EmbedBlock({ content }: { content: { embedCode?: string; title?: string } }) {
  return (
    <div>
      {content.title ? <h4 className="font-semibold text-gray-900 mb-2">{content.title}</h4> : null}
      {content.embedCode ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden" dangerouslySetInnerHTML={{ __html: content.embedCode }} />
      ) : (
        <div className="text-gray-500 italic">No embed provided.</div>
      )}
    </div>
  );
}

function QuizBlock({ content }: { content: { title?: string } }) {
  return (
    <div className="border border-accent-200 bg-accent-50 rounded-lg p-4">
      <p className="font-semibold text-gray-900">{content.title || 'Quiz'}</p>
      <p className="text-sm text-gray-700 mt-1">This quiz will be available to learners in the quiz section.</p>
    </div>
  );
}

function ChecklistBlock({ content }: { content: { title?: string; items: string[] } }) {
  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{content.title}</h3>}
      <div className="space-y-2">
        {content.items?.map((item, index) => (
          <label key={index} className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 text-primary-500 rounded" />
            <span className="text-gray-700">{item}</span>
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

function ComparisonBlock({ content }: { content: { title?: string; left: { label: string; items: string[] }; right: { label: string; items: string[] } } }) {
  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-3">{content.left?.label}</h4>
          <ul className="space-y-2">
            {content.left?.items?.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-green-800">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-red-200 bg-red-50 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-3">{content.right?.label}</h4>
          <ul className="space-y-2">
            {content.right?.items?.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-red-800">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
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

function HotspotImageBlock({ content }: { content: { image_url: string; title?: string; hotspots: Array<{ x: number; y: number; label: string; description: string }> } }) {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  return (
    <div>
      {content.title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{content.title}</h3>}
      <div className="relative inline-block">
        <img src={content.image_url} alt={content.title || ''} className="max-w-full rounded-lg" />
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
                <p className="font-semibold text-gray-900 mb-1">{hotspot.label}</p>
                <p className="text-sm text-gray-600">{hotspot.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

