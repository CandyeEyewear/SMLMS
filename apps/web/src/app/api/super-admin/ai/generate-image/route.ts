import { createClient } from '@/lib/supabase/server';
import { generateImage, ImageProvider, ImageStyle, ImageSize } from '@/lib/openai/image-generator';
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
    const { prompt, provider, style, size, quality } = body as {
      prompt: string;
      provider?: ImageProvider;
      style?: ImageStyle;
      size?: ImageSize;
      quality?: 'standard' | 'hd';
    };

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (prompt.length > 4000) {
      return NextResponse.json(
        { error: 'Prompt is too long (max 4000 characters)' },
        { status: 400 }
      );
    }

    // Generate image with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const result = await generateImage(prompt, {
        provider: provider || 'dalle',
        style: style || 'illustration',
        size: size || '1024x1024',
        quality: quality || 'standard',
      });

      clearTimeout(timeoutId);

      return NextResponse.json({
        success: true,
        image: {
          url: result.url,
          revisedPrompt: result.revisedPrompt,
          provider: result.provider,
        },
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Image generation timed out. Please try again.' },
          { status: 504 }
        );
      }

      throw err;
    }
  } catch (error: unknown) {
    console.error('Error generating image:', error);

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('content_policy_violation')) {
        return NextResponse.json(
          { error: 'The prompt was rejected due to content policy. Please try a different description.' },
          { status: 400 }
        );
      }
      if (error.message.includes('rate_limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait a moment and try again.' },
          { status: 429 }
        );
      }
      if (error.message.includes('billing')) {
        return NextResponse.json(
          { error: 'OpenAI billing issue. Please check your API account.' },
          { status: 402 }
        );
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}
