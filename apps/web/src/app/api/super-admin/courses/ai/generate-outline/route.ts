import { createClient } from '@/lib/supabase/server';
import { openai } from '@/lib/openai/client';
import { generateCourseOutlinePrompt } from '@/lib/openai/prompts/course-outline';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      topic,
      targetAudience,
      industry,
      tone,
      moduleCount,
      lessonsPerModule,
      topicsToCover,
      topicsToAvoid,
      companyContext,
    } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = generateCourseOutlinePrompt({
      topic,
      targetAudience,
      industry,
      tone,
      moduleCount,
      lessonsPerModule,
      topicsToCover,
      topicsToAvoid,
      companyContext,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert instructional designer. Return only valid JSON, no markdown, no code blocks.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    const outline = JSON.parse(content);

    return NextResponse.json({ outline });
  } catch (error: any) {
    console.error('Error generating course outline:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate course outline' },
      { status: 500 }
    );
  }
}

