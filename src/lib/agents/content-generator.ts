import { callClaudeWithRetry, extractJsonFromMarkdown } from '../utils/claude';
import { logger } from '../utils/logger';
import { SceneConfig, QuizQuestion } from '../types';

export interface ContentGenerationResult {
  lesson_text_ar: string;
  video_script: string;
  scene_config: SceneConfig[];
  quiz_questions: QuizQuestion[];
}

export async function contentGeneratorAgent(lessonTextSlice: string): Promise<ContentGenerationResult> {
  logger.info('Agent_ContentGenerator', 'Generating Saudi dialect explanation, script, scenes, and quizzes...');

  const prompt = `
You are a friendly Saudi university tutor helping a student friend.
Rewrite the following lesson text to be engaging.

Requirements:
1. Write everything in Saudi dialect Arabic.
2. Use examples from Saudi daily life.
3. Return STRICT JSON with exact keys:
- lesson_text_ar: Full lesson explanation in Saudi dialect. Include section headings, examples. Minimum 500 words.
- video_script: Narration script opening with a greeting like "هلا والله...". Written exactly as spoken.
- scene_config: JSON array of Manim scene configs. Must have 'type'. Available types: title, bullets, definition, comparison, flowchart, example, summary, quiz_intro. Every lesson must start with 'title' and end with 'summary' then 'quiz_intro'.
CRITICAL SCENE CONFIG RULES:
- bullets MUST be an array of arrays exactly like this: [["English term", "الشرح بالعربي", "emoji"]]
- steps MUST be an array of arrays exactly like this: [["Step name", "اسم الخطوة", "emoji"]]
- scenario_steps MUST be an array of strings: ["الخطوة الأولى", "الخطوة الثانية"]
- left_points and right_points MUST be an array of strings: ["Point 1", "Point 2"]
- key_points MUST be an array of strings

EXAMPLE SCENE CONFIG:
[
  { "type": "title", "title": "مقدمة الدرس", "subtitle": "التفكير التصميمي" },
  { "type": "bullets", "title": "النقاط الرئيسية", "bullets": [["Empathy", "التعاطف مع المستخدم", "🤝"], ["Ideation", "توليد الأفكار", "💡"]] },
  { "type": "flowchart", "title": "خطوات العمل", "steps": [["Research", "البحث", "🔍"], ["Design", "التصميم", "🎨"]] },
  { "type": "comparison", "title": "مقارنة سريعة", "left_title": "التقليدي", "left_points": ["بطيء", "مكلف"], "right_title": "الحديث", "right_points": ["سريع", "مرن"] },
  { "type": "summary", "title": "الخلاصة", "key_points": ["التعاطف أساس التصميم", "التجربة أهم من الشكل"] }
]
- quizQuestions: Array of 5-8 question objects { questionText (Arabic), questionType ("mcq" or "true_false"), options (array of strings, 4 for mcq, 2 for true_false), correctAnswer, explanationAr (Saudi dialect explanation) }. Give correctAnswer exactly matching an option string.

Lesson Text:
${lessonTextSlice}
  `;

  try {
    const response = await callClaudeWithRetry({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      temperature: 0.5,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content.find(block => block.type === 'text');
    if (!content || 'text' in content === false) throw new Error("No text content returned from Claude");

    const textContent = (content as { text: string }).text;
    const jsonString = extractJsonFromMarkdown(textContent);
    let parsed = JSON.parse(jsonString);

    // Map snake_case to camelCase just in case Claude hallucinates old properties
    const mappedQuestions = (parsed.quiz_questions || parsed.quizQuestions || []).map((q: any) => ({
      questionText: q.questionText || q.question_text || q.question,
      questionType: q.questionType || q.question_type || "mcq",
      options: q.options || q.choices || [],
      correctAnswer: q.correctAnswer || q.correct_answer || q.answer,
      explanationAr: q.explanationAr || q.explanation_ar || q.explanation
    }));

    return {
      lesson_text_ar: parsed.lesson_text_ar || parsed.lessonTextAr,
      video_script: parsed.video_script || parsed.videoScript,
      scene_config: parsed.scene_config || parsed.sceneConfig,
      quiz_questions: mappedQuestions
    };
  } catch (error) {
    logger.error('Agent_ContentGenerator', 'Failed to generate content', error);
    throw error;
  }
}
