export function generateLessonContentPrompt(params: {
  courseTitle: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonSummary?: string;
  targetAudience?: string;
  tone?: 'formal' | 'conversational' | 'technical';
}) {
  const {
    courseTitle,
    moduleTitle,
    lessonTitle,
    lessonSummary,
    targetAudience = 'adult learners',
    tone = 'conversational',
  } = params;

  return `Create lesson content for:

Course: ${courseTitle}
Module: ${moduleTitle}
Lesson: ${lessonTitle}
${lessonSummary ? `Summary: ${lessonSummary}` : ''}

Target Audience: ${targetAudience}
Tone: ${tone}

Return content as an array of blocks using varied types. Use a mix of:
- text (paragraphs)
- bullet_list (key points)
- numbered_steps (procedures)
- accordion (expandable sections)
- callout (important notes, tips, warnings)
- table (data comparison)
- comparison (do/don't examples)

Return JSON:
{
  "blocks": [
    {
      "block_type": "text",
      "content": {
        "text": "Content here with **markdown** support"
      }
    },
    {
      "block_type": "bullet_list",
      "content": {
        "title": "Key Points",
        "items": ["Point 1", "Point 2"]
      }
    },
    {
      "block_type": "callout",
      "content": {
        "type": "tip",
        "title": "Pro Tip",
        "text": "Helpful information"
      }
    }
  ],
  "suggested_media": [
    {
      "type": "image",
      "description": "Description of image needed",
      "placement": "after_block_2"
    }
  ]
}

Return ONLY valid JSON, no markdown formatting, no code blocks.`;
}

