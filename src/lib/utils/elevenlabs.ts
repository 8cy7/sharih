import { logger } from './logger';
import fs from 'fs';
import path from 'path';

export async function generateSpeech(text: string, outputPath: string): Promise<boolean> {
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!voiceId || !apiKey) {
    logger.warn('ElevenLabs', 'API key or Voice ID not set. Skipping TTS.');
    return false;
  }

  try {
    logger.info('ElevenLabs', `Generating speech for text length ${text.length}`);
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
       },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} ${errText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Ensure dir exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, buffer);
    logger.info('ElevenLabs', `Speech generated successfully at ${outputPath}`);
    return true;
  } catch (error) {
    logger.error('ElevenLabs', 'Failed to generate speech:', error);
    return false;
  }
}
