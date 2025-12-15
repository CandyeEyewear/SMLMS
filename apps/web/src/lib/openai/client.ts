import OpenAI from 'openai';

// Lazy-initialize OpenAI client to avoid build-time errors on Vercel
// The client is only created when actually needed at runtime
let openaiInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiInstance;
}

// For backwards compatibility - lazy getter
export const openai = new Proxy({} as OpenAI, {
  get(_, prop) {
    return getOpenAIClient()[prop as keyof OpenAI];
  },
});

