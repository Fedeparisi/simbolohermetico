// CelestialSynth - Web Audio synth for meditative sound effects
export class CelestialSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

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
    // Scale down high frequencies to a deep, meditative range (180Hz - 260Hz)
    // and ensure a long decay of at least 3.0s, just like the tarot singing bowls.
    let targetFreq = freq;
    if (freq > 300) {
      targetFreq = 180 + (freq % 80);
    }
    this.playBowl(targetFreq, Math.max(duration, 3.0));
  }



  playBowl(freq: number = 220, duration: number = 4.0) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Tibetan singing bowl partials: Fundamental + typical harmonics with long decay
      const partials = [
        { ratio: 1.0, gain: 0.12, decay: duration },
        { ratio: 2.76, gain: 0.08, decay: duration * 0.85 },
        { ratio: 5.4, gain: 0.05, decay: duration * 0.7 },
        { ratio: 8.1, gain: 0.02, decay: duration * 0.5 }
      ];

      partials.forEach(partial => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        
        osc.type = "sine";
        const targetFreq = freq * partial.ratio;
        osc.frequency.setValueAtTime(targetFreq, now);
        
        // Add a gentle vibrato (frequency modulation) to simulate the bowl's beating ring
        osc.frequency.linearRampToValueAtTime(targetFreq + 1.5, now + 0.15);
        osc.frequency.linearRampToValueAtTime(targetFreq - 1.5, now + 0.65);
        osc.frequency.linearRampToValueAtTime(targetFreq, now + 1.5);
        
        // Soft attack and slow exponential decay
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(partial.gain, now + 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + partial.decay);
        
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
