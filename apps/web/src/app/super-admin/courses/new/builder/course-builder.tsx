'use client';

import { useState, useCallback } from 'react';
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ContentBlock } from './content-block';
import { ContentSidebar } from './content-sidebar';
import { CourseMetadataForm } from './course-metadata-form';

export type ContentBlockType = {
  id: string;
  type: 'video' | 'image' | 'text' | 'quiz' | 'file' | 'embed';
  data: any;
  order: number;
};

type Lesson = {
  id: string;
  title: string;
  description?: string;
  duration_minutes?: number | null;
  blocks: ContentBlockType[];
};

type Module = {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
};

export type CourseMetadata = {
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  duration_minutes: number | null;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
};

interface CourseBuilderProps {
  categories: { id: string; name: string }[];
  courseId?: string;
  initialBlocks?: ContentBlockType[]; // legacy; blocks now live under lessons
  initialMetadata?: CourseMetadata;
}

function safeUuid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback shouldn't happen in modern browsers; keep deterministic-ish.
  return `00000000-0000-4000-8000-${Math.random().toString(16).slice(2).padEnd(12, '0').slice(0, 12)}`;
}

export function CourseBuilder({ categories, courseId, initialBlocks = [], initialMetadata }: CourseBuilderProps) {
  const router = useRouter();
  const initialModuleId = safeUuid();
  const initialLessonId = safeUuid();

  const [modules, setModules] = useState<Module[]>(() => {
    // Start with a basic structure to match the guide (module + lesson), unless editing.
    if (courseId) return [];
    return [
      {
        id: initialModuleId,
        title: 'Module 1',
        lessons: [
          {
            id: initialLessonId,
            title: 'Lesson 1',
            blocks: (initialBlocks || []).map((b, i) => ({ ...b, order: i })),
          },
        ],
      },
    ];
  });

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(() => {
    if (courseId) return null;
    return initialLessonId;
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlockType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMetadataForm, setShowMetadataForm] = useState(!courseId || !initialMetadata);

  const [metadata, setMetadata] = useState<CourseMetadata>(
    initialMetadata || {
      title: '',
      slug: '',
      description: '',
      thumbnail_url: '',
      duration_minutes: null,
      category_id: '',
      is_active: true,
      is_featured: false,
    }
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setModules((prev) =>
        prev.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) => {
            if (l.id !== selectedLessonId) return l;
            const oldIndex = l.blocks.findIndex((item) => item.id === active.id);
            const newIndex = l.blocks.findIndex((item) => item.id === over.id);
            const reordered = arrayMove(l.blocks, oldIndex, newIndex).map((item, index) => ({
              ...item,
              order: index,
            }));
            return { ...l, blocks: reordered };
          }),
        }))
      );
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const findLesson = useCallback(
    (lessonId: string | null) => {
      if (!lessonId) return null;
      for (const m of modules) {
        const l = m.lessons.find((x) => x.id === lessonId);
        if (l) return l;
      }
      return null;
    },
    [modules]
  );

  const selectedLesson = findLesson(selectedLessonId);
  const blocks = selectedLesson?.blocks || [];

  const addBlock = useCallback((type: ContentBlockType['type'], data: any = {}) => {
    if (!selectedLessonId) {
      setError('Select or create a lesson before adding blocks.');
      return;
    }
    const newBlock: ContentBlockType = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      order: blocks.length,
    };
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => (l.id === selectedLessonId ? { ...l, blocks: [...l.blocks, newBlock] } : l)),
      }))
    );
    setSelectedBlock(newBlock);
  }, [blocks.length, selectedLessonId]);

  const updateBlock = useCallback((id: string, data: any) => {
    if (!selectedLessonId) return;
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => {
          if (l.id !== selectedLessonId) return l;
          return {
            ...l,
            blocks: l.blocks.map((block) =>
              block.id === id ? { ...block, data: { ...block.data, ...data } } : block
            ),
          };
        }),
      }))
    );
    setSelectedBlock((prev) => (prev?.id === id ? { ...prev!, data: { ...prev!.data, ...data } } : prev));
  }, [selectedLessonId]);

  const deleteBlock = useCallback((id: string) => {
    if (!selectedLessonId) return;
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => {
          if (l.id !== selectedLessonId) return l;
          const filtered = l.blocks.filter((block) => block.id !== id);
          return { ...l, blocks: filtered.map((block, index) => ({ ...block, order: index })) };
        }),
      }))
    );
    if (selectedBlock?.id === id) {
      setSelectedBlock(null);
    }
  }, [selectedBlock, selectedLessonId]);

  const duplicateBlock = useCallback((id: string) => {
    if (!selectedLessonId) return;
    const blockToDuplicate = blocks.find((b) => b.id === id);
    if (!blockToDuplicate) return;
    const newBlock: ContentBlockType = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: blockToDuplicate.type,
      data: { ...blockToDuplicate.data },
      order: blocks.length,
    };
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => (l.id === selectedLessonId ? { ...l, blocks: [...l.blocks, newBlock] } : l)),
      }))
    );
  }, [blocks, selectedLessonId]);

  const addModule = useCallback(() => {
    const id = safeUuid();
    setModules((prev) => [
      ...prev,
      {
        id,
        title: `Module ${prev.length + 1}`,
        lessons: [],
      },
    ]);
  }, []);

  const addLesson = useCallback((moduleId: string) => {
    const lessonId = safeUuid();
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        const nextLessonNumber = (m.lessons?.length || 0) + 1;
        const next = {
          id: lessonId,
          title: `Lesson ${nextLessonNumber}`,
          blocks: [] as ContentBlockType[],
        };
        return { ...m, lessons: [...m.lessons, next] };
      })
    );
    setSelectedLessonId(lessonId);
    setSelectedBlock(null);
  }, []);

  const renameModule = useCallback((moduleId: string, title: string) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, title } : m)));
  }, []);

  const renameLesson = useCallback((lessonId: string, title: string) => {
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, title } : l)),
      }))
    );
  }, []);

  const deleteLesson = useCallback(
    (lessonId: string) => {
      setModules((prev) =>
        prev.map((m) => ({
          ...m,
          lessons: m.lessons.filter((l) => l.id !== lessonId),
        }))
      );
      if (selectedLessonId === lessonId) {
        setSelectedLessonId(null);
        setSelectedBlock(null);
      }
    },
    [selectedLessonId]
  );

  const deleteModule = useCallback(
    (moduleId: string) => {
      const mod = modules.find((m) => m.id === moduleId);
      const lessonIds = new Set((mod?.lessons || []).map((l) => l.id));
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
      if (selectedLessonId && lessonIds.has(selectedLessonId)) {
        setSelectedLessonId(null);
        setSelectedBlock(null);
      }
    },
    [modules, selectedLessonId]
  );

  const handleSave = async () => {
    if (!metadata.title.trim()) {
      setError('Course title is required');
      return;
    }

    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    if (totalLessons === 0) {
      setError('Add at least one lesson before saving.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/super-admin/courses/builder/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          metadata,
          modules: modules.map((m, moduleIndex) => ({
            id: m.id,
            title: m.title,
            description: m.description || '',
            sort_order: moduleIndex,
            lessons: m.lessons.map((l, lessonIndex) => ({
              id: l.id,
              title: l.title,
              description: l.description || '',
              sort_order: lessonIndex,
              duration_minutes: l.duration_minutes ?? null,
              content: {
                blocks: (l.blocks || []).map((b, i) => ({ ...b, order: i })),
              },
            })),
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save course');
      }

      router.push(`/super-admin/courses/${data.courseId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  const activeBlock = activeId ? blocks.find((block) => block.id === activeId) : null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/super-admin/courses/new"
            className="text-gray-500 hover:text-gray-700 text-sm inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Course Builder</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMetadataForm(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Course Settings
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || modules.reduce((acc, m) => acc + m.lessons.length, 0) === 0}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : courseId ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Form Modal */}
      {showMetadataForm && (
        <CourseMetadataForm
          metadata={metadata}
          categories={categories}
          onUpdate={setMetadata}
          onClose={() => setShowMetadataForm(false)}
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <ContentSidebar
          onAddBlock={addBlock}
          modules={modules.map((m) => ({ id: m.id, title: m.title, lessons: m.lessons.map((l) => ({ id: l.id, title: l.title })) }))}
          selectedLessonId={selectedLessonId}
          onSelectLesson={(lessonId) => {
            setSelectedLessonId(lessonId);
            setSelectedBlock(null);
          }}
          onAddModule={addModule}
          onAddLesson={addLesson}
          onRenameModule={renameModule}
          onRenameLesson={renameLesson}
          onDeleteModule={(moduleId) => {
            const ok = window.confirm('Delete this module and its lessons?');
            if (ok) deleteModule(moduleId);
          }}
          onDeleteLesson={(lessonId) => {
            const ok = window.confirm('Delete this lesson?');
            if (ok) deleteLesson(lessonId);
          }}
        />

        {/* Main Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="max-w-4xl mx-auto space-y-4">
              {!selectedLessonId ? (
                <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select a lesson</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Use the Structure tab to create or select a lesson, then add blocks.
                  </p>
                </div>
              ) : blocks.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No content blocks yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Add content blocks from the Blocks tab to get started</p>
                </div>
              ) : (
                <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                  {blocks.map((block) => (
                    <SortableBlock
                      key={block.id}
                      block={block}
                      isSelected={selectedBlock?.id === block.id}
                      onSelect={() => setSelectedBlock(block)}
                      onUpdate={updateBlock}
                      onDelete={deleteBlock}
                      onDuplicate={duplicateBlock}
                    />
                  ))}
                </SortableContext>
              )}
            </div>

            <DragOverlay>
              {activeBlock ? (
                <div className="opacity-50">
                  <ContentBlock
                    block={activeBlock}
                    isSelected={false}
                    onSelect={() => {}}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                    onDuplicate={() => {}}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Properties Panel */}
        {selectedBlock && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Block Properties</h2>
              <button
                onClick={() => setSelectedBlock(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ContentBlock
              block={selectedBlock}
              isSelected={true}
              onSelect={() => {}}
              onUpdate={updateBlock}
              onDelete={deleteBlock}
              onDuplicate={duplicateBlock}
              showProperties={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SortableBlock({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  block: ContentBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        className={`bg-white rounded-lg border-2 transition-all ${
          isSelected ? 'border-primary-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
          <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
              >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase">{block.type}</span>
          <div className="flex-1" />
          <button
            onClick={() => onDuplicate(block.id)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Duplicate"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(block.id)}
            className="p-1 text-gray-400 hover:text-red-600"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <div onClick={onSelect} className="cursor-pointer">
          <ContentBlock
            block={block}
            isSelected={isSelected}
            onSelect={onSelect}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        </div>
      </div>
    </div>
  );
}

