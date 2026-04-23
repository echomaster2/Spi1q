import { GoogleGenAI, Modality } from "@google/genai";
import fs from 'fs';
import path from 'path';

// Extracted from App.tsx
const staticNarrationScripts: Record<string, string> = {
    'intro': "System initialized. Welcome to the SPI Neural Link. Your learning matrix is ready to be configured. Let's begin the calibration sequence.",
    'onboarding_complete': "Calibration successful. Your neural pathways have been mapped. Access to the main dashboard is now granted.",
    'learning_style': "Analyzing cognitive patterns to determine optimal training vectors. Please select your preferred data intake method.",
    'module_complete': "Module knowledge integration active. Processing new cortical connections. Ready for the next data stream.",
};

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const geminiAi = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

const outputDir = path.join(process.cwd(), 'public', 'audio_cache');

async function run() {
  const entries = Object.entries(staticNarrationScripts);
  for (const [id, script] of entries) {
    if (fs.existsSync(path.join(outputDir, `${id}.txt`))) continue;
    try {
        console.log(`Generating ${id}...`);
        const response = await geminiAi?.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: script }] }],
          config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } }
        });
        const d = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (d) fs.writeFileSync(path.join(outputDir, `${id}.txt`), d);
        await new Promise(r => setTimeout(r, 2000));
    } catch(e) {
        console.error("error", e);
    }
  }
  console.log("Done static scripts");
}
run();
