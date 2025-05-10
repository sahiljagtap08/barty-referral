import { Voice } from 'elevenlabs/api';

// Initialize ElevenLabs client
const apiKey = process.env.ELEVENLABS_API_KEY || '';

// This will be configured with your preferred voices
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_DEFAULT_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // Use your preferred voice ID

export interface TTSOptions {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  model?: string;
}

/**
 * Converts text to speech using ElevenLabs API
 */
export async function textToSpeech(
  text: string,
  options: TTSOptions = {}
): Promise<ArrayBuffer> {
  const {
    voiceId = DEFAULT_VOICE_ID,
    stability = 0.5,
    similarityBoost = 0.5,
    model = 'eleven_turbo_v2',
  } = options;

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: model,
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
  }

  return await response.arrayBuffer();
}

/**
 * Get available voices from ElevenLabs
 */
export async function getVoices(): Promise<Voice[]> {
  const url = 'https://api.elevenlabs.io/v1/voices';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.voices || [];
}

/**
 * Converts speech to text using OpenAI Whisper via ElevenLabs API
 */
export async function speechToText(audioBuffer: ArrayBuffer): Promise<string> {
  const url = 'https://api.elevenlabs.io/v1/speech-to-text';
  
  // Create a blob from the array buffer
  const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
  
  // Create FormData and append the audio file
  const formData = new FormData();
  formData.append('file', blob, 'audio.mp3');
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs STT API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.text || '';
} 