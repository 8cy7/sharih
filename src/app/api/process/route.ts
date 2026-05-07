import { NextRequest, NextResponse } from "next/server";
import { processChapter } from "@/lib/agents/pipeline";
import { logger } from "@/lib/utils/logger";

export async function POST(req: NextRequest) {
  try {
    const { chapterId } = await req.json();
    if (!chapterId) {
      return NextResponse.json({ error: "Missing chapterId" }, { status: 400 });
    }

    // Fire and forget: run the orchestrator in the background to prevent timeout
    processChapter(chapterId).catch(err => {
        logger.error("ProcessAPI", `Background processing failed for ${chapterId}`, err);
    });

    return NextResponse.json({ success: true, message: "Processing started" }, { status: 202 });

  } catch (error: any) {
    logger.error("ProcessAPI", "Failed to start pipeline", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
