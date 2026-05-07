import Anthropic from '@anthropic-ai/sdk';
import { logger } from './logger';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Strips markdown fences (e.g. ```json ... ```) from a string to safely parse it
 */
export function extractJsonFromMarkdown(text: string): string {
  if (!text) return "";
  let cleanText = text.trim();
  // Strip opening markdown code block if present
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```[a-z]*\n/, '');
  }
  // Strip closing markdown code block if present
  if (cleanText.endsWith('```')) {
    cleanText = cleanText.replace(/\n```$/, '');
  }
  return cleanText.trim();
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calls Claude with retry logic (exponential backoff) for rate limits and server errors
 */
export async function callClaudeWithRetry(params: Anthropic.MessageCreateParamsNonStreaming, retries = 3): Promise<Anthropic.Message> {
  let attempt = 0;
  
  while (attempt < retries) {
    try {
      const response = await anthropic.messages.create(params);
      return response;
    } catch (error: any) {
      attempt++;
      const isRateLimitOrServerError = error?.status === 429 || error?.status >= 500;
      
      if (!isRateLimitOrServerError || attempt >= retries) {
        logger.error('Claude_API', `Request failed permanently after ${attempt} attempts`, error);
        throw error;
      }
      
      const backoffMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s...
      logger.warn('Claude_API', `Rate limit or server error. Retrying in ${backoffMs}ms... (Attempt ${attempt}/${retries})`);
      await sleep(backoffMs);
    }
  }
  
  throw new Error("unreachable");
}
