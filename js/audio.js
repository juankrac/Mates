// ============================================================
// AUDIO
// ============================================================

let audioCtx = null;
try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}

export function playTone(freq, duration = 0.15, type = 'sine', volume = 0.2, delay = 0) {
  if (!audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t = audioCtx.currentTime + delay;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  } catch(e) {}
}

export const Sounds = {
  step: () => playTone(220, 0.06, 'square', 0.05),
  open: () => { playTone(523, 0.1); playTone(659, 0.12, 'sine', 0.15, 0.08); },
  correct: () => { playTone(659, 0.12, 'sine', 0.25); playTone(784, 0.12, 'sine', 0.25, 0.1); playTone(1047, 0.2, 'sine', 0.25, 0.2); },
  wrong: () => { playTone(200, 0.15, 'sawtooth', 0.15); playTone(150, 0.2, 'sawtooth', 0.15, 0.1); },
  complete: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => playTone(f, 0.18, 'triangle', 0.22, i * 0.1)); },
  talk: () => { playTone(500, 0.05, 'triangle', 0.12); playTone(700, 0.05, 'triangle', 0.12, 0.06); },
  change: () => { playTone(880, 0.08, 'triangle', 0.15); playTone(1100, 0.08, 'triangle', 0.15, 0.06); },
  achievement: () => { [659, 784, 988, 1319, 1568].forEach((f, i) => playTone(f, 0.15, 'triangle', 0.2, i * 0.08)); },
  mission: () => { [784, 988, 1175].forEach((f, i) => playTone(f, 0.18, 'sine', 0.22, i * 0.1)); },
  photo: () => { playTone(1500, 0.04, 'square', 0.25); playTone(900, 0.06, 'square', 0.2, 0.05); },
  bossRoar: () => { playTone(80, 0.5, 'sawtooth', 0.25); playTone(120, 0.5, 'sawtooth', 0.2, 0.1); },
  bossHit: () => { playTone(200, 0.1, 'square', 0.3); playTone(100, 0.15, 'sawtooth', 0.25, 0.05); },
  bossWin: () => { [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => playTone(f, 0.25, 'triangle', 0.28, i * 0.15)); },
  home: () => { [523, 659, 784].forEach((f, i) => playTone(f, 0.3, 'sine', 0.2, i * 0.15)); }
};

export const Music = {
  playing: false, timer: null, step: 0,
  scale: [0, 2, 4, 5, 7, 9, 11, 12],
  chord: [0, 4, 7],
  start() {
    if (this.playing) return;
    this.playing = true;
    this.step = 0;
    const tick = () => {
      if (!this.playing) return;
      const idx = this.scale[(this.step * 3) % this.scale.length];
      playTone(261.63 * Math.pow(2, idx / 12), 0.9, 'sine', 0.035);
      if (this.step % 4 === 0) {
        const bi = this.chord[Math.floor(this.step / 4) % this.chord.length];
        playTone(130.81 * Math.pow(2, bi / 12), 1.8, 'triangle', 0.045);
      }
      this.step++;
      this.timer = setTimeout(tick, 500);
    };
    tick();
  },
  stop() {
    this.playing = false;
    if (this.timer) clearTimeout(this.timer);
  }
};

export function resumeAudio() {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}