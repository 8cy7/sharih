import { NextResponse } from "next/server";
import { chaptersStore } from "@/lib/store";

export async function GET() {
  const chapters = Array.from(chaptersStore.values()).sort((a, b) => b.createdAt - a.createdAt);
  
  // Return summarized version (omitting full extracted text for payload size)
  const summaries = chapters.map(c => ({
    id: c.id,
    title: c.title,
    subjectName: c.subjectName,
    originalFileName: c.originalFileName,
    totalLessons: c.totalLessons,
    processingStatus: c.processingStatus,
    processingError: c.processingError,
    createdAt: c.createdAt
  }));

  return NextResponse.json(summaries, { status: 200 });
}
