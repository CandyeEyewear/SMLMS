export function generateCourseOutlinePrompt(params: {
  topic: string;
  targetAudience?: string;
  industry?: string;
  tone?: 'formal' | 'conversational' | 'technical';
  moduleCount?: number;
  lessonsPerModule?: number;
  topicsToCover?: string;
  topicsToAvoid?: string;
  companyContext?: string;
}) {
  const {
    topic,
    targetAudience = 'adult learners',
    industry,
    tone = 'conversational',
    moduleCount = 4,
    lessonsPerModule = 3,
    topicsToCover,
    topicsToAvoid,
    companyContext,
  } = params;

  return `You are an expert instructional designer creating corporate training courses.
Generate clear, practical, engaging content suitable for adult learners.
Use simple language. Include real-world examples.

Create a course outline for: ${topic}

Target Audience: ${targetAudience}
${industry ? `Industry: ${industry}` : ''}
Tone: ${tone}
Structure: ${moduleCount} modules, ${lessonsPerModule} lessons per module

${topicsToCover ? `Topics to cover: ${topicsToCover}` : ''}
${topicsToAvoid ? `Topics to avoid: ${topicsToAvoid}` : ''}
${companyContext ? `Company context: ${companyContext}` : ''}

Return a JSON object with this structure:
{
  "title": "Course title",
  "description": "Course description (2-3 sentences)",
  "modules": [
    {
      "title": "Module title",
      "description": "Module description",
      "lessons": [
        {"title": "Lesson title", "summary": "Brief summary of what this lesson covers"}
      ],
      "quizTopic": "What the quiz at the end of this module should cover"
    }
  ]
}

Return ONLY valid JSON, no markdown formatting, no code blocks.`;
}

