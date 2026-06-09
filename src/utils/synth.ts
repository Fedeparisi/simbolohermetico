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

  playChime(freq: number = 294, duration: number = 2.0, type: "sine" | "triangle" = "sine") {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (type === "sine") {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + 0.5);
      }
      gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio API blocked", e);
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
