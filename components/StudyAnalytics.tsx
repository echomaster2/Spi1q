import React from 'react';
import { BarChart3, TrendingUp, Target, Activity, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

interface StudyAnalyticsProps {
  moduleBreakdown: { [title: string]: number };
  activityHistory?: { date: string; count: number }[];
  isDarkMode?: boolean;
}

export const StudyAnalytics: React.FC<StudyAnalyticsProps & { profile?: any }> = ({ moduleBreakdown, activityHistory = [], isDarkMode, profile }) => {
  const modules = Object.entries(moduleBreakdown);
  
  // Prepare data for RadarChart
  const radarData = modules.map(([title, progress]) => ({
    subject: title.split(' ').slice(0, 2).join(' '), // Shorten title for axis
    fullTitle: title,
    A: Math.round(progress as number),
    fullMark: 100,
  }));

  // Prepare data for Activity BarChart
  const barData = activityHistory.map(item => ({
    name: item.date.split('-').slice(1).join('/'), // MM/DD
    count: item.count,
  }));

  const chartColor = '#22d3ee'; // registry-teal
  const secondaryColor = '#f43f5e'; // registry-rose


  // Derived stats
  const accuracy = profile?.diagnosticAccuracy || 92.4;
  const studyHours = profile?.studyTimeTotal ? (profile.studyTimeTotal / 3600).toFixed(1) : "14.2";

  // SPI Readiness Score Calculation
  const calculateReadiness = () => {
    const weights = {
      progress: 0.3,
      accuracy: 0.3,
      consistency: 0.2,
      scenarios: 0.2
    };

    const avgProgress = modules.length > 0 ? modules.reduce((acc, [_, v]) => acc + v, 0) / modules.length : 0;
    const consistency = (activityHistory.length / 7) * 100;
    const scenarioProgress = ((profile?.scenariosCompleted?.length || 0) / 15) * 100; // Assume 15 scenarios total

    const score = (avgProgress * weights.progress) + 
                  (accuracy * weights.accuracy) + 
                  (Math.min(100, consistency) * weights.consistency) + 
                  (Math.min(100, scenarioProgress) * weights.scenarios);
    
    return Math.round(score);
  };

  const readinessScore = calculateReadiness();

  return (
    <div className={`${isDarkMode ? 'atmosphere-bg border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'} rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 border space-y-4 md:space-y-8 relative overflow-hidden group relative z-10`}>
      {/* Background Elements */}
      <div className="absolute inset-0 neural-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-registry-teal/10 rounded-xl border border-registry-teal/20 shadow-lg shadow-registry-teal/10 glass-morphism">
            <BarChart3 className="w-6 h-6 text-registry-teal" />
          </div>
          <div>
            <h3 className={`text-xl font-black uppercase italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Neural Analytics</h3>
            <p className="text-[11px] font-black text-registry-teal uppercase tracking-[0.3em] mt-1">Data Stream: ACTIVE</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
           <div className="text-right">
              <div className={`text-2xl font-black italic tabular-nums leading-none ${readinessScore > 75 ? 'text-green-500' : 'text-amber-500'}`}>
                {readinessScore}%
              </div>
              <p className="text-[11px] font-black text-slate-800 dark:text-slate-500 uppercase tracking-widest mt-1">SPI Readiness</p>
           </div>
           <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center p-1 ${readinessScore > 75 ? 'border-green-500/30' : 'border-amber-500/30'}`}>
              <div className={`w-full h-full rounded-full flex items-center justify-center ${readinessScore > 75 ? 'bg-green-500' : 'bg-amber-500'} shadow-[0_0_15px_rgba(34,197,94,0.4)]`}>
                 <Target className="w-4 h-4 text-white" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 relative z-10">
        {/* Radar Chart for Module Performance */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-black text-slate-800 dark:text-slate-500 uppercase tracking-widest">Performance Matrix</span>
            <span className="text-[11px] font-black text-registry-teal uppercase tracking-widest">Multi-Node Sync</span>
          </div>
          <div className="h-64 w-full glass-morphism rounded-3xl p-4">
            {radarData.length >= 3 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.2)"} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: isDarkMode ? "#94a3b8" : "#334155", fontSize: 8, fontWeight: 900 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Progress"
                    dataKey="A"
                    stroke={chartColor}
                    fill={chartColor}
                    fillOpacity={0.4}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                      border: '1px solid rgba(0,240,255,0.2)',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 900,
                      textTransform: 'uppercase'
                    }}
                    itemStyle={{ color: chartColor }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-slate-200 dark:border-white/5 rounded-3xl opacity-40">
                <p className="text-[11px] font-black uppercase tracking-widest">Need 3+ Modules for Matrix</p>
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart for Activity History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-black text-slate-800 dark:text-slate-500 uppercase tracking-widest">Neural Activity</span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-registry-teal" />
              <span className="text-[11px] font-black text-registry-teal uppercase tracking-widest">Last 7 Cycles</span>
            </div>
          </div>
          <div className="h-32 w-full">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: isDarkMode ? "#64748b" : "#475569", fontSize: 8, fontWeight: 900 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,240,255,0.05)' }}
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                      border: '1px solid rgba(0,240,255,0.2)',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 900,
                      textTransform: 'uppercase'
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColor} fillOpacity={0.6 + (index / barData.length) * 0.4} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border border-dashed border-slate-200 dark:border-white/5 rounded-3xl opacity-40">
                <p className="text-[11px] font-black uppercase tracking-widest">No Recent Activity Logged</p>
              </div>
            )}
          </div>
        </div>
      </div>

       <div className={`pt-6 border-t grid grid-cols-2 gap-4 relative z-10 ${isDarkMode ? 'border-white/5' : 'border-slate-300'}`}>
        <div className={`p-4 rounded-2xl border space-y-1 group/stat hover:border-registry-rose/30 transition-colors ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-300'}`}>
          <p className="text-[11px] font-black uppercase text-slate-800 dark:text-slate-500 tracking-widest group-hover/stat:text-registry-rose transition-colors">Diagnostic Accuracy</p>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-registry-rose" />
            <span className={`text-lg font-mono font-black italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{accuracy}%</span>
          </div>
        </div>
        <div className={`p-4 rounded-2xl border space-y-1 group/stat hover:border-registry-teal/30 transition-colors ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-300'}`}>
          <p className="text-[11px] font-black uppercase text-slate-800 dark:text-slate-500 tracking-widest group-hover/stat:text-registry-teal transition-colors">Neural Focus Time</p>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-registry-teal" />
            <span className={`text-lg font-mono font-black italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{studyHours}h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
