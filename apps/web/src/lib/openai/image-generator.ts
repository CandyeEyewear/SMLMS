import { getOpenAIClient } from './client';

export type ImageProvider = 'dalle' | 'flux';
export type ImageStyle = 'photo' | 'illustration' | 'diagram' | '3d';
export type ImageSize = '1024x1024' | '1792x1024' | '1024x1792';

export interface GenerateImageOptions {
  provider?: ImageProvider;
  style?: ImageStyle;
  size?: ImageSize;
  quality?: 'standard' | 'hd';
}

export interface GeneratedImage {
  url: string;
  revisedPrompt?: string;
  provider: ImageProvider;
}

/**
 * Generate an image using AI (DALL-E or Flux)
 */
export async function generateImage(
  prompt: string,
  options: GenerateImageOptions = {}
): Promise<GeneratedImage> {
  const provider = options.provider || 'dalle';

  if (provider === 'dalle') {
    return generateWithDalle(prompt, options);
  } else {
    return generateWithFlux(prompt, options);
  }
}

/**
 * Generate image using DALL-E 3
 */
async function generateWithDalle(
  prompt: string,
  options: GenerateImageOptions
): Promise<GeneratedImage> {
  const openai = getOpenAIClient();

  // Enhance prompt based on style
  const enhancedPrompt = enhancePromptForStyle(prompt, options.style);

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: enhancedPrompt,
    n: 1,
    size: options.size || '1024x1024',
    quality: options.quality || 'standard',
    response_format: 'url',
  });

  if (!response.data || response.data.length === 0) {
    throw new Error('No image data returned from DALL-E');
  }

  const imageData = response.data[0];

  if (!imageData?.url) {
    throw new Error('No image URL returned from DALL-E');
  }

  return {
    url: imageData.url,
    revisedPrompt: imageData.revised_prompt,
    provider: 'dalle',
  };
}

/**
 * Generate image using Flux (placeholder for future implementation)
 */
async function generateWithFlux(
  _prompt: string,
  _options: GenerateImageOptions
): Promise<GeneratedImage> {
  // Flux integration placeholder
  // Can be implemented with Replicate API or Black Forest Labs API
  throw new Error(
    'Flux provider is not yet implemented. Please use DALL-E for now.'
  );
}

/**
 * Enhance the prompt based on the desired style
 */
function enhancePromptForStyle(prompt: string, style?: ImageStyle): string {
  switch (style) {
    case 'photo':
      return `Professional photograph, realistic, high quality: ${prompt}`;
    case 'illustration':
      return `Clean digital illustration, modern flat design style, vibrant colors: ${prompt}`;
    case 'diagram':
      return `Clean educational diagram, labeled, clear and simple, professional infographic style: ${prompt}`;
    case '3d':
      return `3D render, professional lighting, clean background: ${prompt}`;
    default:
      return prompt;
  }
}

/**
 * Generate a prompt suggestion for course-related images
 */
export function generateImagePromptSuggestion(context: {
  courseTitle: string;
  lessonTitle: string;
  description?: string;
}): string {
  const { courseTitle, lessonTitle, description } = context;

  return `Create an educational image for a lesson titled "${lessonTitle}" in the course "${courseTitle}". ${
    description ? `The image should illustrate: ${description}` : ''
  } The image should be clean, professional, and suitable for an e-learning platform.`;
}
