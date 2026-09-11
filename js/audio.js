// ============================================================
// AUDIO: efectos de sonido y musica generativa
// ============================================================

// Contexto de audio (se crea al primer uso)
let audioCtx = null;
try {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
  console.warn('No se pudo crear AudioContext');
}

// ============================================================
// FUNCION BASE: reproducir un tono
// ============================================================
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
  } catch (e) {}
}

// ============================================================
// EFECTOS DE SONIDO
// ============================================================
export const Sounds = {
  // Pasos al caminar
  step: () => playTone(220, 0.06, 'square', 0.05),

  // Abrir una casita
  open: () => {
    playTone(523, 0.1);
    playTone(659, 0.12, 'sine', 0.15, 0.08);
  },

  // Respuesta correcta
  correct: () => {
    playTone(659, 0.12, 'sine', 0.25);
    playTone(784, 0.12, 'sine', 0.25, 0.1);
    playTone(1047, 0.2, 'sine', 0.25, 0.2);
  },

  // Respuesta incorrecta
  wrong: () => {
    playTone(200, 0.15, 'sawtooth', 0.15);
    playTone(150, 0.2, 'sawtooth', 0.15, 0.1);
  },

  // Completar un tema
  complete: () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => {
      playTone(f, 0.18, 'triangle', 0.22, i * 0.1);
    });
  },

  // Hablar con NPC
  talk: () => {
    playTone(500, 0.05, 'triangle', 0.12);
    playTone(700, 0.05, 'triangle', 0.12, 0.06);
  },

  // Cambiar una opcion de personalizacion
  change: () => {
    playTone(880, 0.08, 'triangle', 0.15);
    playTone(1100, 0.08, 'triangle', 0.15, 0.06);
  },

  // Desbloquear un logro
  achievement: () => {
    [659, 784, 988, 1319, 1568].forEach((f, i) => {
      playTone(f, 0.15, 'triangle', 0.2, i * 0.08);
    });
  },

  // Completar una mision
  mission: () => {
    [784, 988, 1175].forEach((f, i) => {
      playTone(f, 0.18, 'sine', 0.22, i * 0.1);
    });
  },

  // Hacer una foto
  photo: () => {
    playTone(1500, 0.04, 'square', 0.25);
    playTone(900, 0.06, 'square', 0.2, 0.05);
  },

  // Jefe final
  bossRoar: () => {
    playTone(80, 0.5, 'sawtooth', 0.25);
    playTone(120, 0.5, 'sawtooth', 0.2, 0.1);
  },
  bossHit: () => {
    playTone(200, 0.1, 'square', 0.3);
    playTone(100, 0.15, 'sawtooth', 0.25, 0.05);
  },
  bossWin: () => {
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => {
      playTone(f, 0.25, 'triangle', 0.28, i * 0.15);
    });
  },

  // Entrar en casa
  home: () => {
    [523, 659, 784].forEach((f, i) => {
      playTone(f, 0.3, 'sine', 0.2, i * 0.15);
    });
  }
};

// ============================================================
// MUSICA GENERATIVA DE FONDO
// ============================================================
export const Music = {
  playing: false,
  timer: null,
  step: 0,
  scale: [0, 2, 4, 5, 7, 9, 11, 12], // escala pentatonica
  chord: [0, 4, 7],                  // acorde mayor

  start() {
    if (this.playing) return;
    this.playing = true;
    this.step = 0;
    const tick = () => {
      if (!this.playing) return;
      // Melodia
      const idx = this.scale[(this.step * 3) % this.scale.length];
      playTone(261.63 * Math.pow(2, idx / 12), 0.9, 'sine', 0.035);
      // Bajo cada 4 pasos
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

// ============================================================
// UTILIDAD: reanudar el contexto de audio
// (los navegadores lo requieren tras un gesto del usuario)
// ============================================================
export function resumeAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}