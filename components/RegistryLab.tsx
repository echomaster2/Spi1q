import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FlaskConical, Activity, Zap, Waves, 
  Target, Monitor, Shield, Sparkles,
  Maximize2, X, Play, RefreshCcw, 
  Settings, Info, Sliders, LayoutGrid, ChevronLeft
} from 'lucide-react';
import * as Visuals from './visuals';

import { updateQuestProgress } from '../src/lib/questUtils';

interface RegistryLabProps {
  onClose: () => void;
  isDarkMode: boolean;
}

const TOOL_CATEGORIES = [
  { 
    id: 'physics', 
    name: 'Physics Lab', 
    icon: Waves, 
    tools: [
      { id: 'oscilloscope', name: 'Master Oscilloscope', component: 'MasterOscilloscope', description: 'Advanced acoustic waveform analyzer with audible pitch representation.' },
      { id: 'pulse_echo', name: 'Pulse-Echo Principle', component: 'PulseEchoPrincipleVisual', description: 'Understand the 13 microsecond rule and echo-ranging.' },
      { id: 'wave', name: 'Wave Parameters', component: 'WaveParametersVisual', description: 'Experiment with frequency, period, and amplitude.' },
      { id: 'atten', name: 'Attenuation Sim', component: 'AttenuationSimulator', description: 'Analyze energy loss in different media.' },
      { id: 'refraction', name: 'Refraction Lab', component: 'RefractionLab', description: "Snell's Law and sound wave bending across interfaces." },
      { id: 'reflection', name: 'Reflection Lab', component: 'ReflectionLab', description: 'Specular vs diffuse reflectors and angle of incidence.' },
      { id: 'beam', name: 'Beam Characteristics', component: 'BeamLab', description: 'Study beam width, focal point, and divergence.' },
      { id: 'huygens', name: 'Huygens Principle', component: 'HuygensPrincipleVisual', description: 'Wavelet interference and beam formation.' }
    ]
  },
  { 
    id: 'doppler', 
    name: 'Hemodynamics', 
    icon: Activity, 
    tools: [
      { id: 'doppler', name: 'Doppler Modalities', component: 'DopplerModalitiesVisual', description: 'Color, Power, and Spectral Doppler comparison.' },
      { id: 'doppler_shift', name: 'Doppler Shift', component: 'DopplerShiftVisual', description: 'Frequency change based on reflector motion.' },
      { id: 'alias', name: 'Aliasing & Nyquist', component: 'AliasingVisual', description: 'Study sampling limits and PRF impacts.' },
      { id: 'doppler_angle', name: 'Doppler Angle', component: 'DopplerAngleVisual', description: 'Cosine of the angle and its effect on velocity estimation.' },
      { id: 'sten', name: 'Stenosis Physics', component: 'StenosisHemodynamicsExplainer', description: 'Pressure vs Velocity dynamics.' },
      { id: 'flow', name: 'Flow Patterns', component: 'FlowPatternsVisual', description: 'Laminar, Turbulent, and Phasic flow.' }
    ]
  },
  { 
    id: 'hardware', 
    name: 'Diagnostics', 
    icon: Monitor, 
    tools: [
      { id: 'optimization', name: 'Image Optimization', component: 'ImageOptimizationChallenge', description: 'Interactive game to master gain, focus, and dynamic range settings.' },
      { id: 'transduc', name: 'Transducer Anatomy', component: 'TransducerCrossSection', description: 'Internal components of a piezoelectric probe.' },
      { id: 'arrays', name: 'Transducer Arrays', component: 'ArrayTypesVisual', description: 'Linear, Phased, and Convex array firing patterns.' },
      { id: 'display', name: 'Display Modes', component: 'DisplayModesVisual', description: 'A-Mode, B-Mode, and M-Mode differences.' },
      { id: 'contrast', name: 'Contrast Resolution', component: 'DynamicRangeVisual', description: 'Bit depth and gray scale mapping.' },
      { id: 'tgc', name: 'Time Gain Comp', component: 'TGCVisual', description: 'Depth dependent amplification of echoes.' }
    ]
  },
  { 
    id: 'safety', 
    name: 'Safe & QA', 
    icon: Shield, 
    tools: [
      { id: 'hunter', name: 'Artifact Hunter', component: 'ArtifactHunter', description: 'Identify and resolve real-time ultrasound artifacts in a diagnostic simulator.' },
      { id: 'bio', name: 'Bioeffects Monitor', component: 'BioeffectMechanismsVisual', description: 'Thermal and Mechanical index tracking.' },
      { id: 'cavitation', name: 'Cavitation', component: 'CavitationVisual', description: 'Stable vs Transient microbubble oscillations.' },
      { id: 'micro', name: 'Microbubble Dynamics', component: 'ContrastBubbleVisual', description: 'Harmonics and contrast agent physics.' },
      { id: 'qa', name: 'Phantom Testing', component: 'QAPhantomVisual', description: 'Quality assurance and system calibration.' },
      { id: 'art', name: 'Artifact Lab', component: 'ArtifactsVisual', description: 'Shadowing, Enhancement, and Reverberation.' }
    ]
  }
];

export const RegistryLab: React.FC<RegistryLabProps> = ({ onClose, isDarkMode }) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(TOOL_CATEGORIES[0].id);

  const handleToolSelect = (toolId: string, categoryId: string) => {
    setActiveTool(toolId);
    setActiveCategory(categoryId);
    
    // Quest logic: q2 is for Doppler simulation
    if (categoryId === 'doppler' || toolId.includes('doppler') || toolId === 'alias') {
       updateQuestProgress('q2', 1);
    }
  };

  const selectedTool = TOOL_CATEGORIES.flatMap(c => c.tools).find(t => t.id === activeTool);

  const renderActiveTool = () => {
    if (!selectedTool) return null;
    const Component = (Visuals as any)[selectedTool.component];
    return Component ? <Component /> : <div className="text-white">Tool Not Found</div>;
  };

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-stealth-950 text-white' : 'bg-slate-50 text-slate-900'} relative overflow-hidden`}>
      {/* Background Ambience */}
      <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
      
      {/* Header */}
      <div className="shrink-0 p-4 md:p-8 border-b border-white/5 flex items-center justify-between relative z-30 bg-black/40 backdrop-blur-3xl">
        <div className="flex items-center space-x-3 md:x-5">
           {activeTool && (
             <button 
               onClick={() => setActiveTool(null)}
               className="md:hidden p-2 bg-white/10 rounded-xl mr-2"
             >
               <ChevronLeft className="w-5 h-5 text-white" />
             </button>
           )}
           <div className="p-2 md:p-3 bg-registry-teal/10 rounded-xl md:rounded-2xl border border-registry-teal/30 shadow-glow">
              <FlaskConical className="w-5 h-5 md:w-7 md:h-7 text-registry-teal" />
           </div>
           <div>
              <h2 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter tabular-nums leading-none">Diagnostic Registry Lab</h2>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-registry-teal/60 mt-1 md:mt-1.5 flex items-center">
                 <Activity className="w-2.5 h-2.5 md:w-3 md:h-3 mr-2" /> Live Simulator Node Active
              </p>
           </div>
        </div>

        <button 
          onClick={onClose}
          className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-slate-400 hover:text-white transition-all hover:scale-110"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar / Mobile Category Selector */}
        <div className={`
          ${activeTool ? 'hidden md:flex' : 'flex'}
          w-full md:w-72 border-b md:border-b-0 md:border-r border-white/5 bg-black/20 flex-col p-4 md:p-6 space-y-6 md:space-y-8 h-full overflow-y-auto z-20
        `}>
          {/* Mobile Category Tabs */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide space-x-3 md:space-x-0 md:space-y-6">
            {TOOL_CATEGORIES.map(category => (
              <div key={category.id} className="space-y-4 shrink-0 md:shrink w-full md:w-auto">
                <button 
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-3 text-[11px] font-black uppercase tracking-widest transition-all px-4 py-2 rounded-full md:p-0 md:rounded-none ${
                    activeCategory === category.id 
                      ? 'bg-registry-teal/20 text-registry-teal md:bg-transparent' 
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{category.name}</span>
                </button>
                
                <div className={`grid grid-cols-1 gap-2 pt-2 md:pt-0 ${activeCategory === category.id ? 'block' : 'hidden md:block'}`}>
                  {category.tools.map(tool => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id, category.id)}
                      className={`w-full text-left p-4 md:p-5 rounded-2xl md:rounded-3xl border transition-all group relative overflow-hidden ${
                        activeTool === tool.id 
                          ? 'bg-registry-teal/10 border-registry-teal/30 ring-1 ring-registry-teal/20' 
                          : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <div className="relative z-10">
                        <p className={`text-[11px] md:text-[12px] font-black uppercase tracking-tight ${activeTool === tool.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                          {tool.name}
                        </p>
                        <p className="text-[11px] font-bold text-slate-600 uppercase mt-1 leading-tight">{tool.description}</p>
                      </div>
                      {activeTool === tool.id && (
                        <motion.div layoutId="active-indicator" className="absolute left-0 top-0 bottom-0 w-1 bg-registry-teal" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace Area */}
        <div className={`flex-1 relative overflow-auto md:overflow-hidden bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.05)_0%,transparent_70%)] ${activeTool ? 'p-4 md:p-12' : 'p-6 md:p-12'}`}>
           <AnimatePresence mode="wait">
              {activeTool ? (
                <motion.div 
                  key={activeTool}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="min-h-full w-full flex flex-col items-center justify-center relative z-10 space-y-6 md:space-y-12"
                >
                  <div className="w-full max-w-4xl space-y-6 md:space-y-12">
                     {/* Tool Info Header */}
                     <div className="space-y-2 md:space-y-4 text-center">
                        <div className="flex items-center justify-center space-x-3 text-registry-teal">
                           <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                           <span className="text-[11px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.5em]">{selectedTool?.id.toUpperCase()} DIAGNOSTIC MODULE</span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">{selectedTool?.name}</h3>
                        <p className="text-[11px] md:text-sm font-medium text-slate-400 max-w-lg md:max-w-2xl mx-auto">{selectedTool?.description}</p>
                     </div>

                     <div className="premium-glass bg-opacity-20 border tech-border rounded-3xl md:rounded-[4rem] p-4 md:p-12 shadow-premium relative overflow-hidden">
                        <div className="absolute inset-0 scanline opacity-5" />
                        <div className="relative z-10 w-full overflow-x-auto">
                           {renderActiveTool()}
                        </div>
                     </div>

                     <div className="flex justify-center space-x-4">
                        <button 
                          onClick={() => setActiveTool(null)}
                          className="flex items-center space-x-3 px-6 md:px-8 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-lg backdrop-blur-sm"
                        >
                           <RefreshCcw className="w-3 h-3 md:w-4 md:h-4" />
                           <span>Change Simulation</span>
                        </button>
                     </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full w-full flex flex-col items-center justify-center space-y-8 md:space-y-12 text-center"
                >
                   <div className="relative">
                      <div className="absolute inset-0 bg-registry-teal/20 blur-[60px] md:blur-[100px] animate-pulse" />
                      <LayoutGrid className="w-16 h-16 md:w-24 md:h-24 text-registry-teal/20 relative z-10 mx-auto" />
                   </div>
                   <div className="space-y-3 md:space-y-4">
                      <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Diagnostic Matrix Ready</h3>
                      <p className="text-slate-400 max-w-xs md:max-w-md mx-auto text-xs md:text-sm font-medium">Select a simulation module from the sidebar to begin live acoustic parameter exploration.</p>
                   </div>
                   
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full max-w-2xl">
                      {[
                        { label: 'Latency', val: '0.4ms' },
                        { label: 'Uptime', val: '99.9%' },
                        { label: 'Sync', val: 'Neural' },
                        { label: 'Mode', val: 'Registry' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-black/20 border border-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col items-center">
                           <span className="text-[11px] font-black uppercase text-slate-600 mb-0.5 md:mb-1">{stat.label}</span>
                           <span className="text-xs md:text-sm font-black text-white italic">{stat.val}</span>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
