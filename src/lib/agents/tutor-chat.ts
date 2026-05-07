import { anthropic } from '../utils/claude';
import { logger } from '../utils/logger';
import { ChatMessage, Lesson, QuizQuestion } from '../types';

export async function tutorChatAgent(
  lesson: Lesson, 
  quizQuestions: QuizQuestion[],
  chatHistory: ChatMessage[],
  newMessage: string
): Promise<ReadableStream> {
  logger.info('Agent_TutorChat', `Initiating chat stream for lesson ${lesson.id}`);

  const systemPrompt = `You are a friendly Saudi university tutor. You know the following lesson content inside out. 
Answer the student's questions using ONLY the lesson content below. Always respond in Saudi dialect Arabic. 
If the student asks about something outside this lesson, politely tell them this lesson covers the specific topic and redirect them gently. 
Give examples. Be encouraging. Never say you are an AI — you are their tutor (شَارِح).

Lesson Content:
${lesson.lessonTextAr}

Quizzes Available for context:
${JSON.stringify(quizQuestions)}
`;

  const messages: import("@anthropic-ai/sdk").Anthropic.MessageParam[] = [
    ...chatHistory.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: 'user', content: newMessage }
  ];

  const stream = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    temperature: 0.7,
    system: systemPrompt,
    messages: messages,
    stream: true,
  });

  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let fullAssistantMessage = "";
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            fullAssistantMessage += chunk.delta.text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
          }
        }
        
        // Save to store here to persist the dynamic history
        import('../store').then(({ chatHistoryStore }) => {
            const history = chatHistoryStore.get(lesson.id) || [];
            chatHistoryStore.set(lesson.id, [...history, { role: 'assistant', content: fullAssistantMessage, timestamp: Date.now() }]);
            logger.info('Agent_TutorChat', `Appended assistant message (${fullAssistantMessage.length} chars) to history`);
        });

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        logger.error('Agent_TutorChat', 'Streaming failed', error);
        controller.error(error);
      }
    }
  });
}
