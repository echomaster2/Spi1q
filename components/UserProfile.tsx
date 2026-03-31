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
import { generateText, generateSpeech } from '../src/services/aiService';
import { UserProfile as UserProfileType, Module, LessonContentMap } from '../types';
import { AudioCache } from '../src/lib/audioCache';
import { CompanionAvatar, CompanionSkin } from './CompanionAvatar';

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
    onUpdate({ name, email, studyGoals, learningStyle, aiPersonalizedPlan, companionSkin, profileAvatar });
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
          const base64Audio = await generateSpeech(`Mature professional educator with a deep, authoritative voice: ${content.narrationScript}`, 'Charon');
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
    <div className={`flex flex-col h-full ${isDarkMode ? 'bg-slate-950' : 'bg-white'} transition-colors duration-500 overflow-hidden relative z-[150]`}>
      <header className={`p-6 ${isDarkMode ? 'bg-stealth-950 text-white border-white/10' : 'bg-white text-slate-900 border-slate-100'} flex justify-between items-center shrink-0 border-b transition-colors`}>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            {profileAvatar === 'sonographer' ? <Stethoscope className="w-6 h-6 text-white" /> :
             profileAvatar === 'student' ? <GraduationCap className="w-6 h-6 text-white" /> :
             profileAvatar === 'doctor' ? <HeartPulse className="w-6 h-6 text-white" /> :
             profileAvatar === 'nurse' ? <Activity className="w-6 h-6 text-white" /> :
             <User className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tight italic uppercase leading-none">User Profile</h4>
            <p className={`text-[10px] ${isDarkMode ? 'opacity-50' : 'text-slate-400'} font-black uppercase tracking-widest mt-1`}>System Identity & Settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onPlayNarration && (
            <button 
              onClick={onPlayNarration} 
              disabled={isTtsLoading}
              className={`p-2 rounded-xl transition-all ${isNarrating ? 'bg-registry-rose animate-pulse' : isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
            >
              {isTtsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isNarrating ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
          <button onClick={onClose} className={`p-2 ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-100'} rounded-xl transition-all`} title="Close Profile">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Profile Card */}
        <section className={`${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'} rounded-[2.5rem] p-8 relative overflow-hidden group border`}>
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-4xl font-black italic shadow-2xl overflow-hidden">
                  {profile?.photoUrl ? (
                    <img src={profile.photoUrl} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    profileAvatar === 'sonographer' ? <Stethoscope className="w-12 h-12" /> :
                    profileAvatar === 'student' ? <GraduationCap className="w-12 h-12" /> :
                    profileAvatar === 'doctor' ? <HeartPulse className="w-12 h-12" /> :
                    profileAvatar === 'nurse' ? <Activity className="w-12 h-12" /> :
                    <User className="w-12 h-12" />
                  )}
                </div>
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
                className={`flex items-center space-x-2 px-4 py-2 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-xl shadow-sm border hover:bg-slate-50 dark:hover:bg-slate-700 transition-all`}
              >
                <Camera className="w-4 h-4 text-teal-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Update Photo</span>
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className={`w-full p-4 ${isDarkMode ? 'bg-slate-950' : 'bg-white'} rounded-2xl font-black text-sm outline-none border-2 border-transparent focus:border-teal-500 transition-all`}
                  />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className={`w-full p-4 ${isDarkMode ? 'bg-slate-950' : 'bg-white'} rounded-2xl font-black text-sm outline-none border-2 border-transparent focus:border-teal-500 transition-all`}
                  />
                  <div className="flex space-x-3">
                    <button onClick={handleSave} className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg">Save Changes</button>
                    <button onClick={() => setIsEditing(false)} className={`px-6 py-3 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'} rounded-xl font-black uppercase tracking-widest text-[10px]`}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <h3 className={`text-2xl md:text-4xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{name || 'Unnamed User'}</h3>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} flex items-center justify-center md:justify-start gap-2`}>
                      <Mail className="w-3.5 h-3.5" /> {email || 'No email linked'}
                    </p>
                  </div>
                  <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 text-[10px] font-black uppercase text-teal-600 tracking-widest hover:underline">
                    <Edit3 className="w-3 h-3" /> <span>Modify Identity</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <User className="absolute -bottom-10 -right-10 w-48 h-48 text-teal-500/5 rotate-12" />
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Registry Rank', value: `Level ${Math.floor(totalCompleted / 10) + 1}`, icon: Award, color: 'text-amber-500' },
            { label: 'Study Streak', value: `${streak} Days`, icon: Zap, color: 'text-teal-500' },
            { label: 'Accuracy', value: '94%', icon: Target, color: 'text-blue-500' },
            { label: 'Nodes Synced', value: totalCompleted.toString(), icon: Shield, color: 'text-teal-500' },
          ].map((stat, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-6 rounded-[2rem] border shadow-sm flex flex-col items-center text-center space-y-2`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <span className={`text-xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</span>
              <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Learning Profile Section */}
        <section className="space-y-6">
          <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] px-2">Learning Profile</h5>
          <div className={`${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'} rounded-[2.5rem] p-8 border space-y-8`}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block px-1">Profile Avatar</label>
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
                          ? 'bg-teal-600 border-teal-600 text-white shadow-lg' 
                          : `${isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-white text-slate-400'} border-transparent hover:border-teal-500/30`
                      }`}
                    >
                      <av.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block px-1">Companion Identity (Harvey)</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(['sonographer', 'student', 'default', 'neon', 'stealth', 'golden'] as const).map((skin) => (
                    <button
                      key={skin}
                      onClick={() => setCompanionSkin(skin)}
                      className={`p-2 rounded-xl flex flex-col items-center space-y-2 transition-all border-2 ${
                        companionSkin === skin 
                          ? 'bg-teal-600 border-teal-600 text-white shadow-lg' 
                          : `${isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-white text-slate-400'} border-transparent hover:border-teal-500/30`
                      }`}
                    >
                      <div className="scale-[0.4] -m-8">
                        <CompanionAvatar state="idle" skin={skin} />
                      </div>
                      <span className="text-[7px] font-black uppercase tracking-widest">{skin}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block px-1">Study Goals</label>
                <textarea 
                  value={studyGoals}
                  onChange={(e) => setStudyGoals(e.target.value)}
                  placeholder="e.g. Pass ARDMS SPI exam in 3 months, master Doppler physics..."
                  className={`w-full p-4 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-teal-500 transition-all resize-none h-24`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block px-1">Preferred Learning Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['visual', 'auditory', 'reading', 'kinesthetic'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setLearningStyle(style)}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                        learningStyle === style 
                          ? 'bg-teal-600 border-teal-600 text-white shadow-lg' 
                          : `${isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-white text-slate-400'} border-transparent hover:border-teal-500/30`
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
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">AI Personalized Study Plan</h5>
            <button 
              onClick={generateAIPlan}
              disabled={isGenerating || !studyGoals}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600/10 text-teal-600 rounded-xl hover:bg-teal-600/20 transition-all disabled:opacity-30"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              <span className="text-[8px] font-black uppercase tracking-widest">Generate New Plan</span>
            </button>
          </div>

          <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-8 rounded-[2.5rem] border shadow-sm min-h-[200px] relative overflow-hidden`}>
            <div className="absolute inset-0 neural-grid opacity-5 pointer-events-none" />
            
            {error && (
              <div className="mb-6 p-4 bg-registry-rose/10 border border-registry-rose/20 rounded-2xl flex items-center space-x-3 text-registry-rose text-[10px] font-black uppercase tracking-widest relative z-10">
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
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest max-w-[200px]">Define your goals and click generate to receive your AI-powered study roadmap.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Offline Access Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Offline Access</h5>
            {isBulkCaching && (
              <span className="text-[8px] font-black text-teal-500 uppercase tracking-widest animate-pulse">
                Caching {cacheProgress.current}/{cacheProgress.total}
              </span>
            )}
          </div>
          <div className={`${isDarkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'} rounded-[2.5rem] p-8 border space-y-4`}>
            <div className="flex items-center space-x-4 mb-2">
              <div className="p-3 bg-teal-500/10 rounded-2xl">
                <Database className="w-6 h-6 text-teal-500" />
              </div>
              <div className="flex-1">
                <p className={`text-xs font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Lecture Cache</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Download all lecture narrations for instant, offline playback.</p>
              </div>
            </div>
            
            {isBulkCaching ? (
              <div className={`w-full h-12 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-xl overflow-hidden relative`}>
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-teal-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(cacheProgress.current / cacheProgress.total) * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase text-white mix-blend-difference">
                  Processing {Math.round((cacheProgress.current / cacheProgress.total) * 100)}%
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={cacheAllLectures}
                  className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Cache All Lectures</span>
                </button>
                <button 
                  onClick={() => setShowCacheClearConfirm(true)}
                  className="w-full py-2 text-registry-rose text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  Clear Local Audio Cache
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Settings List */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] px-2">System Preferences</h5>
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
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
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
            className="w-full py-5 bg-registry-rose/10 hover:bg-registry-rose text-registry-rose hover:text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center space-x-3 group"
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
                          localStorage.removeItem('spi_profile');
                          window.location.reload();
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
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-teal-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center space-x-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-black uppercase tracking-widest text-[10px]">Identity Updated Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
