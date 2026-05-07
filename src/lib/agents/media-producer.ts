import { logger } from '../utils/logger';
import { generateSpeech } from '../utils/elevenlabs';
import { SceneConfig } from '../types';
import fs from 'fs';
import path from 'path';

export async function mediaProducerAgent(
  lessonId: string, 
  videoScript: string, 
  sceneConfig: SceneConfig[]
): Promise<{ audioUrl: string | null; videoUrl: string | null }> {
  logger.info('Agent_MediaProducer', `Starting media production for lesson ${lessonId}`);
  
  let audioUrl: string | null = null;
  let videoUrl: string | null = null;

  // 1. Audio Production
  try {
    const audioOutputPath = path.join(process.cwd(), 'public', 'uploads', 'audio', `${lessonId}.mp3`);
    const success = await generateSpeech(videoScript, audioOutputPath);
    if (success) {
      audioUrl = `/uploads/audio/${lessonId}.mp3`;
    }
  } catch (error) {
    logger.error('Agent_MediaProducer', 'Error generating speech', error);
  }

  // 2. Video Rendering
  const manimUrl = process.env.MANIM_WORKER_URL;
  if (!manimUrl) {
    logger.warn('Agent_MediaProducer', 'MANIM_WORKER_URL not configured. Skipping video rendering.');
  } else {
    try {
      logger.info('Agent_MediaProducer', 'Sending scene_config to Manim worker...');
      const response = await fetch(`${manimUrl}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scene_config: sceneConfig })
      });
      
      if (!response.ok) {
        throw new Error(`Manim worker failed with status ${response.status}`);
      }
      
      const videoBuffer = await response.arrayBuffer();
      const videoOutputPath = path.join(process.cwd(), 'public', 'uploads', 'video', `${lessonId}.mp4`);
      
      const dir = path.dirname(videoOutputPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      fs.writeFileSync(videoOutputPath, Buffer.from(videoBuffer));
      videoUrl = `/uploads/video/${lessonId}.mp4`;
      logger.info('Agent_MediaProducer', 'Video rendered and saved successfully');
    } catch (error) {
      logger.error('Agent_MediaProducer', 'Error rendering video', error);
    }
  }

  return { audioUrl, videoUrl };
}
