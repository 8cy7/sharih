import { NextRequest, NextResponse } from "next/server";
import { chaptersStore, lessonsStore } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = chaptersStore.get(id);
  
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  const lessons = chapter.lessonIds.map(id => {
    const lesson = lessonsStore.get(id);
    if (!lesson) return null;
    return {
      id: lesson.id,
      lessonNumber: lesson.lessonNumber,
      titleEn: lesson.titleEn,
      titleAr: lesson.titleAr,
      isPart: lesson.isPart,
      parentTopic: lesson.parentTopic,
      partNumber: lesson.partNumber,
      totalParts: lesson.totalParts,
      processingStatus: lesson.processingStatus,
      durationSeconds: lesson.durationSeconds,
      hasVideo: !!lesson.videoUrl,
      hasAudio: !!lesson.audioUrl
    };
  }).filter(Boolean);

  return NextResponse.json({
    chapter: {
      id: chapter.id,
      title: chapter.title,
      subjectName: chapter.subjectName,
      processingStatus: chapter.processingStatus,
      processingError: chapter.processingError,
      createdAt: chapter.createdAt
    },
    lessons
  }, { status: 200 });
}
