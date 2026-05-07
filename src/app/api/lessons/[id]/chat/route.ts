import { NextRequest, NextResponse } from "next/server";
import { lessonsStore, chatHistoryStore, quizzesStore } from "@/lib/store";
import { tutorChatAgent } from "@/lib/agents/tutor-chat";
import { ChatMessage } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const { id } = await params;
    const lesson = lessonsStore.get(id);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const quiz = quizzesStore.get(id);
    const quizQuestions = quiz ? quiz.questions : [];

    const history = chatHistoryStore.get(id) || [];
    
    // Append new user message to history
    const newMessage: ChatMessage = { role: "user", content: message, timestamp: Date.now() };
    const updatedHistory = [...history, newMessage];
    
    chatHistoryStore.set(id, updatedHistory);

    const stream = await tutorChatAgent(lesson, quizQuestions, history, message);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
