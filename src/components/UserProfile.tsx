import React, { useState } from 'react';
import { 
  User, Mail, Calendar, Clock, 
  Save, Shield, Bell, LogOut, 
  ChevronRight, Award, Zap, Target,
  Camera, Edit3, CheckCircle2, AlertCircle,
  Volume2, Pause, Loader2, X, Brain, Sparkles, BookOpen, Download, Database,
  Stethoscope, GraduationCap, HeartPulse, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { signInWithGoogle, logout } from '../firebase';
import { generateText, generateSpeech } from '../services/aiService';
import { UserProfile as UserProfileType, Module, LessonContentMap } from '../types';
import { AudioCache } from '../lib/audioCache';
import { CompanionAvatar, CompanionSkin } from './CompanionAvatar';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface UserProfileProps {
  profile: UserProfileType | null;
  onUpdate: (updates: Partial<UserProfileType>) => void;
  onClose: () => void;
  onPlayNarration?: () => void;
  isNarrating?: boolean;
  isTtsLoading?: boolean;
  onOpenReminders?: () => void;
  streak?: number;
  totalCompleted?: number;
  modules: Module[];
  lessonContent: LessonContentMap;
  userId: string | null;
  isDarkMode?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  profile, onUpdate, onClose, onPlayNarration, isNarrating, isTtsLoading, onOpenReminders,
  streak = 0, totalCompleted = 0, modules, lessonContent, userId, isDarkMode = true
}) => {
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [registryDate, setRegistryDate] = useState(profile?.registryDate || '');
  const [studyGoals, setStudyGoals] = useState(profile?.studyGoals || '');
  const [learningStyle, setLearningStyle] = useState<UserProfileType['learningStyle']>(profile?.learningStyle || 'visual');
  const [companionSkin, setCompanionSkin] = useState<CompanionSkin>(profile?.companionSkin || 'default');
  const [profileAvatar, setProfileAvatar] = useState<UserProfileType['profileAvatar']>(profile?.profileAvatar || 'default');
  const [aiPersonalizedPlan, setAiPersonalizedPlan] = useState(profile?.aiPersonalizedPlan || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBulkCaching, setIsBulkCaching] = useState(false);
  const [cacheProgress, setCacheProgress] = useState({ current: 0, total: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showCacheClearConfirm, setShowCacheClearConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ title: string, body: string } | null>(null);

  const handleSave = () => {
    onUpdate({ name, email, registryDate, studyGoals, learningStyle, aiPersonalizedPlan, companionSkin, profileAvatar });
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const generateAIPlan = async () => {
    if (!studyGoals) return;

    setIsGenerating(true);
    setError(null);
    try {
      const prompt = `Generate a personalized study plan for an ultrasound physics (SPI) student. 
        Study Goals: ${studyGoals}
        Learning Style: ${learningStyle}
        Current Level: ${Math.floor(totalCompleted / 10) + 1}
        
        Provide a concise, actionable plan in Markdown format with specific techniques and a weekly focus. Use bold text for key terms.`;
      
      const plan = await generateText(prompt);
      if (plan) {
        setAiPersonalizedPlan(plan);
        onUpdate({ aiPersonalizedPlan: plan });
      } else {
        throw new Error("No plan generated");
      }
    } catch (err) {
      console.error("Failed to generate AI plan:", err);
      setError("Failed to generate plan. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const cacheAllLectures = async () => {
    const allLessons = modules.flatMap(m => m.lessons);
    setCacheProgress({ current: 0, total: allLessons.length });
    setIsBulkCaching(true);
    setError(null);

    try {
      for (let i = 0; i < allLessons.length; i++) {
        const lesson = allLessons[i];
        setCacheProgress({ current: i + 1, total: allLessons.length });

        // Check if already cached
        const existing = await AudioCache.get(lesson.id);
        if (existing) continue;

        // Check server
        if (userId) {
          try {
            const res = await fetch(`/api/audio/${userId}/${lesson.id}`);
            if (res.ok) {
              const json = await res.json();
              if (json.data) {
                await AudioCache.set(lesson.id, json.data);
                continue;
              }
            }
          } catch (e) {
            console.error("Server fetch error during bulk cache", e);
          }
        }

        // Generate if not found
        const content = lessonContent[lesson.id];
        if (!content || !content.narrationScript) continue;

        try {
          const base64Audio = await generateSpeech(content.narrationScript, 'Kore');
          if (base64Audio) {
            await AudioCache.set(lesson.id, base64Audio);
            if (userId) {
              fetch(`/api/audio/${userId}/${lesson.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: base64Audio })
              }).catch(console.error);
            }
          }
        } catch (genErr) {
          console.error(`Failed to generate audio for ${lesson.id}`, genErr);
        }
        
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 500));
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Bulk cache failed:", err);
      setError("Bulk caching failed. Please check your connection.");
    } finally {
      setIsBulkCaching(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-slate-950/40' : 'bg-white/40'} backdrop-blur-3xl transition-colors duration-500 overflow-hidden relative z-[150] premium-glass shadow-premium`}>
      <header className={`p-8 ${isDarkMode ? 'bg-stealth-950/40 text-white border-white/10' : 'bg-white/40 text-slate-900 border-slate-100'} flex justify-between items-center shrink-0 border-b transition-colors backdrop-blur-3xl`}>
        <div className="flex items-center space-x-5">
          <div className="w-12 h-12 bg-gradient-to-br from-registry-teal to-registry-cobalt rounded-2xl flex items-center justify-center shadow-glow">
            {profileAvatar === 'sonographer' ? <Stethoscope className="w-7 h-7 text-white" /> :
             profileAvatar === 'student' ? <GraduationCap className="w-7 h-7 text-white" /> :
             profileAvatar === 'doctor' ? <HeartPulse className="w-7 h-7 text-white" /> :
             profileAvatar === 'nurse' ? <Activity className="w-7 h-7 text-white" /> :
             <User className="w-7 h-7 text-white" />}
          </div>
          <div>
            <h4 className="text-xl font-black tracking-tighter italic uppercase leading-none">User Profile</h4>
            <p className={`text-[11px] ${isDarkMode ? 'opacity-50' : 'text-slate-400'} font-black uppercase tracking-[0.3em] mt-1.5`}>System Identity & Settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {onPlayNarration && (
            <button 
              onClick={onPlayNarration} 
              disabled={isTtsLoading}
              className={`p-3 rounded-2xl transition-all ${isNarrating ? 'bg-registry-rose animate-pulse glow-rose text-white' : isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
            >
              {isTtsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : isNarrating ? <Pause className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          )}
          <button onClick={onClose} className={`p-3 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} rounded-2xl transition-all`} title="Close Profile">
            <X className="w-7 h-7" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
        {/* Profile Card */}
        <section className={`${isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-slate-50/40 border-slate-200'} rounded-5xl p-10 relative overflow-hidden group border backdrop-blur-3xl shadow-premium`}>
          <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-10">
            <div className="flex flex-col items-center space-y-5">
              <div className="relative group">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-4xl bg-gradient-to-br from-registry-teal to-registry-cobalt flex items-center justify-center text-white text-5xl font-black italic shadow-glow overflow-hidden border-4 border-white/20"
                >
                  {profile?.photoUrl ? (
                    <img src={profile.photoUrl} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    profileAvatar === 'sonographer' ? <Stethoscope className="w-16 h-16" /> :
                    profileAvatar === 'student' ? <GraduationCap className="w-16 h-16" /> :
                    profileAvatar === 'doctor' ? <HeartPulse className="w-16 h-16" /> :
                    profileAvatar === 'nurse' ? <Activity className="w-16 h-16" /> :
                    <User className="w-16 h-16" />
                  )}
                </motion.div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        onUpdate({ photoUrl: reader.result as string });
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 3000);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center space-x-3 px-6 py-3 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-100'} rounded-2xl shadow-sm border hover:bg-slate-50 dark:hover:bg-slate-700 transition-all`}
              >
                <Camera className="w-5 h-5 text-registry-teal" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Update Photo</span>
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              {isEditing ? (
                <div className="space-y-5">
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className={`w-full p-5 ${isDarkMode ? 'bg-slate-950/50' : 'bg-white/50'} rounded-3xl font-black text-base outline-none border-2 border-transparent focus:border-registry-teal transition-all backdrop-blur-xl`}
                  />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className={`w-full p-5 ${isDarkMode ? 'bg-slate-950/50' : 'bg-white/50'} rounded-3xl font-black text-base outline-none border-2 border-transparent focus:border-registry-teal transition-all backdrop-blur-xl`}
                  />
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest block px-2">Target Registry Date</label>
                    <input 
                      type="date" 
                      value={registryDate} 
                      onChange={(e) => setRegistryDate(e.target.value)}
                      className={`w-full p-5 ${isDarkMode ? 'bg-slate-950/50' : 'bg-white/50'} rounded-3xl font-black text-base outline-none border-2 border-transparent focus:border-registry-teal transition-all backdrop-blur-xl`}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={handleSave} className="flex-1 py-4 bg-registry-teal text-stealth-950 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-glow">Save Changes</button>
                    <button onClick={() => setIsEditing(false)} className={`px-8 py-4 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'} rounded-2xl font-black uppercase tracking-widest text-[11px]`}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <h3 className={`text-3xl md:text-5xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{name || 'Unnamed User'}</h3>
                    <div className={`text-base font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} flex flex-col md:flex-row items-center justify-center md:justify-start gap-4`}>
                      <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-registry-teal" /> {email || 'No email linked'}</span>
                      {registryDate && <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-registry-rose" /> Registry: {new Date(registryDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <button onClick={() => setIsEditing(true)} className="flex items-center space-x-3 text-[11px] font-black uppercase text-registry-teal tracking-[0.2em] hover:underline">
                    <Edit3 className="w-4 h-4" /> <span>Modify Identity</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <User className="absolute -bottom-16 -right-16 w-64 h-64 text-registry-teal/5 rotate-12" />
        </section>

        {!userId && (
          <section className="bg-gradient-to-br from-registry-teal/20 to-registry-cobalt/20 rounded-4xl p-8 border border-registry-teal/30 relative overflow-hidden">
            <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-registry-teal" />
                  <h5 className="text-[11px] font-black uppercase text-registry-teal tracking-widest">Unprotected Session</h5>
                </div>
                <h6 className="text-xl font-black italic uppercase text-white leading-tight">Sync Data to Registry</h6>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest max-w-sm">Create a persistent identity to save progress, unlock achievements, and study across all devices.</p>
              </div>
              <button 
                onClick={signInWithGoogle}
                className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" className="w-4 h-4" alt="Google" />
                <span>Connect with Google</span>
              </button>
            </div>
          </section>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Registry Rank', value: `Level ${Math.floor(totalCompleted / 10) + 1}`, icon: Award, color: 'text-registry-amber', bg: 'bg-registry-amber/10' },
            { label: 'Study Streak', value: `${streak} Days`, icon: Zap, color: 'text-registry-teal', bg: 'bg-registry-teal/10' },
            { label: 'Accuracy', value: `${profile?.diagnosticAccuracy || 94}%`, icon: Target, color: 'text-registry-cobalt', bg: 'bg-registry-cobalt/10' },
            { label: 'Nodes Synced', value: totalCompleted.toString(), icon: Shield, color: 'text-registry-teal', bg: 'bg-registry-teal/10' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className={`${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white/40 border-slate-100'} p-8 rounded-4xl border shadow-premium flex flex-col items-center text-center space-y-3 backdrop-blur-3xl`}
            >
              <div className={`p-4 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <span className={`text-2xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</span>
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Mock Exam History (If Any) */}
        {profile?.examHistory && profile.examHistory.length > 0 && (
          <section className={`${isDarkMode ? 'bg-slate-900/40 border-white/5' : 'bg-slate-50/40 border-slate-200'} rounded-[2.5rem] p-8 md:p-10 border relative overflow-hidden group shadow-premium`}>
            <div className="absolute inset-0 neural-grid opacity-10 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg md:text-xl font-black uppercase italic tracking-tighter flex items-center space-x-3">
                    <Award className="w-5 h-5 text-registry-teal" />
                    <span>Mock Registry History</span>
                  </h4>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Performance visualization over time</p>
                </div>
                <div className="text-right">
                  <div className="text-xl md:text-2xl font-black italic">
                    {Math.round(profile.examHistory[profile.examHistory.length - 1].score)}%
                  </div>
                  <div className="text-[11px] font-black text-registry-teal uppercase tracking-widest">Latest Score</div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profile.examHistory.map((ex, i) => ({
                    name: `Exam ${i + 1}`,
                    score: Math.round(ex.score),
                    date: new Date(ex.date).toLocaleDateString()
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 800 }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 800 }}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDarkMode ? '#080a0f' : '#ffffff',
                        border: '1px solid rgba(0,242,234,0.2)',
                        borderRadius: '24px',
                        fontSize: '11px',
                        fontWeight: 900,
                        textTransform: 'uppercase'
                      }}
                      itemStyle={{ color: '#00f2ea' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#00f2ea" 
                      strokeWidth={3} 
                      dot={{ fill: '#00f2ea', strokeWidth: 2, r: 4 }} 
                      activeDot={{ r: 6, fill: '#00f2ea', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {/* Learning Profile Section */}
        <section className="space-y-6">
          <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] px-2">Learning Profile</h5>
          <div className={`${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'} rounded-[2.5rem] p-8 border space-y-8`}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest block px-1">Profile Avatar</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'default', icon: User },
                    { id: 'sonographer', icon: Stethoscope },
                    { id: 'student', icon: GraduationCap },
                    { id: 'doctor', icon: HeartPulse },
                    { id: 'nurse', icon: Activity },
                  ].map((av) => (
                    <button
                      key={av.id}
                      onClick={() => setProfileAvatar(av.id as any)}
                      className={`p-4 rounded-xl flex items-center justify-center transition-all border-2 ${
                        profileAvatar === av.id 
                          ? 'bg-registry-teal border-registry-teal text-white shadow-lg' 
                          : `${isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-white text-slate-400'} border-transparent hover:border-registry-teal/30`
                      }`}
                    >
                      <av.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest block px-1">Companion Identity (Harvey)</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(['sonographer', 'student', 'default', 'neon', 'stealth', 'golden'] as const).map((skin) => (
                    <button
                      key={skin}
                      onClick={() => setCompanionSkin(skin)}
                      className={`p-2 rounded-xl flex flex-col items-center space-y-2 transition-all border-2 ${
                        companionSkin === skin 
                          ? 'bg-registry-teal border-registry-teal text-white shadow-lg' 
                          : `${isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-white text-slate-400'} border-transparent hover:border-registry-teal/30`
                      }`}
                    >
                      <div className="scale-[0.4] -m-8">
                        <CompanionAvatar state="idle" skin={skin} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest">{skin}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest block px-1">Study Goals</label>
                <textarea 
                  value={studyGoals}
                  onChange={(e) => setStudyGoals(e.target.value)}
                  placeholder="e.g. Pass ARDMS SPI exam in 3 months, master Doppler physics..."
                  className={`w-full p-4 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-teal-500 transition-all resize-none h-24`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest block px-1">Preferred Learning Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['visual', 'auditory', 'reading', 'kinesthetic'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setLearningStyle(style)}
                      className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                        learningStyle === style 
                          ? 'bg-registry-teal border-registry-teal text-white shadow-lg' 
                          : `${isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-white text-slate-400'} border-transparent hover:border-registry-teal/30`
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSave}
                className={`w-full py-4 ${isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'} rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2`}
              >
                <Save className="w-4 h-4" />
                <span>Update Learning Profile</span>
              </button>
            </div>
          </div>
        </section>

        {/* AI Study Plan Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">AI Personalized Study Plan</h5>
            <button 
              onClick={generateAIPlan}
              disabled={isGenerating || !studyGoals}
              className="flex items-center space-x-2 px-4 py-2 bg-registry-teal/10 text-registry-teal rounded-xl hover:bg-registry-teal/20 transition-all disabled:opacity-30"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              <span className="text-[11px] font-black uppercase tracking-widest">Generate New Plan</span>
            </button>
          </div>

          <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-8 rounded-[2.5rem] border shadow-sm min-h-[200px] relative overflow-hidden`}>
            <div className="absolute inset-0 neural-grid opacity-5 pointer-events-none" />
            
            {error && (
              <div className="mb-6 p-4 bg-registry-rose/10 border border-registry-rose/20 rounded-2xl flex items-center space-x-3 text-registry-rose text-[11px] font-black uppercase tracking-widest relative z-10">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {aiPersonalizedPlan ? (
              <div className={`prose prose-sm ${isDarkMode ? 'prose-invert' : ''} max-w-none relative z-10`}>
                <ReactMarkdown>{aiPersonalizedPlan}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12 relative z-10">
                <div className={`w-16 h-16 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'} rounded-2xl flex items-center justify-center`}>
                  <Brain className="w-8 h-8 text-slate-300" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest">No Plan Generated</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest max-w-[200px]">Define your goals and click generate to receive your AI-powered study roadmap.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Offline Access Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">Offline Access</h5>
            {isBulkCaching && (
              <span className="text-[11px] font-black text-registry-teal uppercase tracking-widest animate-pulse">
                Caching {cacheProgress.current}/{cacheProgress.total}
              </span>
            )}
          </div>
          <div className={`${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'} rounded-[2.5rem] p-8 border space-y-4`}>
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 bg-registry-teal/10 rounded-2xl">
                <Database className="w-6 h-6 text-registry-teal" />
              </div>
              <div className="flex-1">
                <p className={`text-xs font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Lecture Cache</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Download all lecture narrations for instant, offline playback.</p>
              </div>
            </div>
            
            {isBulkCaching ? (
              <div className={`w-full h-12 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-xl overflow-hidden relative`}>
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-registry-teal"
                  initial={{ width: 0 }}
                  animate={{ width: `${(cacheProgress.current / cacheProgress.total) * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black uppercase text-white mix-blend-difference">
                  Processing {Math.round((cacheProgress.current / cacheProgress.total) * 100)}%
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={cacheAllLectures}
                  className="w-full py-4 bg-registry-teal text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Cache All Lectures</span>
                </button>
                <button 
                  onClick={() => setShowCacheClearConfirm(true)}
                  className="w-full py-2 text-registry-rose text-[11px] font-black uppercase tracking-widest hover:underline"
                >
                  Clear Local Audio Cache
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Settings List */}
        <div className="space-y-4">
          <h5 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] px-2">System Preferences</h5>
          <div className="grid gap-3">
            {[
              { label: 'Security & Privacy', icon: Shield, desc: 'Manage encryption and data access', action: () => {
                setAlertMessage({ 
                  title: "Security Protocol", 
                  body: "Your data is encrypted with AES-256. Privacy mode is active and all local storage is sandboxed." 
                });
              } },
              { label: 'Notification Pulse', icon: Bell, desc: 'Configure study reminders', action: onOpenReminders },
              { label: 'Cloud Sync', icon: Clock, desc: 'Last backup: 2 hours ago', action: () => {
                onUpdate({ lastManualSync: Date.now() });
                setAlertMessage({ 
                  title: "Cloud Sync Initiated", 
                  body: "Your progress is being synchronized with the master registry. This ensures your data is safe across all devices." 
                });
              } },
            ].map((item, i) => (
              <button key={i} onClick={item.action} className={`w-full ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-5 rounded-2xl border flex items-center justify-between group hover:border-teal-500/30 transition-all`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'} rounded-xl group-hover:bg-teal-500/10 transition-colors`}>
                    <item.icon className="w-5 h-5 text-slate-400 group-hover:text-teal-500" />
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.label}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`pt-8 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-5 bg-registry-rose/10 hover:bg-registry-rose text-registry-rose hover:text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center space-x-3 group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Deauthorize Session</span>
          </button>
        </div>
      </div>

      {/* Custom Modals */}
      <AnimatePresence>
        {(showLogoutConfirm || showCacheClearConfirm || alertMessage) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-stealth-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-stealth-900 border-white/10' : 'bg-white border-slate-200'} shadow-2xl text-center space-y-6`}
            >
              <div className={`w-20 h-20 ${alertMessage ? 'bg-registry-teal/10' : 'bg-registry-rose/10'} rounded-[2rem] flex items-center justify-center mx-auto`}>
                {alertMessage ? <Shield className="w-10 h-10 text-registry-teal" /> : <AlertCircle className="w-10 h-10 text-registry-rose" />}
              </div>
              
              <div className="space-y-2">
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {alertMessage ? alertMessage.title : showLogoutConfirm ? "Deauthorize Session?" : "Clear Audio Cache?"}
                </h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                  {alertMessage ? alertMessage.body : showLogoutConfirm 
                    ? "You will be logged out. Local cache will remain until manually cleared." 
                    : "This will remove all downloaded lecture narrations. You will need to re-download them for offline use."}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {alertMessage ? (
                  <button 
                    onClick={() => setAlertMessage(null)}
                    className="w-full py-4 bg-registry-teal text-stealth-950 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-registry-teal/20 hover:scale-[1.02] transition-all"
                  >
                    Acknowledged
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={async () => {
                        if (showLogoutConfirm) {
                          await logout();
                          onClose();
                        } else {
                          await AudioCache.clear();
                          setShowCacheClearConfirm(false);
                          setShowSuccess(true);
                          setTimeout(() => setShowSuccess(false), 3000);
                        }
                      }}
                      className="w-full py-4 bg-registry-rose text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-registry-rose/20 hover:bg-registry-rose/90 transition-all"
                    >
                      Confirm Action
                    </button>
                    <button 
                      onClick={() => { setShowLogoutConfirm(false); setShowCacheClearConfirm(false); }}
                      className={`w-full py-4 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'} rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-opacity-80 transition-all`}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-registry-teal text-stealth-950 px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-black uppercase tracking-widest text-[11px]">Identity Updated Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
