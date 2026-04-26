import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
console.log("📻 RadioContext Module Loading...");

interface Station {
  id: string;
  name: string;
  genre: string;
  url: string;
  color: string;
}

const DEFAULT_STATIONS: Station[] = [
  {
    id: 'lofi',
    name: 'Neural Focus Lofi',
    genre: 'Ambient / Study',
    url: 'https://stream.zeno.fm/0r0xa792kwzuv',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'synth',
    name: 'Physics Synthwave',
    genre: 'Retrowave / Energy',
    url: 'https://stream.zeno.fm/f37n1638u98uv',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'fairway',
    name: 'Fairway Dreams',
    genre: 'Suno / Chill',
    url: 'https://stream.zeno.fm/s6h9v792kwzuv',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'registry-anthem',
    name: 'Registry Anthem',
    genre: 'Suno / Epic',
    url: 'https://stream.zeno.fm/6v7n1638u98uv',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'sound-wave',
    name: 'Sound Wave Symphony',
    genre: 'Suno / Orchestral',
    url: 'https://stream.zeno.fm/0r0xa792kwzuv',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'physics-anthems',
    name: 'Physics Anthems',
    genre: 'Suno / Educational',
    url: 'https://stream.zeno.fm/f37n1638u98uv',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'ultrasound-beats',
    name: 'Ultrasound Beats',
    genre: 'Suno / Lo-Fi',
    url: 'https://stream.zeno.fm/s6h9v792kwzuv',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'spi-physics-1',
    name: 'SPI Physics Anthem',
    genre: 'Suno / Educational',
    url: 'https://suno.com/song/de485ce0-36f5-4af7-8a13-8db6656524bc',
    color: 'from-teal-400 to-emerald-500'
  },
  {
    id: 'spi-transducer',
    name: 'The Transducer',
    genre: 'Suno / Physics',
    url: 'https://suno.com/song/1ab86882-d7e2-40ad-b317-3b7b4f23584d',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 'spi-sound-waves',
    name: 'Sound Waves',
    genre: 'Suno / Physics',
    url: 'https://suno.com/song/6bb37caa-b672-4e3b-ae20-5b576667d170',
    color: 'from-cyan-400 to-blue-500'
  },
  {
    id: 'spi-bioeffects',
    name: 'Bioeffects & Safety',
    genre: 'Suno / Physics',
    url: 'https://suno.com/song/df1e99e8-ac74-4daf-b187-4877fb77adab',
    color: 'from-green-400 to-teal-500'
  },
  {
    id: 'spi-qa',
    name: 'Quality Assurance',
    genre: 'Suno / Physics',
    url: 'https://suno.com/song/401ecfdf-7f29-4d89-bba2-53594883c648',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'spi-artifacts',
    name: 'Propagation Artifacts',
    genre: 'Suno / Physics',
    url: 'https://suno.com/song/890d81af-a9dd-4a7c-bd8b-8b8ad2130009',
    color: 'from-red-400 to-rose-500'
  },
  {
    id: 'spi-vafa',
    name: 'V.A.F.A',
    genre: 'Suno / Physics',
    url: 'https://suno.com/song/775bfa1f-84aa-40ef-86e1-e55b8cb22087',
    color: 'from-indigo-400 to-violet-500'
  },
  {
    id: 'spi-amplitude',
    name: 'Amplitude & Layers',
    genre: 'Suno / Physics',
    url: 'https://suno.com/song/25e910d9-87c0-419e-b7c5-b7e225ce3f70',
    color: 'from-fuchsia-400 to-purple-500'
  },
  {
    id: 'spi-nyquist',
    name: 'Nyquist Limit',
    genre: 'Suno / Physics',
    url: 'https://suno.com/song/014f90ea-500d-44f7-9bac-e17de2a186e0',
    color: 'from-sky-400 to-blue-500'
  },
  {
    id: 'spi-intensity',
    name: 'Intensity',
    genre: 'Suno / Physics',
    url: 'https://suno.com/song/4ba22220-6597-4caa-a4ee-d3a2d42b801d',
    color: 'from-lime-400 to-green-500'
  },
  {
    id: 'spi-impedance',
    name: 'Impedance',
    genre: 'Suno / Physics',
    url: 'https://suno.com/song/f21cd5b1-e115-4b66-a7d0-6e2268a08929',
    color: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'spi-prf',
    name: 'PRF',
    genre: 'Suno / Physics',
    url: 'https://suno.com/song/d6348582-cdcf-4ac6-bd7f-099cd484d9de',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'spi-all-lies',
    name: 'All Lies (Artifacts)',
    genre: 'Suno / Physics',
    url: 'https://suno.com/song/4382167c-18b7-4b2d-9d40-dfa3a58cace2',
    color: 'from-slate-500 to-slate-700'
  },
  {
    id: 'spi-hire-me',
    name: 'Hire Me',
    genre: 'Suno / Motivation',
    url: 'https://suno.com/song/8a524fad-19c5-45f4-92b0-bcf7ecc4c641',
    color: 'from-gold-400 to-yellow-600'
  },
  {
    id: 'spi-another-one',
    name: 'Another Ones Begun',
    genre: 'Suno / Motivation',
    url: 'https://suno.com/song/ae8d8910-026c-461e-b243-5662c119cac3',
    color: 'from-rose-400 to-pink-500'
  },
  {
    id: 'spi-then-came-good',
    name: 'Then Came The Good',
    genre: 'Suno / Motivation',
    url: 'https://suno.com/song/3e51adc2-fe78-4c4b-a3ed-00c378a9d128',
    color: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'spi-wasnt-my-time',
    name: "Wasn't My Time",
    genre: 'Suno / Motivation',
    url: 'https://suno.com/song/56974d1c-55c1-41c8-b555-6f5d606d0da4',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'spi-memory',
    name: 'Through Me Like A Memory',
    genre: 'Suno / Motivation',
    url: 'https://suno.com/song/606b6246-8274-4a54-8f36-a10c9098338c',
    color: 'from-purple-400 to-indigo-500'
  },
  {
    id: 'spi-mess',
    name: 'Life Has Left Me a Mess',
    genre: 'Suno / Motivation',
    url: 'https://suno.com/song/bd6b7fe1-9d68-4779-850e-0f19efdb6fe0',
    color: 'from-red-400 to-orange-500'
  },
  {
    id: 'spi-quiet-company',
    name: 'Quiet Company',
    genre: 'Suno / Motivation',
    url: 'https://suno.com/song/0da74940-43d8-492d-b3fe-750e6e72c820',
    color: 'from-emerald-400 to-green-500'
  },
  {
    id: 'spi-watching-me',
    name: 'Watching Me',
    genre: 'Suno / Motivation',
    url: 'https://suno.com/song/b6cb91d0-5d1e-4972-99c2-33fa0dd8bf3f',
    color: 'from-indigo-400 to-blue-500'
  },
  {
    id: 'white',
    name: 'Acoustic White Noise',
    genre: 'Focus / Static',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: 'from-slate-400 to-slate-600'
  }
];

const transformSunoUrl = (url: string): string => {
  // Handle Suno song URLs: https://suno.com/song/[uuid] -> https://cdn1.suno.ai/[uuid].mp3
  const songMatch = url.match(/suno\.com\/song\/([a-zA-Z0-9-]{10,50})/i);
  if (songMatch) {
    const transformed = `https://cdn1.suno.ai/${songMatch[1]}.mp3`;
    console.log(`Transformed Suno URL: ${url} -> ${transformed}`);
    return transformed;
  }
  return url;
};

const INITIAL_STATIONS = DEFAULT_STATIONS.map(s => ({
  ...s,
  url: transformSunoUrl(s.url)
}));

interface RadioContextType {
  isPlaying: boolean;
  currentStation: Station;
  volume: number;
  isMuted: boolean;
  stations: Station[];
  togglePlay: () => void;
  changeStation: (station: Station) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (isMuted: boolean) => void;
  addStation: (station: Omit<Station, 'id' | 'color'>) => void;
  removeStation: (id: string) => void;
  error: string | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  analyserRef: React.RefObject<AnalyserNode | null>;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stations, setStations] = useState<Station[]>(() => {
    const saved = localStorage.getItem('neural_radio_stations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s: Station) => ({ ...s, url: transformSunoUrl(s.url) }));
        }
      } catch (e) {
        return INITIAL_STATIONS;
      }
    }
    return INITIAL_STATIONS;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState<Station>(() => {
    const saved = localStorage.getItem('neural_radio_stations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { ...parsed[0], url: transformSunoUrl(parsed[0].url) };
        }
      } catch (e) {}
    }
    return INITIAL_STATIONS[0];
  });
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [useCors, setUseCors] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    localStorage.setItem('neural_radio_stations', JSON.stringify(stations));
  }, [stations]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const initAudio = () => {
    if (!audioRef.current || !useCors) return;
    if (!audioContextRef.current) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (typeof AudioContextClass === 'function') {
        try {
          audioContextRef.current = new AudioContextClass();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
        } catch (e) {
          console.error("AudioContext initialization failed (Illegal constructor?)", e);
        }
      } else {
        console.error("AudioContext not supported in this environment");
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    setError(null);
    if (useCors) initAudio();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      audioRef.current.play().catch(err => {
        console.error("Manual play failed:", err);
        // If it failed due to a source error, the onError handler will catch it
      });
    }
    setIsPlaying(!isPlaying);
  };

  const changeStation = (station: Station) => {
    setCurrentStation(station);
    setIsPlaying(true);
    setError(null);
    setUseCors(true); // Reset CORS on station change
    if (audioRef.current) {
      audioRef.current.src = station.url;
      // Play is handled by onCanPlay
    }
  };

  const addStation = (data: Omit<Station, 'id' | 'color'>) => {
    const colors = [
      'from-teal-500 to-teal-600',
      'from-blue-500 to-indigo-600',
      'from-orange-500 to-rose-600',
      'from-violet-500 to-fuchsia-600'
    ];
    const station: Station = {
      ...data,
      url: transformSunoUrl(data.url),
      id: Date.now().toString(),
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setStations(prev => [...prev, station]);
  };

  const removeStation = (id: string) => {
    if (DEFAULT_STATIONS.some(s => s.id === id)) return;
    setStations(prev => prev.filter(s => s.id !== id));
    if (currentStation.id === id) {
      changeStation(DEFAULT_STATIONS[0]);
    }
  };

  return (
    <RadioContext.Provider value={{
      isPlaying,
      currentStation,
      volume,
      isMuted,
      stations,
      togglePlay,
      changeStation,
      setVolume,
      setIsMuted,
      addStation,
      removeStation,
      error,
      audioRef,
      analyserRef
    }}>
      {children}
      <audio 
        key={`${currentStation.url}-${useCors}`}
        ref={audioRef} 
        src={useCors ? `/api/proxy-stream?url=${encodeURIComponent(currentStation.url)}` : currentStation.url} 
        crossOrigin={useCors ? "anonymous" : undefined}
        autoPlay={false}
        onCanPlay={() => {
          if (isPlaying) {
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
              audioContextRef.current.resume().catch(() => {});
            }
            audioRef.current?.play().catch(err => {
              console.error("Playback failed after canplay:", err);
            });
          }
        }}
        onError={(e) => {
          const target = e.target as HTMLAudioElement;
          console.error(`Audio Error for ${currentStation.name} (${currentStation.url}):`, target.error);
          
          // Fallback: If CORS failed, try without it
          if (useCors && (target.error?.code === 4 || target.error?.message?.includes('CORS'))) {
            console.warn(`CORS failed for ${currentStation.name}, retrying without CORS (visualizer will be disabled)`);
            setUseCors(false);
            return;
          }

          setError(`Failed to load frequency stream: ${target.error?.message || "Source might be offline or blocked"}. URL: ${currentStation.url}`);
          setIsPlaying(false);
        }}
      />
    </RadioContext.Provider>
  );
};

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (context === undefined) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};
