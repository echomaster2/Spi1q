import React, { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';

interface FullscreenToggleProps {
  className?: string;
  iconClassName?: string;
}

export const FullscreenToggle: React.FC<FullscreenToggleProps> = ({ className = "", iconClassName = "w-5 h-5" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <button 
      onClick={toggleFullscreen} 
      className={`p-2.5 md:p-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${className}`}
      title="Toggle Fullscreen"
    >
      {isFullscreen ? <Minimize className={iconClassName} /> : <Maximize className={iconClassName} />}
    </button>
  );
};
