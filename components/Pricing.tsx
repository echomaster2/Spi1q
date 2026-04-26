import React from 'react';
import { Check, Zap, Star, Crown, ChevronLeft, ShieldCheck, Rocket, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';

interface PricingProps {
  onClose: () => void;
  isDarkMode?: boolean;
}

export const Pricing: React.FC<PricingProps> = ({ onClose, isDarkMode }) => {
  const tiers = [
    {
      name: "Free Tier",
      price: "$0",
      description: "Core Registry Essentials",
      features: [
        "Basic Physics Lexicon",
        "Module 1: Fundamentals",
        "Daily Study Principle",
        "Community Support Node"
      ],
      buttonText: "Current Plan",
      highlight: false,
      icon: Rocket
    },
    {
      name: "Monthly Mastery",
      price: "$44",
      period: "/month",
      description: "Full System Access",
      features: [
        "All 12 Physics Modules",
        "Harvey AI Tutor (Unlimited)",
        "Advanced Mock Exams",
        "Spaced Repetition Matrix"
      ],
      buttonText: "Start Mastery",
      highlight: true,
      icon: Zap,
      link: "https://buy.stripe.com/9B68wO5359uW9gi5tRafS0f"
    },
    {
      name: "Yearly Operator",
      price: "$143",
      period: "/year",
      description: "Long-term Preparation",
      features: [
        "Everything in Monthly",
        "Priority Node Access",
        "Flashcard Vault Sync",
        "Registry Readiness Report"
      ],
      buttonText: "Go Yearly",
      highlight: false,
      icon: Star,
      link: "https://buy.stripe.com/8x228q0MPdLc8ce5tRafS06"
    },
    {
      name: "Lifetime Legend",
      price: "$350",
      period: " once",
      description: "Eternal Registry Access",
      features: [
        "Lifetime Updates",
        "All Future Modules",
        "Direct Mentor Access",
        "Exclusive 'Legend' Badge"
      ],
      buttonText: "Claim Lifetime",
      highlight: false,
      icon: Crown,
      link: "https://buy.stripe.com/8x27sKanpaz0gIK4pNafS0d"
    }
  ];

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-stealth-950' : 'bg-slate-50'} overflow-y-auto scrollbar-hide transition-colors duration-500 relative`}>
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 neural-grid opacity-20" />
        <div className="absolute inset-0 scanline opacity-10" />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-registry-teal/10 to-transparent" />
      </div>

      <header className={`sticky top-0 z-50 p-6 ${isDarkMode ? 'bg-stealth-950/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDarkMode ? 'border-white/5' : 'border-slate-200'} flex items-center justify-between transition-colors`}>
        <div className="flex items-center space-x-4">
          <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-registry-teal transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <h2 className={`text-2xl font-black italic uppercase tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Mastery Access</h2>
            <span className="text-[11px] font-black text-registry-teal uppercase tracking-[0.3em] mt-1">Subscription Protocol v4.2</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Encryption Status</span>
            <span className="text-[11px] font-black text-registry-teal uppercase tracking-widest">AES-256 ACTIVE</span>
          </div>
          <div className="px-4 py-1.5 bg-registry-teal/10 border border-registry-teal/20 rounded-full flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-registry-teal rounded-full animate-pulse" />
            <span className="text-[11px] font-black text-registry-teal uppercase tracking-widest">Secure Link</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 bg-registry-rose/10 border border-registry-rose/20 rounded-full text-registry-rose text-[11px] font-black uppercase tracking-[0.3em] mb-4"
          >
            Critical System Upgrade
          </motion.div>
          <h1 className={`text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Select Your <span className="text-registry-teal glow-teal">Neural Node</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg technical-label">
            Elevate your diagnostic capabilities and ensure registry certification with professional-grade ultrasound physics tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-500 overflow-hidden group ${
                tier.highlight 
                  ? isDarkMode ? 'bg-stealth-900 border-registry-teal shadow-2xl shadow-registry-teal/20 scale-105 z-10' : 'bg-white border-registry-teal shadow-xl scale-105 z-10'
                  : isDarkMode ? 'bg-stealth-900/50 border-white/5 hover:border-registry-teal/30' : 'bg-white border-slate-200 hover:border-registry-teal/30 shadow-sm'
              }`}
            >
              {/* Card Scanline */}
              <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />
              
              {tier.highlight && (
                <div className="mb-4 inline-block px-4 py-1 bg-registry-teal/20 border border-registry-teal/30 text-registry-teal text-[11px] font-black uppercase tracking-widest rounded-full">
                  Optimal Protocol
                </div>
              )}

              <div className="mb-8 relative">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${
                  tier.highlight ? 'bg-registry-teal text-stealth-950 shadow-lg shadow-registry-teal/30' : 'bg-white/5 text-registry-teal'
                }`}>
                  <tier.icon className="w-7 h-7" />
                </div>
                <h3 className={`text-xl font-black uppercase italic tracking-tight mb-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {tier.name}
                </h3>
                <div className="flex items-baseline space-x-1 mb-2">
                  <span className={`text-4xl font-black italic tracking-tighter ${
                    tier.highlight ? 'text-registry-teal glow-teal' : isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-slate-500 text-[11px] font-black uppercase tracking-widest">
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest border-l-2 border-registry-teal/30 pl-3 py-1">
                  {tier.description}
                </p>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                {tier.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start space-x-3 group/item">
                    <div className={`mt-1 p-0.5 rounded-full transition-colors ${
                      tier.highlight ? 'bg-registry-teal/20 text-registry-teal' : 'bg-white/5 text-slate-500 group-hover/item:text-registry-teal'
                    }`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-tight transition-colors ${
                      tier.highlight ? 'text-slate-300' : 'text-slate-500 group-hover/item:text-slate-300'
                    }`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => tier.link && window.open(tier.link, '_blank')}
                className={`w-full py-4 rounded-xl font-black italic uppercase text-xs tracking-widest transition-all relative overflow-hidden group/btn ${
                tier.highlight 
                  ? 'bg-registry-teal hover:bg-teal-400 text-stealth-950 shadow-lg shadow-registry-teal/30' 
                  : 'bg-white/5 hover:bg-registry-teal hover:text-stealth-950 text-slate-400'
              }`}>
                <span className="relative z-10">{tier.buttonText}</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className={`mt-24 p-12 ${isDarkMode ? 'bg-stealth-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'} rounded-[3rem] border text-center space-y-8 relative overflow-hidden`}>
           <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
           <div className="relative z-10">
             <div className="flex items-center justify-center space-x-4 mb-6">
                <ShieldCheck className="w-12 h-12 text-registry-teal glow-teal" />
                <h4 className={`text-2xl md:text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Registry Success Protocol</h4>
             </div>
             <p className="text-slate-400 font-medium max-w-3xl mx-auto italic text-lg leading-relaxed">
               "Due to the digital nature of our neural assets, we do not issue standard refunds. However, we are committed to your success. If you do not pass your registry after using our Mastery tools, we will extend your membership for 6 months or until you pass—whichever comes first."
             </p>
             <div className="flex flex-wrap items-center justify-center gap-12 pt-8">
                <div className="flex items-center space-x-3 text-[11px] font-black uppercase text-slate-500 tracking-[0.2em]">
                   <HeartPulse className="w-5 h-5 text-registry-rose animate-pulse" />
                   <span>5,000+ Certified Operators</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] font-black uppercase text-slate-500 tracking-[0.2em]">
                   <ShieldCheck className="w-5 h-5 text-registry-teal" />
                   <span>256-Bit Neural Encryption</span>
                </div>
             </div>
           </div>
        </div>
      </main>

      <footer className={`p-12 text-center border-t ${isDarkMode ? 'border-white/5 bg-stealth-950' : 'border-slate-100 bg-white'} text-slate-600 relative z-10`}>
        <p className="text-[11px] font-black uppercase tracking-[0.5em]">
          SPI MASTER // NEURAL LINK ESTABLISHED // PROFESSIONAL REGISTRY PREPARATION
        </p>
      </footer>
    </div>
  );
};
