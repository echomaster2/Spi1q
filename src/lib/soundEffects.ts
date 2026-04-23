let sharedCtx: AudioContext | null = null;

export const playSound = (type: 'click' | 'hover' | 'success' | 'error' | 'beep') => {
  try {
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    if (!sharedCtx) {
      sharedCtx = new AudioContextClass();
    }
    
    const ctx = sharedCtx!;
    
    // Explicitly resume if suspended (common browser requirement)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    switch (type) {
      case 'hover':
        // Very subtle, soft tick
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
        
      case 'click':
        // Gentle, soft tap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
        
      case 'success':
        // Soft, ethereal chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
        gain.gain.setValueAtTime(0.05, now + 0.15);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
        break;
        
      case 'error':
        // Soft low hum
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
        
      case 'beep':
        // Gentle soft beep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
    }
  } catch (e) {
    // Ignore audio errors (e.g. user hasn't interacted with document yet)
    console.debug("Audio play failed:", e);
  }
};
