import { NextRequest, NextResponse } from "next/server";
import { lessonsStore } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = lessonsStore.get(id);
  
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json(lesson, { status: 200 });
}
