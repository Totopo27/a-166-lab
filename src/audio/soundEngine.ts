/**
 * Web Audio API synthesizer for Eurorack clicks & drum sounds
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Dispara sonido analógico percusivo según el canal/rol
   */
  public trigger(type: 'in1' | 'in2' | 'and' | 'or' | 'xor' | 'nand' | 'nor' | 'xnor') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (type) {
      case 'in1':
        // Beep corto de entrada A (agudo suave)
        this.playPip(880, 0.02, 0.15, now);
        break;
      case 'in2':
        // Beep corto de entrada B (medio suave)
        this.playPip(440, 0.02, 0.15, now);
        break;
      case 'and':
        // Kick contundente o acento
        this.playKick(now);
        break;
      case 'or':
        // Snare / Rimshot
        this.playRimshot(now);
        break;
      case 'xor':
        // Hi-Hat metálico y crujiente
        this.playHiHat(now);
        break;
      default:
        // Clic de trigger genérico modular
        this.playModularClick(now);
        break;
    }
  }

  private playPip(freq: number, duration: number, gainVal: number, time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playKick(time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  private playRimshot(time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, time);
    osc.frequency.exponentialRampToValueAtTime(180, time + 0.05);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.07);
  }

  private playHiHat(time: number) {
    if (!this.ctx) return;
    // Ruido blanco filtrado paso banda
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  private playModularClick(time: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(1200, time);
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.015);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.015);
  }
}

export const soundEngine = new SoundEngine();
