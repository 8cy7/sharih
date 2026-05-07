import { callClaudeWithRetry, extractJsonFromMarkdown } from '../utils/claude';
import { logger } from '../utils/logger';

export interface SplitResult {
  title_en: string;
  title_ar: string;
  is_part: boolean;
  parent_topic: string | null;
  part_number: number | null;
  total_parts: number | null;
  start_marker: string;
  end_marker: string;
}

export async function readerSplitterAgent(fullText: string): Promise<SplitResult[]> {
  logger.info('Agent_ReaderSplitter', 'Starting text analysis and splitting...');

  const prompt = `
You are an expert educational designer. Analyze the following chapter text and split it into logical lessons ordered by pedagogical flow.
Rules:
1. Each lesson covers one coherent concept.
2. If a topic requires more than 5 minutes to explain, split it into parts (is_part: true).
3. Return STRICT JSON an array of objects. Do not wrap in markdown or add explanations outside the JSON array.
4. Each object MUST have: title_en, title_ar, is_part, parent_topic, part_number, total_parts, start_marker (a unique exact 10-15 word phrase from the original text where it starts), end_marker (unique exact 10-15 word phrase where it ends).

Text to analyze:
${fullText}
  `;

  try {
    const response = await callClaudeWithRetry({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content.find(block => block.type === 'text');
    if (!content || 'text' in content === false) {
      throw new Error("No text content returned from Claude");
    }

    const textContent = (content as { text: string }).text;
    const jsonString = extractJsonFromMarkdown(textContent);
    const parsed: SplitResult[] = JSON.parse(jsonString);
    logger.info('Agent_ReaderSplitter', `Successfully identified ${parsed.length} lessons`);
    return parsed;
  } catch (error) {
    logger.error('Agent_ReaderSplitter', 'Failed to split chapter', error);
    throw error;
  }
}
