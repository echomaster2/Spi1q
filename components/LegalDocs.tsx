import React, { useState } from 'react';
import { 
  ScrollText, Shield, Lock, 
  ChevronRight, Scale, FileText,
  AlertCircle, CheckCircle2, Info,
  ExternalLink, Download, Printer,
  Volume2, Pause, Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

interface LegalDocsProps {
  onClose: () => void;
  onPlayNarration?: () => void;
  isNarrating?: boolean;
  isTtsLoading?: boolean;
  isDarkMode?: boolean;
}

export const LegalDocs: React.FC<LegalDocsProps> = ({ 
  onClose, 
  onPlayNarration, 
  isNarrating, 
  isTtsLoading,
  isDarkMode 
}) => {
  const [activeTab, setActiveTab] = useState<'tos' | 'privacy' | 'disclaimer'>('tos');

  const content = {
    tos: {
      title: "Terms of Service",
      updated: "March 11, 2026",
      sections: [
        { title: "1. Acceptance of Terms", text: "By accessing SPI MASTER, you agree to be bound by these terms. This platform is an educational tool designed for ultrasound registry preparation." },
        { title: "2. User Conduct", text: "Users must not attempt to reverse engineer the neural link interface or scrape proprietary curriculum data. Unauthorized redistribution of study pulses is prohibited." },
        { title: "3. Intellectual Property", text: "All diagrams, simulations, and AI-generated narration scripts are the property of SPI MASTER and its licensors." }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      updated: "March 11, 2026",
      sections: [
        { title: "1. Data Collection", text: "We collect study progress, quiz results, and interaction data to optimize the AI Tutor's responses and your personalized study plan." },
        { title: "2. Encryption", text: "All user data is protected by 256-bit quantum-secure encryption. We do not sell your personal study metrics to third parties." },
        { title: "3. Local Storage", text: "Flashcard progress and theme preferences are stored locally on your device to ensure low-latency access." }
      ]
    },
    disclaimer: {
      title: "Medical Disclaimer",
      updated: "March 11, 2026",
      sections: [
        { title: "1. Educational Use Only", text: "SPI MASTER is for educational and registry preparation purposes only. It is not a clinical diagnostic tool." },
        { title: "2. No Medical Advice", text: "The information provided does not constitute medical advice or professional clinical training. Always follow institutional protocols." },
        { title: "3. Accuracy", text: "While we strive for 100% accuracy based on ARDMS guidelines, users should verify critical physics principles with official textbooks." }
      ]
    }
  };

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-stealth-950 text-white' : 'bg-white text-slate-900'} transition-colors duration-500 overflow-hidden relative z-[150]`}>
      <header className={`p-6 ${isDarkMode ? 'bg-stealth-950 border-white/10' : 'bg-slate-50 border-slate-200'} text-white flex justify-between items-center shrink-0 border-b`}>
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 ${isDarkMode ? 'bg-registry-teal/20' : 'bg-registry-teal'} rounded-xl flex items-center justify-center shadow-lg`}>
            <ScrollText className={`w-6 h-6 ${isDarkMode ? 'text-registry-teal' : 'text-white'}`} />
          </div>
          <div>
            <h4 className={`text-lg font-black tracking-tight italic uppercase leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Legal Documentation</h4>
            <p className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} font-black uppercase tracking-widest mt-1`}>Compliance & Protocols</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onPlayNarration && (
            <button 
              onClick={onPlayNarration} 
              disabled={isTtsLoading}
              className={`p-2 rounded-xl transition-all ${isNarrating ? 'bg-registry-rose animate-pulse text-white' : isDarkMode ? 'hover:bg-white/10 text-white/70' : 'hover:bg-slate-200 text-slate-500'}`}
            >
              {isTtsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isNarrating ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
          <button onClick={onClose} className={`p-2 ${isDarkMode ? 'hover:bg-white/10 text-white/70' : 'hover:bg-slate-200 text-slate-500'} rounded-xl transition-all`}>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <aside className={`w-full md:w-64 ${isDarkMode ? 'bg-stealth-900/50 border-white/5' : 'bg-slate-100/50 border-slate-200'} border-b md:border-b-0 md:border-r p-4 md:p-6 space-y-2`}>
          {[
            { id: 'tos', label: 'Terms of Service', icon: Scale },
            { id: 'privacy', label: 'Privacy Policy', icon: Shield },
            { id: 'disclaimer', label: 'Medical Disclaimer', icon: AlertCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-3 p-4 rounded-2xl font-black uppercase tracking-tight text-[10px] transition-all ${
                activeTab === tab.id 
                  ? 'bg-registry-teal text-white shadow-lg shadow-registry-teal/20' 
                  : isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-12 space-y-8 ${isDarkMode ? 'bg-stealth-950' : 'bg-white'}`}>
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b ${isDarkMode ? 'border-white/5' : 'border-slate-100'} pb-8`}>
            <div className="space-y-2">
              <h2 className={`text-3xl md:text-5xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{content[activeTab].title}</h2>
              <p className={`text-[10px] font-black uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} tracking-widest`}>Last Updated: {content[activeTab].updated}</p>
            </div>
            <div className="flex space-x-2">
              <button className={`p-3 ${isDarkMode ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'} rounded-xl transition-all`}><Printer className="w-4 h-4" /></button>
              <button className={`p-3 ${isDarkMode ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'} rounded-xl transition-all`}><Download className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="space-y-12 max-w-3xl">
            {content[activeTab].sections.map((section, i) => (
              <div key={i} className="space-y-4">
                <h5 className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-registry-teal' : 'text-registry-teal'} flex items-center gap-3`}>
                  <div className={`w-6 h-6 rounded-lg ${isDarkMode ? 'bg-registry-teal/20' : 'bg-registry-teal/10'} flex items-center justify-center text-[10px]`}>{i + 1}</div>
                  {section.title}
                </h5>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} font-medium leading-relaxed text-sm md:text-base`}>
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className={`${isDarkMode ? 'bg-registry-teal/5 border-registry-teal/20' : 'bg-registry-teal/5 border-registry-teal/10'} rounded-3xl p-8 flex items-start space-x-4 border`}>
            <Info className="w-6 h-6 text-registry-teal shrink-0 mt-1" />
            <div className="space-y-2">
              <p className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-registry-teal' : 'text-registry-teal'}`}>Compliance Notice</p>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium leading-relaxed`}>
                By continuing to use this platform, you acknowledge that you have read and understood the protocols outlined above. For further inquiries, please contact our registry support node.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
