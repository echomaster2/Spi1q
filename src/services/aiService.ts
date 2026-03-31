import { GoogleGenAI, Type, Modality } from "@google/genai";
import OpenAI from "openai";
import { UserProfile } from "../../types";

// Initialize Gemini
const geminiApiKey = process.env.GEMINI_API_KEY || "";
const geminiAi = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// Initialize OpenAI
const openaiApiKey = process.env.OPENAI_API_KEY || "";
const openaiAi = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey, dangerouslyAllowBrowser: true }) : null;

export const generateText = async (prompt: string, systemInstruction?: string) => {
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
    } catch (e) {
      console.error("Gemini failed, trying OpenAI backup...", e);
    }
  }

  // Fallback to OpenAI
  if (openaiAi) {
    try {
      const response = await openaiAi.chat.completions.create({
        model: "gpt-4o",
        messages: [
          ...(systemInstruction ? [{ role: "system" as const, content: systemInstruction }] : []),
          { role: "user" as const, content: prompt }
        ],
      });
      return response.choices[0].message.content;
    } catch (e) {
      console.error("OpenAI backup failed too", e);
    }
  }

  throw new Error("No AI service available or all services failed.");
};

export const generateStudyPlan = async (profile: UserProfile) => {
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
        model: "gemini-3.1-pro-preview",
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
    } catch (e) {
      console.error("Gemini study plan generation failed, trying OpenAI backup...", e);
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
    } catch (e) {
      console.error("OpenAI study plan backup failed", e);
    }
  }
  return null;
};

export const generateImage = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") => {
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
    } catch (e) {
      console.error("Gemini image generation failed, trying OpenAI backup...", e);
    }
  }

  // Fallback to OpenAI (DALL-E)
  if (openaiAi) {
    try {
      const response = await openaiAi.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: aspectRatio === "1:1" ? "1024x1024" : "1024x1792", // DALL-E 3 supports 1024x1024, 1024x1792, 1792x1024
        quality: "standard",
      });
      return response.data[0].url;
    } catch (e) {
      console.error("OpenAI image backup failed", e);
    }
  }
  return null;
};

export const generateSpeech = async (text: string, voice: string = 'Charon') => {
  // Try Gemini first
  if (geminiAi) {
    try {
      const response = await geminiAi.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
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
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) return base64Audio;
    } catch (e) {
      console.error("Gemini TTS failed, trying OpenAI backup...", e);
    }
  }

  // Fallback to OpenAI TTS
  if (openaiAi) {
    try {
      const response = await openaiAi.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
        response_format: "pcm",
      });
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("OpenAI TTS backup failed", e);
    }
  }

  return null;
};

export const generateExamQuestions = async (profile: any, count: number = 10) => {
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
        model: "gemini-3.1-pro-preview",
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
    } catch (e) {
      console.error("Gemini exam generation failed", e);
    }
  }

  return [];
};
