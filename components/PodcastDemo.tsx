import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Loader2, Headphones, Radio, Mic2, Sparkles, Volume2, SkipForward, User, BookOpen } from 'lucide-react';
import { generateText, generateSpeech } from '../src/services/aiService';
import { decodeBase64 } from '../src/lib/audioUtils';

interface PodcastDemoProps {
  onClose: () => void;
  isDarkMode: boolean;
}

const TOPICS = [
  "The Nature of Sound",
  "Essential Wave Parameters",
  "Piezoelectric Anatomy",
  "Beam Focusing",
  "The Doppler Principle",
  "Propagation Artifacts",
  "ALARA & Mechanisms",
  "System Components"
];

export const PodcastDemo: React.FC<PodcastDemoProps> = ({ onClose, isDarkMode }) => {
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [script, setScript] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateLectureContent = async () => {
    setLoading(true);
    try {
      const prompt = `
You are an expert ultrasound physics instructor creating an audio lecture script.
Follow this exact structure and style:

1. Start by quantifying the effort you put in so the viewer doesn't have to. You must position yourself as the person who did the hard work to save them time.
• Template Line: "I [took this course / read these papers / learned this skill] for you so here is the cliffnotes version to save you [Number] hours."
• Context: Mention that a single source wasn't enough, so you aggregated multiple sources (courses, papers, videos) to create the ultimate guide.

2. Immediately establish that passive watching is insufficient. You must promise a way for them to test their knowledge.
• Template Line: "But as per usual, it is not enough just to listen to me talk about stuff, so at the end of the video, there is a little assessment."
• Goal: Tell them if they can answer these questions by the end, they are officially "educated" on the topic.

3. The Structured Roadmap
Break the complex topic into a numbered outline or modules.
• Template Structure:
  ◦ Part 1: Definitions (What even is [Topic]?).
  ◦ Part 2: Core Concepts/Crash Course (The specific frameworks or architectures).
  ◦ Part 3: Practical Application (How to build/do it yourself, often involving a workflow).
  ◦ Part 4: The "Holy Sh*t" Insight (A specific piece of advice or opportunity that is mind-blowing).

4. To explain a complex concept, first explain what it is not.
• Technique: Define the subject by contrasting it with a less effective version.
  ◦ Example: "The easiest way to first define [Topic] is the given example of what is not [Topic]."
  ◦ Application: Contrast a "non-agentic workflow" (straight start-to-finish) with an "agentic workflow" (circular/iterative) to clarify the new concept.

5. Do not just list concepts; create a memorable acronym or phrase to help the viewer remember them. Even if the mnemonic is silly, it aids retention.
• Template: "Here is a mnemonic in case you can't remember... just think about [Silly Sentence]."
• Examples from sources:
  ◦ "Red Turtles Paint Murals" (Reflection, Tool use, Planning, Multi-agents).
  ◦ "Tired Alpaca's Mix Tea" (Task, Answer, Model, Tools).
  ◦ "Tiny Crabs Ride Enormous Iguanas" (Task, Context, References, Evaluate, Iterate).
  ◦ "Ramen Saves Tragic Idiots" (Revisit, Split, Phrase, Constraints).

6. Simplify technical or dry subjects by relating them to human behavior or popular culture (like anime).
• Technique: Compare the system to a company hierarchy or a character's journey.
  ◦ Example: Explain Multi-Agent systems by comparing them to a company where a manager supervises sub-agents, or a "musical chair" of processes.
  ◦ Example: Use Naruto to explain goal-setting, highlighting how rejection or rivalry (like Sasuke) pushes buttons to create consistency.

7. Shift from theory to a concrete example the user can copy, preferably using accessible tools.
• Template: "To make this actually all practical, I'm going to show you how to create a [Workflow/Project] which does not require any code.".
• Guidance: Walk through a specific tool (like n8n, ChatGPT, or a spreadsheet) to solve a relatable problem (like planning a trip or organizing a schedule).

8. The Mindset Shift (The "Soft" Skill)
Address the psychological barriers to the subject.
• Key Concept: Focus on "showing up" rather than perfection. Use the "2-minute rule" or specific habit-building advice.
  ◦ Philosophy: "You do not rise to the level of your goals, you fall to the level of your systems."
  ◦ Advice: Identify "what pushes your buttons" (e.g., social accountability, rejection) and engineer that into the learning process.

9. The Assessment and CTA
End the video by presenting the questions promised in the beginning to prove they learned the material.
• Template: "As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on [Topic].".
• Call to Action: Ask viewers to write their answers in the comments to boost engagement.

--------------------------------------------------------------------------------
Analogy for this Template: Think of this video style like meal-prepping for the brain. Instead of handing the viewer a pile of raw ingredients (raw data, 100-page notes, and complex papers) and telling them to cook, you are acting as the chef who has already chopped, seasoned, and cooked the meal (the "cliffnotes"). You serve it in bite-sized, easy-to-swallow pieces (mnemonics), use familiar flavors (analogies), and finally, you ask them to taste-test it (the assessment) to ensure they are actually full.

Topic to cover: ${selectedTopic}
Keep the script engaging, conversational, and suitable for a single speaker. Do not include stage directions, just the spoken text. Keep it concise (around 300-400 words) so it generates quickly.
      `;
      
      const generatedScript = await generateText(prompt);
      if (!generatedScript) throw new Error("Failed to generate script");
      
      setScript(generatedScript);
      const base64Audio = await generateSpeech(generatedScript, 'Kore'); // Using a single voice
      
      if (base64Audio) {
        const audioData = decodeBase64(base64Audio);
        const blob = new Blob([audioData], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Failed to generate lecture:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stealth-950/80 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-[3rem] border shadow-2xl ${
          isDarkMode ? 'bg-stealth-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-registry-teal/10 to-transparent shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-registry-teal/20 rounded-2xl">
              <BookOpen className="w-6 h-6 text-registry-teal" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">Deep Dive Lectures</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AI-Generated Masterclass</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-registry-teal"
            aria-label="Close lecture"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Left Column: Controls & Visualizer */}
          <div className="flex-1 space-y-8 flex flex-col">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Select Topic</label>
              <div className="grid grid-cols-1 gap-2">
                {TOPICS.map(topic => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    disabled={loading || !!audioUrl}
                    className={`p-4 rounded-2xl text-left text-sm font-bold transition-all ${
                      selectedTopic === topic 
                        ? 'bg-registry-teal text-stealth-950 shadow-lg shadow-registry-teal/20' 
                        : isDarkMode ? 'bg-stealth-950 hover:bg-white/5' : 'bg-slate-50 hover:bg-slate-100'
                    } ${(loading || audioUrl) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Visualizer Area */}
            <div className={`flex-1 min-h-[200px] rounded-[2rem] relative overflow-hidden flex flex-col items-center justify-center border-2 ${
              isDarkMode ? 'bg-stealth-950 border-white/5' : 'bg-slate-50 border-slate-100'
            }`}>
              {!audioUrl && !loading ? (
                <div className="text-center space-y-4 p-4">
                  <div className="w-16 h-16 bg-registry-teal/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Mic2 className="w-8 h-8 text-registry-teal" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-50">Ready to Generate</p>
                  <button 
                    onClick={generateLectureContent}
                    className="px-6 py-3 bg-registry-teal text-stealth-950 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Generate Lecture
                  </button>
                </div>
              ) : loading ? (
                <div className="text-center space-y-4 p-4" aria-live="polite">
                  <Loader2 className="w-12 h-12 text-registry-teal animate-spin mx-auto" />
                  <p className="text-xs font-black uppercase tracking-widest text-registry-teal animate-pulse">Writing & Recording...</p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <div className="flex flex-col items-center space-y-3 mb-8">
                    <div className={`w-24 h-24 rounded-3xl border-4 flex items-center justify-center transition-all duration-500 ${
                      isPlaying ? 'scale-110 border-registry-teal shadow-[0_0_30px_rgba(45,212,191,0.3)]' : 'scale-100 border-white/10'
                    }`}>
                      <User className={`w-12 h-12 ${isPlaying ? 'text-registry-teal' : 'text-slate-500'}`} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black uppercase tracking-tighter">AI Instructor</p>
                      <p className="text-[8px] font-black text-registry-teal uppercase tracking-widest">Masterclass</p>
                    </div>
                  </div>
                  
                  {/* Waveform Simulation */}
                  <div className="flex items-end space-x-1 h-12">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          height: isPlaying ? [10, Math.random() * 40 + 10, 10] : 4 
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 0.5 + Math.random() * 0.5,
                          ease: "easeInOut"
                        }}
                        className="w-1 bg-registry-teal rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            {audioUrl && (
              <div className="flex flex-col items-center space-y-6 shrink-0">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => {
                      if (audioRef.current) audioRef.current.currentTime -= 10;
                    }}
                    className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-colors"
                  >
                    <SkipForward className="w-5 h-5 rotate-180" />
                  </button>
                  <button 
                    onClick={togglePlay}
                    className="w-20 h-20 bg-registry-teal text-stealth-950 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-registry-teal/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </button>
                  <button 
                    onClick={() => {
                      if (audioRef.current) audioRef.current.currentTime += 10;
                    }}
                    className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-colors"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    setAudioUrl(null);
                    setScript('');
                  }}
                  className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest underline underline-offset-4"
                >
                  Generate New Lecture
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Transcript */}
          <div className={`flex-1 rounded-[2rem] border p-6 overflow-y-auto ${
            isDarkMode ? 'bg-stealth-950/50 border-white/5' : 'bg-slate-50/50 border-slate-100'
          }`}>
            <h3 className="text-sm font-black uppercase tracking-widest text-registry-teal mb-6 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Lecture Transcript
            </h3>
            {script ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {script.split('\\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 leading-relaxed text-sm opacity-90">{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center opacity-50">
                <p className="text-xs font-bold uppercase tracking-widest">Transcript will appear here<br/>once generated.</p>
              </div>
            )}
          </div>
        </div>

        {audioUrl && (
          <audio 
            ref={audioRef} 
            src={audioUrl} 
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </motion.div>
    </motion.div>
  );
};
