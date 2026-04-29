import { GoogleGenAI, Type, Modality } from "@google/genai";
import OpenAI from "openai";
import { UserProfile } from "../types";
import { AudioCache } from "../lib/audioCache";
import { wrapPcmInWav } from "../lib/audioUtils";

// Simple hash function for cache keys
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

// Initialize Gemini
// In a Vite/browser environment, process.env is usually not defined.
// The AI Studio environment handles GEMINI_API_KEY specifically.
const getSafeEnv = (key: string) => {
  try {
    // Try process.env for Node/Build-time
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}
  
  try {
    // Try import.meta.env for Vite
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[`VITE_${key}`]) {
      // @ts-ignore
      return import.meta.env[`VITE_${key}`];
    }
  } catch (e) {}
  
  return "";
};

const geminiApiKey = getSafeEnv('GEMINI_API_KEY');
const geminiAi = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// Initialize OpenAI
const openaiApiKey = getSafeEnv('OPENAI_API_KEY');
const openaiAi = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey, dangerouslyAllowBrowser: true }) : null;

export class AIServiceError extends Error {
  constructor(
    message: string, 
    public service: 'Gemini' | 'OpenAI' | 'ElevenLabs' | 'All',
    public type: 'Config' | 'Network' | 'Quota' | 'Unknown' = 'Unknown',
    public originalError?: any
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export const checkAIHealth = async () => {
  const status = {
    gemini: { ok: false, message: 'Not configured' },
    openai: { ok: false, message: 'Not configured' },
    elevenlabs: { ok: false, message: 'Not configured' }
  };

  if (geminiAi) {
    try {
      // Small test call
      const response = await geminiAi.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Health check",
      });
      if (response.text) status.gemini = { ok: true, message: 'Ready' };
    } catch (e: any) {
      status.gemini = { ok: false, message: e.message?.includes('quota') ? 'Quota Exceeded' : 'Error: ' + e.message };
    }
  }

  if (openaiAi) {
    try {
      const response = await openaiAi.chat.completions.create({
        model: "gpt-4o-mini", // Use mini for faster/cheaper check
        messages: [{ role: "user", content: "hi" }],
        max_tokens: 5
      });
      if (response.choices[0]) status.openai = { ok: true, message: 'Ready' };
    } catch (e: any) {
      status.openai = { ok: false, message: e.message?.includes('quota') ? 'Quota Exceeded' : 'Error: ' + (e.status || e.message) };
    }
  }

  // ElevenLabs check via server
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      status.elevenlabs = { ok: true, message: 'Ready' };
    }
  } catch (e) {
    status.elevenlabs = { ok: false, message: 'Server unavailable' };
  }

  return status;
};

const checkHealth = () => {
  if (!geminiAi && !openaiAi) {
    throw new AIServiceError("AI services are not configured. Please check your environment variables.", 'All', 'Config');
  }
};

export const generateText = async (prompt: string, systemInstruction?: string) => {
  checkHealth();
  
  // Try Gemini first
  if (geminiAi) {
    try {
      const response = await geminiAi.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        }
      });
      if (response.text) return response.text;
    } catch (e: any) {
      console.error("Gemini text generation failed:", e);
      if (e.message?.includes('quota') || e.status === 429) {
        console.warn("Gemini quota exceeded. Engaging OpenAI backup...");
      }
    }
  }

  // Fallback to OpenAI
  if (openaiAi) {
    try {
      console.log("Using OpenAI backup for text generation...");
      const response = await openaiAi.chat.completions.create({
        model: "gpt-4o",
        messages: [
          ...(systemInstruction ? [{ role: "system" as const, content: systemInstruction }] : []),
          { role: "user" as const, content: prompt }
        ],
      });
      return response.choices[0].message.content;
    } catch (e: any) {
      console.error("OpenAI backup text generation failed:", e);
      throw new AIServiceError("All text generation services failed. Check your OpenAI API key and usage limits.", 'All', e.message?.includes('quota') ? 'Quota' : 'Network', e);
    }
  }

  const errorMsg = geminiAi 
    ? "Gemini failed and no OpenAI backup is configured. Provide an OPENAI_API_KEY for automatic failover."
    : "No AI text generation services are configured.";
  throw new AIServiceError(errorMsg, 'All', 'Config');
};

export const generateStudyPlan = async (profile: UserProfile) => {
  checkHealth();
  
  const prompt = `
    Generate a personalized study plan for a student studying Ultrasound Physics (SPI Exam).
    
    Student Profile:
    - Name: ${profile.name || 'Student'}
    - Study Goals: ${profile.studyGoals || 'General SPI Exam Mastery'}
    - Learning Style: ${profile.learningStyle || 'Visual'}
    - Birth Date: ${profile.birthDate || 'Not provided'}
    - Birth Time: ${profile.birthTime || 'Not provided'}
    
    The plan must include:
    1. A list of 5 specific AI-generated study techniques tailored to their learning style.
    2. A weekly schedule (7 days) with specific topics to cover each day.
    3. Spiritual timing windows (2 favorable, 1 unfavorable) based on their birth info (if provided). If not provided, use general high-energy windows.
    
    Return the response in JSON format.
  `;

  // Try Gemini first with structured output
  if (geminiAi) {
    try {
      const response = await geminiAi.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              techniques: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "5 study techniques"
              },
              schedule: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    label: { type: Type.STRING },
                    topics: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["day", "label", "topics"]
                }
              },
              spiritualWindows: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    start: { type: Type.STRING },
                    end: { type: Type.STRING },
                    label: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["favorable", "unfavorable"] }
                  },
                  required: ["start", "end", "label", "type"]
                }
              }
            },
            required: ["techniques", "schedule", "spiritualWindows"]
          }
        }
      });
      if (response.text) return JSON.parse(response.text);
    } catch (e: any) {
      console.error("Gemini study plan generation failed:", e);
    }
  }

  // Fallback to OpenAI
  if (openaiAi) {
    try {
      const response = await openaiAi.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      const content = response.choices[0].message.content;
      if (content) return JSON.parse(content);
    } catch (e: any) {
      console.error("OpenAI study plan backup failed:", e);
      throw new AIServiceError("Failed to generate study plan with available AI services.", 'All', e.message?.includes('quota') ? 'Quota' : 'Network', e);
    }
  }
  
  throw new AIServiceError("Study plan generation unavailable. Check configuration.", 'All', 'Config');
};

export const generateImage = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") => {
  checkHealth();

  // Try Gemini first
  if (geminiAi) {
    try {
      const response = await geminiAi.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: { imageConfig: { aspectRatio } } as any
      });
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    } catch (e: any) {
      console.error("Gemini image generation failed:", e);
    }
  }

  // Fallback to OpenAI (DALL-E)
  if (openaiAi) {
    try {
      const response = await openaiAi.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: aspectRatio === "1:1" ? "1024x1024" : "1024x1792",
        quality: "standard",
      });
      return response.data[0].url;
    } catch (e: any) {
      console.error("OpenAI image backup failed:", e);
      throw new AIServiceError("Image generation services failed.", 'All', e.message?.includes('quota') ? 'Quota' : 'Network', e);
    }
  }
  
  throw new AIServiceError("Image generation service unavailable.", 'All', 'Config');
};

export const generateSpeech = async (text: string, voice: string = 'Kore') => {
  // Clean text for narration: 
  // 1. Remove narrator prefixes like "Narrator:", "[Narrator]", "(Narrator)"
  // 2. Remove stage directions in parentheses or brackets like (Laughs), [Pointing to diagram]
  // 3. Remove/Clean specific symbols like * as requested
  const cleanText = text
    .replace(/^(Narrator|Voiceover|Instructor|Harvey|Person \d):\s*/i, '')
    .replace(/[\[\(](Narrator|Voiceover|Instructor|Harvey)[\)\]]\s*/i, '')
    .replace(/[\(\[].*?[\)\]]/g, '') // Remove all bracketed/parenthetical text (directions)
    .replace(/[\*#_~]/g, '') // Remove asterisks and other markdown-style symbols
    .replace(/,\s*,/g, ',') // Fix accidental double commas if any
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  if (!cleanText) return null;

  // 1. Check Cache first
  const cacheKey = `tts_${voice}_${hashString(cleanText)}`;
  const cached = await AudioCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // 2. Try ElevenLabs Proxy first (Server-side)
  try {
    // Map internal voice names to ElevenLabs voice IDs if possible
    const voiceMap: Record<string, string> = {
      'Kore': 'pNInz6obpg8nS77y5p4v', // Adam
      'Adam': 'pNInz6obpg8nS77y5p4v',
      'Antoni': 'ErXwVqcDNo3uQHaeXLRR',
      'Bella': 'EXAVITQu4vr4xnSDxMaL',
      'Rachel': '21m00Tcm4TlvDq8ikWAM'
    };
    const elevenLabsVoiceId = voiceMap[voice] || voiceMap['Kore'];

    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText, voiceId: elevenLabsVoiceId })
    });
    
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      
      // Convert ArrayBuffer to Base64 using FileReader (more robust than manual string building)
      const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Result is a data URL: data:audio/mpeg;base64,.....
          const b64 = result.split(',')[1];
          if (b64) resolve(b64);
          else reject(new Error("Failed to extract base64 from FileReader result"));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });

      await AudioCache.set(cacheKey, base64);
      return base64;
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
      console.warn("ElevenLabs TTS server error:", response.status, errorData);
    }
  } catch (e: any) {
    console.error("ElevenLabs Proxy failed:", e);
  }

  // 3. Try Gemini 
  if (geminiAi) {
    try {
      const response = await geminiAi.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice as any },
            },
          },
        },
      });
      const base64AudioRaw = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64AudioRaw) {
        const base64Audio = wrapPcmInWav(base64AudioRaw, 24000);
        await AudioCache.set(cacheKey, base64Audio);
        return base64Audio;
      }
    } catch (e: any) {
      console.error("Gemini TTS failed:", e);
    }
  }

  // 4. Fallback to OpenAI TTS
  if (openaiAi) {
    try {
      const response = await openaiAi.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: text,
      });
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          await AudioCache.set(cacheKey, base64);
          resolve(base64);
        };
        reader.onerror = (err) => reject(new AIServiceError("Audio file reading failed", "OpenAI", "Network", err));
        reader.readAsDataURL(blob);
      });
    } catch (e: any) {
      console.error("OpenAI TTS failed:", e);
      throw new AIServiceError("All speech generation services failed.", 'All', e.message?.includes('quota') ? 'Quota' : 'Network', e);
    }
  }

  throw new AIServiceError("Speech generation unavailable. Check configuration.", 'All', 'Config');
};

/**
 * Background pre-generation for upcoming content
 */
export const pregenerateAudio = async (texts: string[], voice: string = 'Kore') => {
  console.log(`Pregenerating ${texts.length} audio tracks...`);
  const results = [];
  // For safety, only pregenerate a few at a time to avoid rate limits
  for (const text of texts.slice(0, 8)) {
    try {
      // Calling generateSpeech will handle caching automatically
      const b64 = await generateSpeech(text, voice);
      results.push(!!b64);
    } catch (e) {
      console.warn("Pregeneration failed for segment:", text.substring(0, 20));
      results.push(false);
    }
  }
  return results;
};

export const generatePodcast = async (script: string, speakers: { name: string, voice: string }[]) => {
  checkHealth();
  if (geminiAi) {
    try {
      const response = await geminiAi.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: script,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: speakers[0].voice as any }
            }
          }
        }
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) return base64Audio;
    } catch (e: any) {
      console.error("Gemini Multi-Speaker TTS failed:", e);
    }
  }

  // Fallback to OpenAI TTS (Single speaker fallback as OpenAI doesn't support multi-speaker in one call)
  if (openaiAi) {
    try {
      const response = await openaiAi.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: script,
      });
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(blob);
      });
    } catch (e: any) {
      console.error("OpenAI Podcast fallback failed:", e);
    }
  }

  throw new AIServiceError("Podcast generation is currently unavailable.", 'All', 'Config');
};

export const generateExamQuestions = async (profile: any, count: number = 10) => {
  checkHealth();
  const prompt = `
    Generate ${count} high-quality, registry-style mock exam questions for the Ultrasound Physics (SPI) exam.
    
    Student Context:
    - Study Goals: ${profile.studyGoals || 'General SPI Mastery'}
    - Learning Style: ${profile.learningStyle || 'Visual'}
    
    Cover these core topics:
    - Sound Waves & Propagation
    - Interaction with Matter
    - Transducers & Beam Forming
    - Pulsed Echo Instrumentation
    - Doppler Physics & Hemodynamics
    - Artifacts
    - Quality Assurance & Bioeffects
    
    Question Types: 'mcq', 'scenario', 'formula'.
    
    Return JSON array of AdvancedQuestion objects.
  `;

  if (geminiAi) {
    try {
      const response = await geminiAi.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["mcq", "scenario", "formula"] },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                moduleId: { type: Type.STRING }
              },
              required: ["id", "type", "question", "options", "correctAnswer", "explanation"]
            }
          }
        }
      });
      if (response.text) return JSON.parse(response.text);
    } catch (e: any) {
      console.error("Gemini exam generation failed:", e);
    }
  }

  // Fallback to OpenAI 
  if (openaiAi) {
    try {
      const response = await openaiAi.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      const content = response.choices[0].message.content;
      if (content) {
        const parsed = JSON.parse(content);
        // Handle case where it might be wrapped in an object
        return Array.isArray(parsed) ? parsed : (parsed.questions || Object.values(parsed)[0]);
      }
    } catch (e: any) {
      console.error("OpenAI exam backup failed:", e);
      throw new AIServiceError("Failed to generate exam questions with available AI services.", 'All', e.message?.includes('quota') ? 'Quota' : 'Network', e);
    }
  }

  throw new AIServiceError("Exam generation service is not available.", 'All', 'Config');
};
