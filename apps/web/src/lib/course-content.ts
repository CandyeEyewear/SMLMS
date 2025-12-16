export type NormalizedLessonBlock = {
  id: string;
  block_type: string;
  content: any;
  sort_order: number;
};

type BuilderBlock = {
  id: string;
  type: string;
  data?: any;
  order?: number;
};

type AlreadyNormalizedBlock = {
  id: string;
  block_type: string;
  content: any;
  sort_order: number;
};

function isAlreadyNormalizedBlock(b: any): b is AlreadyNormalizedBlock {
  return b && typeof b === 'object' && typeof b.block_type === 'string';
}

function toTextContent(data: any) {
  // Builder stores { title?: string, content?: string } for text blocks.
  // Learner renderer supports { title?: string, text?: string, content?: string }.
  if (!data || typeof data !== 'object') return { text: '' };
  return {
    title: typeof data.title === 'string' ? data.title : undefined,
    // Prefer `text` if provided, else fall back to `content`
    text: typeof data.text === 'string' ? data.text : undefined,
    content: typeof data.content === 'string' ? data.content : undefined,
  };
}

function normalizeContentForRenderer(blockType: string, data: any) {
  switch (blockType) {
    case 'text':
      return toTextContent(data);
    case 'video':
    case 'image':
    case 'file':
    case 'embed':
    case 'quiz':
      return data ?? {};
    default:
      return data ?? {};
  }
}

/**
 * Normalizes a lesson's stored JSON into the learner-renderer-friendly shape:
 * - Accepts either builder blocks: { id, type, data, order }
 * - Or already-normalized blocks: { id, block_type, content, sort_order }
 */
export function normalizeLessonBlocks(lessonContent: any): NormalizedLessonBlock[] {
  const rawBlocks = lessonContent?.blocks;
  if (!Array.isArray(rawBlocks)) return [];

  return rawBlocks.map((b: any, index: number) => {
    if (isAlreadyNormalizedBlock(b)) {
      return {
        id: b.id,
        block_type: b.block_type,
        content: b.content,
        sort_order: typeof b.sort_order === 'number' ? b.sort_order : index,
      };
    }

    const builder = b as BuilderBlock;
    const blockType = typeof builder.type === 'string' ? builder.type : 'unknown';
    return {
      id: builder.id || `block-${index}`,
      block_type: blockType,
      content: normalizeContentForRenderer(blockType, builder.data),
      sort_order: typeof builder.order === 'number' ? builder.order : index,
    };
  });
}

