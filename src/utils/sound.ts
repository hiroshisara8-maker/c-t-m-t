// Web Audio synthesizer for cute, soothing tactile feedback

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Bubble pop sound (pitch randomized for satisfying feedback)
  public playPop(frequencyOffset: number = 0) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = 480 + frequencyOffset + Math.random() * 120;
      const now = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.09);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore audio failure
    }
  }

  // Gentle water drop sound for planting/growth
  public playWaterDrop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // Calming chime/bell chord for comforting message or healing completion
  public playComfortChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 major chord
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.08, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.85);
      });
    } catch {}
  }

  // Paper tear / rustle sound - ultra realistic fiber rip with micro-snaps
  public playPaperRip(longTear: boolean = false) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = longTear ? 0.45 : 0.26;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate stochastic tearing fibers: bursts of tearing friction + rapid snap spikes
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        // Periodic tear surges (rips happening across paper segments)
        const ripSurge = Math.sin(t * Math.PI * (longTear ? 5 : 3));
        const friction = (Math.random() * 2 - 1) * Math.max(0.2, ripSurge);
        // Sharp fiber snap clicks
        const isSnap = Math.random() > 0.92;
        const snap = isSnap ? (Math.random() * 2 - 1) * 2.2 : 0;
        data[i] = (friction * 0.7 + snap) * (1 - Math.pow(t, 2));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Resonant dual bandpass filter to capture paper raspiness
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(longTear ? 2600 : 3200, now);
      filter.frequency.exponentialRampToValueAtTime(longTear ? 1400 : 1800, now + duration);
      filter.Q.setValueAtTime(3.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch {}
  }

  // Paper crumple / crunch sound - realistic multi-crease crunch sequence
  public playPaperCrumple() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const totalDuration = 0.42;

      // 1. Hand pressure low impact thump
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
      oscGain.gain.setValueAtTime(0.15, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);

      // 2. Multi-crease buckling noise (rapid series of paper crinkles)
      const bufferSize = Math.floor(this.ctx.sampleRate * totalDuration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate;
        // Clusters of folds crushing at ~0.04s, 0.11s, 0.19s, 0.27s
        const inBurst =
          Math.exp(-Math.pow((t - 0.04) / 0.03, 2)) +
          Math.exp(-Math.pow((t - 0.11) / 0.035, 2)) * 1.3 +
          Math.exp(-Math.pow((t - 0.19) / 0.04, 2)) * 1.1 +
          Math.exp(-Math.pow((t - 0.28) / 0.045, 2)) * 0.8;

        const grain = (Math.random() * 2 - 1);
        const crinkleSnap = Math.random() > 0.89 ? (Math.random() * 2 - 1) * 2.0 : 0;
        data[i] = (grain + crinkleSnap) * inBurst * 0.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.linearRampToValueAtTime(2200, now + totalDuration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + totalDuration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch {}
  }

  // Realistic fire burning & crackling embers sound
  public playFire() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 1.35;

      // 1. Low combustion roar & whoosh
      const roarOsc = this.ctx.createOscillator();
      const roarGain = this.ctx.createGain();
      roarOsc.type = "sawtooth";
      roarOsc.frequency.setValueAtTime(95, now);
      roarOsc.frequency.exponentialRampToValueAtTime(55, now + duration);
      roarGain.gain.setValueAtTime(0.09, now);
      roarGain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      roarGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      const roarFilter = this.ctx.createBiquadFilter();
      roarFilter.type = "lowpass";
      roarFilter.frequency.setValueAtTime(220, now);

      roarOsc.connect(roarFilter);
      roarFilter.connect(roarGain);
      roarGain.connect(this.ctx.destination);
      roarOsc.start(now);
      roarOsc.stop(now + duration);

      // 2. Continuous flame sizzle & crackling ember pops
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate;
        // Flame wind turbulence
        const flameWind = 0.5 + 0.5 * Math.sin(t * 18);
        const hiss = (Math.random() * 2 - 1) * 0.25 * flameWind;
        // Random sharp crackles and popping embers
        const isCrackle = Math.random() > 0.982;
        const pop = isCrackle ? (Math.random() * 2 - 1) * 2.5 : 0;

        // Envelope: quick flare up then gently fade
        const env = t < 0.2 ? t / 0.2 : Math.max(0, 1 - (t - 0.2) / (duration - 0.2));
        data[i] = (hiss + pop) * env;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1600, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch {}
  }

  // Squishy soft squeeze & pop sound (cute rubbery spring)
  public playSquish(pitchFactor: number = 1) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Slurpy squishy slide
      const startFreq = 260 * pitchFactor;
      const midFreq = 140 * pitchFactor;
      const endFreq = 340 * pitchFactor;

      osc.type = "sine";
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(midFreq, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.12);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.14);

      // Low pass filter for soft jelly-like sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(900, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  // Card flip / light click
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }
}

export const soundManager = new SoundEffectsManager();
