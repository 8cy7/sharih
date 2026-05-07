import { NextRequest, NextResponse } from "next/server";
import { quizzesStore, quizAttemptsStore } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const quiz = quizzesStore.get(lessonId);
  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  // Strip correct answers (Handle both snake_case and camelCase due to LLM outputs)
  const safeQuestions = quiz.questions.map((q: any) => ({
    questionText: q.questionText || q.question_text || q.question,
    questionType: q.questionType || q.question_type || "mcq",
    options: q.options || q.choices || [],
    correctAnswer: q.correctAnswer || q.correct_answer || q.answer,
    explanationAr: q.explanationAr || q.explanation_ar || q.explanation,
  }));

  return NextResponse.json({ questions: safeQuestions }, { status: 200 });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ lessonId: string }> }) {
  try {
    const body = await req.json();
    const answers = body.answers || [];
    const visitorId = body.visitorId || "anonymous";
    const { lessonId } = await params;
    const quiz = quizzesStore.get(lessonId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    let correctCount = 0;
    const strongTopics: string[] = [];
    const weakTopics: string[] = [];
    
    const extractTopic = (text: string) => {
      const words = text.split(' ');
      const ignore = ["ما", "هي", "هو", "ماذا", "لماذا", "كيف", "من", "هل", "في", "على", "متى", "كم"];
      const filtered = words.filter(w => !ignore.includes(w));
      return filtered.slice(0, 2).join(' ') || "موضوع عام";
    };

    quiz.questions.forEach((q: any, idx) => {
      const studentAnswer = answers[idx]?.selectedAnswer;
      const correctAnswer = q.correctAnswer || q.correct_answer || q.answer;
      const questionText = q.questionText || q.question_text || q.question || "Topic";

      const topic = extractTopic(questionText);

      if (studentAnswer === correctAnswer) {
        correctCount++;
        if (!strongTopics.includes(topic)) strongTopics.push(topic);
      } else {
        if (!weakTopics.includes(topic)) weakTopics.push(topic);
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= 80;

    const attempt = {
      id: uuidv4(),
      visitorId: visitorId || "anonymous",
      lessonId: lessonId,
      answers,
      score,
      passed,
      strongTopics,
      weakTopics,
      attemptedAt: Date.now()
    };

    quizAttemptsStore.set(attempt.id, attempt);

    return NextResponse.json({
      score,
      passed,
      correctAnswers: quiz.questions.map((q: any) => ({
        correctAnswer: q.correctAnswer || q.correct_answer || q.answer,
        explanationAr: q.explanationAr || q.explanation_ar || q.explanation
      })),
      strongTopics,
      weakTopics
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
