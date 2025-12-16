'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
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

type BlockPaletteItem = {
  type: ContentBlockType['type'];
  label: string;
  description: string;
  category:
    | 'Text & Basic'
    | 'Lists & Steps'
    | 'Media'
    | 'Interactive'
    | 'Data & Comparison'
    | 'Callouts'
    | 'Reference'
    | 'Engagement'
    | 'Layout'
    | 'Legacy';
  icon: ReactNode;
};

const contentTypes: BlockPaletteItem[] = [
  {
    type: 'text',
    label: 'Text',
    category: 'Text & Basic',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
    description: 'Paragraphs of content',
  },
  {
    type: 'heading',
    label: 'Heading',
    category: 'Text & Basic',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6v12M6 12h12M18 6v12" />
      </svg>
    ),
    description: 'Section headings (H1–H4)',
  },
  {
    type: 'quote',
    label: 'Quote',
    category: 'Text & Basic',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h6M7 12h4m7-6h-1a3 3 0 00-3 3v3a3 3 0 003 3h1m-12 0H5a3 3 0 01-3-3V9a3 3 0 013-3h1" />
      </svg>
    ),
    description: 'Highlighted quote + attribution',
  },
  {
    type: 'divider',
    label: 'Divider',
    category: 'Text & Basic',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
      </svg>
    ),
    description: 'Visual separator',
  },
  {
    type: 'bullet_list',
    label: 'Bullet List',
    category: 'Lists & Steps',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01" />
      </svg>
    ),
    description: 'Unordered list of key points',
  },
  {
    type: 'numbered_list',
    label: 'Numbered List',
    category: 'Lists & Steps',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h10M10 12h10M10 18h10M4 7h1v4M4 17h2a1 1 0 001-1v-1a1 1 0 00-1-1H4" />
      </svg>
    ),
    description: 'Ordered list',
  },
  {
    type: 'numbered_steps',
    label: 'Numbered Steps',
    category: 'Lists & Steps',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h2M4 12h2M4 18h2M8 6h12M8 12h12M8 18h12" />
      </svg>
    ),
    description: 'Step-by-step instructions',
  },
  {
    type: 'checklist',
    label: 'Checklist',
    category: 'Lists & Steps',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3L22 4M2 20h8M2 12h8M2 4h8" />
      </svg>
    ),
    description: 'Interactive checkboxes',
  },
  {
    type: 'image',
    label: 'Image',
    category: 'Media',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Single image with caption',
  },
  {
    type: 'image_gallery',
    label: 'Image Gallery',
    category: 'Media',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18v14H3V5zm4 4h4v4H7V9zm6 0h4v4h-4V9zM7 15h4v2H7v-2zm6 0h4v2h-4v-2z" />
      </svg>
    ),
    description: 'Multiple images (grid/carousel)',
  },
  {
    type: 'video',
    label: 'Video',
    category: 'Media',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Embedded video content',
  },
  {
    type: 'audio',
    label: 'Audio',
    category: 'Media',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-2v13M9 19a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description: 'Audio player with optional transcript',
  },
  {
    type: 'file_download',
    label: 'File Download',
    category: 'Media',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v10m0 0l-3-3m3 3l3-3M5 20h14" />
      </svg>
    ),
    description: 'Downloadable attachment (PDF, DOC, etc.)',
  },
  {
    type: 'embed',
    label: 'Embed',
    category: 'Media',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    description: 'External embedded content (iframe)',
  },
  {
    type: 'accordion',
    label: 'Accordion',
    category: 'Interactive',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    description: 'Expandable/collapsible items',
  },
  {
    type: 'tabs',
    label: 'Tabs',
    category: 'Interactive',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h10M4 17h16" />
      </svg>
    ),
    description: 'Tabbed content panels',
  },
  {
    type: 'flashcard',
    label: 'Flashcard',
    category: 'Interactive',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" />
      </svg>
    ),
    description: 'Single flip card (front/back)',
  },
  {
    type: 'flashcard_deck',
    label: 'Flashcard Deck',
    category: 'Interactive',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h11a2 2 0 012 2v11a2 2 0 01-2 2H9a2 2 0 01-2-2V7zm-3 3V5a2 2 0 012-2h11" />
      </svg>
    ),
    description: 'Multiple flashcards with navigation',
  },
  {
    type: 'hotspot_image',
    label: 'Hotspot Image',
    category: 'Interactive',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
      </svg>
    ),
    description: 'Image with clickable hotspots',
  },
  {
    type: 'slider',
    label: 'Slider / Carousel',
    category: 'Interactive',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4 4-4m10 8l4-4-4-4M3 12h18" />
      </svg>
    ),
    description: 'Swipeable slides',
  },
  {
    type: 'reveal',
    label: 'Reveal',
    category: 'Interactive',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    description: 'Hidden content revealed on click',
  },
  {
    type: 'table',
    label: 'Table',
    category: 'Data & Comparison',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16M8 6v12M16 6v12" />
      </svg>
    ),
    description: 'Rows and columns',
  },
  {
    type: 'comparison',
    label: 'Comparison',
    category: 'Data & Comparison',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4h10M11 9h7M11 14h10M11 19h7M4 5h3v3H4V5zm0 10h3v3H4v-3z" />
      </svg>
    ),
    description: 'Side-by-side pros/cons',
  },
  {
    type: 'timeline',
    label: 'Timeline',
    category: 'Data & Comparison',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M3 12a9 9 0 1018 0 9 9 0 10-18 0z" />
      </svg>
    ),
    description: 'Chronological events',
  },
  {
    type: 'process_flow',
    label: 'Process Flow',
    category: 'Data & Comparison',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10v4H7V7zm0 10h10v4H7v-4zM12 11v6" />
      </svg>
    ),
    description: 'Workflow/decision steps',
  },
  {
    type: 'stats',
    label: 'Stats / Counter',
    category: 'Data & Comparison',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19h16M6 16V8m6 8V4m6 12v-6" />
      </svg>
    ),
    description: 'Highlighted metrics',
  },
  {
    type: 'callout',
    label: 'Callout',
    category: 'Callouts',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
      </svg>
    ),
    description: 'Tip / warning / note / info / success',
  },
  {
    type: 'highlight_box',
    label: 'Highlight Box',
    category: 'Callouts',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14v14H5V5z" />
      </svg>
    ),
    description: 'Colored emphasis box',
  },
  {
    type: 'glossary',
    label: 'Glossary',
    category: 'Reference',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h13v16H6a2 2 0 01-2-2V6z" />
      </svg>
    ),
    description: 'Terms + definitions list',
  },
  {
    type: 'definition',
    label: 'Definition',
    category: 'Reference',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 11h6M7 15h10M7 19h6" />
      </svg>
    ),
    description: 'Single term definition',
  },
  {
    type: 'code',
    label: 'Code Block',
    category: 'Reference',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
      </svg>
    ),
    description: 'Monospace code snippet',
  },
  {
    type: 'formula',
    label: 'Formula',
    category: 'Reference',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M9 17h6M10 7l4 10M14 7l-4 10" />
      </svg>
    ),
    description: 'LaTeX formula',
  },
  {
    type: 'citation',
    label: 'Citation',
    category: 'Reference',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10v10H7V7z" />
      </svg>
    ),
    description: 'Source reference',
  },
  {
    type: 'knowledge_check',
    label: 'Knowledge Check',
    category: 'Engagement',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M12 14a4 4 0 10-4-4" />
      </svg>
    ),
    description: 'Quick question (not graded)',
  },
  {
    type: 'reflection',
    label: 'Reflection',
    category: 'Engagement',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l9-5-9-5-9 5 9 5zM12 12l9-5-9-5-9 5 9 5z" />
      </svg>
    ),
    description: 'Prompt + optional response',
  },
  {
    type: 'poll',
    label: 'Poll',
    category: 'Engagement',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6m4 6V7m4 10v-4" />
      </svg>
    ),
    description: 'Vote / opinion question',
  },
  {
    type: 'discussion',
    label: 'Discussion Prompt',
    category: 'Engagement',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8m-8 4h6m-6 7l-4-4H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-6l-4 4z" />
      </svg>
    ),
    description: 'Prompt for comments',
  },
  {
    type: 'scenario',
    label: 'Scenario',
    category: 'Engagement',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h6M9 9h6M9 13h6M7 5h.01M7 9h.01M7 13h.01M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2h-3l-1-2h-4l-1 2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Situation + choices + feedback',
  },
  {
    type: 'drag_drop',
    label: 'Drag & Drop',
    category: 'Engagement',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h.01M8 15h.01M12 9h.01M12 15h.01M16 9h.01M16 15h.01" />
      </svg>
    ),
    description: 'Matching/sorting practice',
  },
  {
    type: 'two_column',
    label: 'Two Column',
    category: 'Layout',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h7v14H4V5zm9 0h7v14h-7V5z" />
      </svg>
    ),
    description: 'Side-by-side layout',
  },
  {
    type: 'three_column',
    label: 'Three Column',
    category: 'Layout',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h5v14H4V5zm7 0h5v14h-5V5zm7 0h2v14h-2V5z" />
      </svg>
    ),
    description: 'Three content columns',
  },
  {
    type: 'card_grid',
    label: 'Card Grid',
    category: 'Layout',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
      </svg>
    ),
    description: 'Grid of cards',
  },
  {
    type: 'spacer',
    label: 'Spacer',
    category: 'Layout',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 17h8M12 7v10" />
      </svg>
    ),
    description: 'Vertical space',
  },
  // Legacy blocks retained for older builder flows
  {
    type: 'quiz',
    label: 'Quiz (legacy)',
    category: 'Legacy',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    description: 'Legacy quiz placeholder',
  },
  {
    type: 'file',
    label: 'File (legacy)',
    category: 'Legacy',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Legacy file attachment',
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
  const [blockSearch, setBlockSearch] = useState('');
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptKind, setPromptKind] = useState<'module' | 'lesson'>('module');
  const [promptTargetId, setPromptTargetId] = useState<string>('');
  const [promptTitle, setPromptTitle] = useState('');
  const [promptLabel, setPromptLabel] = useState('');
  const [promptValue, setPromptValue] = useState('');
  const [promptPlaceholder, setPromptPlaceholder] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmDangerLabel, setConfirmDangerLabel] = useState('Delete');
  const [confirmOnConfirm, setConfirmOnConfirm] = useState<(() => void) | null>(null);

  const lessonCount = useMemo(
    () => modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0),
    [modules]
  );

  const openRename = (kind: 'module' | 'lesson', id: string, currentTitle: string) => {
    setPromptKind(kind);
    setPromptTargetId(id);
    setPromptTitle(kind === 'module' ? 'Rename module' : 'Rename lesson');
    setPromptLabel(kind === 'module' ? 'Module title' : 'Lesson title');
    setPromptPlaceholder(kind === 'module' ? 'e.g., Introduction' : 'e.g., What is Compliance?');
    setPromptValue(currentTitle || '');
    setPromptOpen(true);
  };

  const openDelete = (kind: 'module' | 'lesson', id: string, name: string) => {
    setConfirmTitle(kind === 'module' ? 'Delete module?' : 'Delete lesson?');
    setConfirmMessage(
      kind === 'module'
        ? `This will delete “${name}” and all of its lessons. This cannot be undone.`
        : `This will delete “${name}”. This cannot be undone.`
    );
    setConfirmDangerLabel(kind === 'module' ? 'Delete module' : 'Delete lesson');
    setConfirmOnConfirm(() => () => {
      if (kind === 'module') onDeleteModule(id);
      else onDeleteLesson(id);
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

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
                        openRename('module', m.id, m.title);
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
                        onClick={() => openDelete('module', m.id, m.title || `Module ${moduleIndex + 1}`)}
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
                              openRename('lesson', l.id, l.title);
                            }}
                            className="text-xs text-gray-400 hover:text-gray-600"
                            title="Rename lesson"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            onClick={() => openDelete('lesson', l.id, l.title || `Lesson ${lessonIndex + 1}`)}
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
          <p className="text-xs text-gray-500">Click to add a block</p>
          <input
            value={blockSearch}
            onChange={(e) => setBlockSearch(e.target.value)}
            placeholder="Search blocks..."
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />

          {(['Text & Basic','Lists & Steps','Media','Interactive','Data & Comparison','Callouts','Reference','Engagement','Layout','Legacy'] as const).map((category) => {
            const filtered = contentTypes.filter((b) => {
              if (b.category !== category) return false;
              const q = blockSearch.trim().toLowerCase();
              if (!q) return true;
              return `${b.label} ${b.description} ${b.type}`.toLowerCase().includes(q);
            });
            if (filtered.length === 0) return null;
            return (
              <div key={category} className="pt-2">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">{category}</p>
                <div className="space-y-2">
                  {filtered.map((contentType) => (
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
          })}
        </div>
      )}

      {/* Rename modal */}
      {promptOpen && (
        <div className="fixed inset-0 bg-primary-900/35 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{promptTitle}</h3>
              <button
                type="button"
                onClick={() => setPromptOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-3">
              <label className="block text-sm font-medium text-gray-700">{promptLabel}</label>
              <input
                autoFocus
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
                placeholder={promptPlaceholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const next = promptValue.trim();
                    if (!next) return;
                    if (promptKind === 'module') onRenameModule(promptTargetId, next);
                    else onRenameLesson(promptTargetId, next);
                    setPromptOpen(false);
                  }
                }}
              />
              <p className="text-xs text-gray-500">Tip: keep titles short and scannable.</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPromptOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = promptValue.trim();
                  if (!next) return;
                  if (promptKind === 'module') onRenameModule(promptTargetId, next);
                  else onRenameLesson(promptTargetId, next);
                  setPromptOpen(false);
                }}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-primary-900/35 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{confirmTitle}</h3>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">{confirmMessage}</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmOnConfirm?.()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {confirmDangerLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

