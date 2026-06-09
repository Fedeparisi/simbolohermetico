// CelestialSynth - Web Audio synth for meditative sound effects
export class CelestialSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bowlIndex: number = 0;
  // A beautiful, meditative pentatonic scale (D3, E3, G3, A3, B3, D4) for harmonic variation
  private bowlScale: number[] = [146.83, 164.81, 196.00, 220.00, 246.94, 293.66];

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
  }

  playChime(freq: number = 220, duration: number = 3.0, type: "sine" | "triangle" = "sine") {
    // Simply trigger playBowl, which handles the soft, rolling scale logic automatically
    this.playBowl(freq, Math.max(duration, 3.0));
  }



  playBowl(freq: number = 220, duration: number = 4.0) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Select next note in our pentatonic scale to create a relaxing melody on sequential taps
      const baseFreq = this.bowlScale[this.bowlIndex % this.bowlScale.length];
      this.bowlIndex++;

      // Soft meditative partials (Tibetan singing bowl harmonics) with longer, quieter gains
      const partials = [
        { ratio: 1.0, gain: 0.07, decay: duration },
        { ratio: 2.76, gain: 0.04, decay: duration * 0.85 },
        { ratio: 5.4, gain: 0.02, decay: duration * 0.7 },
        { ratio: 8.1, gain: 0.01, decay: duration * 0.5 }
      ];

      partials.forEach(partial => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        
        osc.type = "sine";
        const targetFreq = baseFreq * partial.ratio;
        osc.frequency.setValueAtTime(targetFreq, now);
        
        // Very gentle frequency modulation (vibrato) for organic warmth
        osc.frequency.linearRampToValueAtTime(targetFreq + 1.0, now + 0.3);
        osc.frequency.linearRampToValueAtTime(targetFreq - 1.0, now + 1.0);
        osc.frequency.linearRampToValueAtTime(targetFreq, now + 2.0);
        
        // Super soft progressive attack (fade-in) to eliminate sudden clicks/jumps
        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(partial.gain, now + 0.45); // Smooth 450ms fade-in
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + partial.decay);
        
        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        
        osc.start(now);
        osc.stop(now + partial.decay);
      });
    } catch (e) {
      console.warn("Web Audio API singing bowl block", e);
    }
  }



  createHumer(freq: number = 136.1) {
    if (this.isMuted) return null;
    try {
      this.initCtx();
      if (!this.ctx) return null;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gainNode.gain.setValueAtTime(0.02, this.ctx.currentTime);
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      osc.start();
      return {
        stop: () => { try { osc.stop(); } catch (e) {} },
        modulate: (ramp: number, duration: number) => {
          if (!this.ctx) return;
          gainNode.gain.linearRampToValueAtTime(ramp, this.ctx.currentTime + duration);
        }
      };
    } catch (e) {
      return null;
    }
  }
}

export const synthInstance = new CelestialSynth();
