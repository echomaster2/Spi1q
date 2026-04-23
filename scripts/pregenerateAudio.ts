import { GoogleGenAI, Modality } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { module1Lessons } from '../src/data/lessons/module1';
import { module2Lessons } from '../src/data/lessons/module2';
import { module3Lessons } from '../src/data/lessons/module3';
import { module4Lessons } from '../src/data/lessons/module4';
import { module5Lessons } from '../src/data/lessons/module5';
import { module6Lessons } from '../src/data/lessons/module6';
import { module7Lessons } from '../src/data/lessons/module7';
import { module8Lessons } from '../src/data/lessons/module8';
import { module9Lessons } from '../src/data/lessons/module9';
import { module10Lessons } from '../src/data/lessons/module10';
import { module11Lessons } from '../src/data/lessons/module11';
import { module12Lessons } from '../src/data/lessons/module12';
import { module16Lessons } from '../src/data/lessons/module16';

const allLessons = {
  ...module1Lessons,
  ...module2Lessons,
  ...module3Lessons,
  ...module4Lessons,
  ...module5Lessons,
  ...module6Lessons,
  ...module7Lessons,
  ...module8Lessons,
  ...module9Lessons,
  ...module10Lessons,
  ...module11Lessons,
  ...module12Lessons,
  ...module16Lessons,
};

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const geminiAi = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

const outputDir = path.join(process.cwd(), 'public', 'audio_cache');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to generate and save base64 audio
async function generateAndSave(id: string, text: string) {
  const filePath = path.join(outputDir, `${id}.txt`);
  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${id}, already exists.`);
    return;
  }
  
  if (!geminiAi) {
      console.error("No Gemini API key");
      return;
  }
  
  try {
    console.log(`Generating audio for ${id} (length ${text.length})...`);
    
    const response = await geminiAi.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      fs.writeFileSync(filePath, base64Audio);
      console.log(`Success: saved ${id}.txt`);
    } else {
        console.error(`Failed to get data for ${id}`);
    }
  } catch (e: any) {
    console.error(`Error generating ${id}:`, e.message);
  }
}

async function run() {
  const entries = Object.entries(allLessons);
  console.log(`Total lessons to process: ${entries.length}`);
  
  // We process in parallel chunks to speed it up!
  const toProcess = entries.filter(([id, lesson]) => lesson.narrationScript && !fs.existsSync(path.join(outputDir, `${id}.txt`)));
  console.log(`Remaining to process: ${toProcess.length}`);
  
  const chunkSize = 4;
  for (let i = 0; i < toProcess.length; i += chunkSize) {
    const chunk = toProcess.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async ([id, lesson]) => {
      if (!lesson.narrationScript) return;
      await generateAndSave(id, lesson.narrationScript);
    }));
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  console.log('Finished pregenerating audio.');
}

run();
