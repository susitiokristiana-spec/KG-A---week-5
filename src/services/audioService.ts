/**
 * @license
 * Audio Service for Huruf Hh Educational Game
 * Powered by Web Speech API (Indonesian TTS) + Web Audio API Synthesizer
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private bgmInterval: number | null = null;
  private bgmGain: GainNode | null = null;
  public isSoundEnabled: boolean = true;
  public isMusicEnabled: boolean = true;

  constructor() {
    // Check saved preferences
    try {
      const savedSound = localStorage.getItem('hurufH_sound');
      if (savedSound !== null) this.isSoundEnabled = savedSound === 'true';
      const savedMusic = localStorage.getItem('hurufH_music');
      if (savedMusic !== null) this.isMusicEnabled = savedMusic === 'true';
    } catch {
      // ignore localStorage errors in sandboxed iframes
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
    try {
      localStorage.setItem('hurufH_sound', String(enabled));
    } catch {}
  }

  public setMusicEnabled(enabled: boolean) {
    this.isMusicEnabled = enabled;
    try {
      localStorage.setItem('hurufH_music', String(enabled));
    } catch {}
    if (enabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
  }

  /**
   * Speak Indonesian text using Web Speech API with slow, warm tone for TK A kids
   */
  public speak(text: string, rate: number = 0.88, pitch: number = 1.15): Promise<void> {
    if (!this.isSoundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      try {
        window.speechSynthesis.cancel(); // Stop any pending speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate; // slightly slower for kindergarten comprehension
        utterance.pitch = pitch; // slightly friendly & upbeat
        utterance.volume = 1.0;

        // Try to find Indonesian voice
        const voices = window.speechSynthesis.getVoices();
        const idVoice = voices.find(
          (v) => v.lang.startsWith('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia')
        );
        if (idVoice) {
          utterance.voice = idVoice;
          utterance.lang = 'id-ID';
        } else {
          utterance.lang = 'id-ID';
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();

        window.speechSynthesis.speak(utterance);
      } catch {
        resolve();
      }
    });
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  // --- Web Audio SFX Generators ---

  public playPop() {
    if (!this.isSoundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playDing() {
    if (!this.isSoundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(1046.5, now); // C6

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  public playSuccess() {
    if (!this.isSoundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.3, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.35);
    });
  }

  public playCheer() {
    if (!this.isSoundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Fanfare chords
    const chord1 = [523.25, 659.25, 783.99]; // C major
    const chord2 = [587.33, 739.99, 880.0]; // D major
    const chord3 = [1046.5, 1318.5, 1567.98]; // C6 high triumph

    const playChord = (chord: number[], startTime: number, duration: number) => {
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    };

    const now = ctx.currentTime;
    playChord(chord1, now, 0.22);
    playChord(chord2, now + 0.24, 0.22);
    playChord(chord3, now + 0.48, 0.65);
  }

  public playBoing() {
    if (!this.isSoundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.08);
    osc.frequency.linearRampToValueAtTime(220, now + 0.18);
    osc.frequency.linearRampToValueAtTime(140, now + 0.28);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playRoar() {
    if (!this.isSoundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.15);
    osc.frequency.linearRampToValueAtTime(160, now + 0.35);
    osc.frequency.linearRampToValueAtTime(70, now + 0.65);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    // Filter to warm it up
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.7);
  }

  public playHelicopter() {
    if (!this.isSoundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(80 + i * 5, now + i * 0.08);

      gain.gain.setValueAtTime(0.18, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.06);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.07);
    }
  }

  public playChomp() {
    if (!this.isSoundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playSneeze() {
    if (!this.isSoundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Inhale "Haaa..."
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(300, now);
    osc1.frequency.linearRampToValueAtTime(450, now + 0.25);
    gain1.gain.setValueAtTime(0.1, now);
    gain1.gain.linearRampToValueAtTime(0.2, now + 0.25);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Burst "TSYII!"
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(900, now + 0.32);
    osc2.frequency.exponentialRampToValueAtTime(250, now + 0.55);

    gain2.gain.setValueAtTime(0.3, now + 0.32);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.32);
    osc2.stop(now + 0.55);
  }

  public playGiftSparkle() {
    if (!this.isSoundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const sparkleNotes = [659.25, 783.99, 987.77, 1174.66, 1318.5, 1567.98];
    const now = ctx.currentTime;

    sparkleNotes.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.05);

      gain.gain.setValueAtTime(0.2, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.2);
    });
  }

  public playRainDrops() {
    if (!this.isSoundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const f = 1200 + Math.random() * 600;
      const t = now + i * 0.06 + Math.random() * 0.02;

      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * 0.5, t + 0.04);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    }
  }

  // --- Background Nursery Chime Music (Gentle synthesizer) ---
  public startBgm() {
    if (!this.isMusicEnabled || this.bgmInterval) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Gentle 8-bar nursery melody (Twinkle/Bintang style notes)
    // Notes in Hz: C4, G4, A4, G4, F4, E4, D4, C4
    const melody = [
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63
    ];
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isMusicEnabled) return;
      const actx = this.getAudioContext();
      if (!actx || actx.state === 'suspended') return;

      const freq = melody[noteIdx % melody.length];
      noteIdx++;

      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq * 1.5; // music box chime pitch

      const now = actx.currentTime;
      gain.gain.setValueAtTime(0.035, now); // very soft & non-intrusive
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    };

    // Every 550ms play a pleasant chime note
    this.bgmInterval = window.setInterval(playNextNote, 550);
  }

  public stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audio = new AudioService();
