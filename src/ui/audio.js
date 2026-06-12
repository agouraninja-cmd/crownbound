// Tiny WebAudio synth — no sound files, just charming blips.
let ctx = null;
let master = null;

function ensureCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.16;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// browsers only allow audio after a user gesture
export function initAudio() {
  const unlock = () => ensureCtx();
  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('keydown', unlock, { once: true });
}

function tone({ freq = 440, to = freq, type = 'sine', dur = 0.1, gain = 0.5, when = 0 }) {
  if (!ctx) return;
  const t0 = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t0 + dur);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise({ dur = 0.08, gain = 0.3, freq = 1200, when = 0 }) {
  if (!ctx) return;
  const t0 = ctx.currentTime + when;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(filter).connect(g).connect(master);
  src.start(t0);
}

export const sfx = {
  swing: () => noise({ dur: 0.09, gain: 0.25, freq: 900 }),
  thud: () => {
    tone({ freq: 120, to: 55, type: 'square', dur: 0.08, gain: 0.4 });
    noise({ dur: 0.05, gain: 0.2, freq: 400 });
  },
  squeak: () => tone({ freq: 950, to: 480, type: 'triangle', dur: 0.12, gain: 0.3 }),
  ratDie: () => {
    tone({ freq: 700, to: 180, type: 'triangle', dur: 0.25, gain: 0.3 });
  },
  coin: () => {
    tone({ freq: 880, to: 880, dur: 0.07, gain: 0.25 });
    tone({ freq: 1320, to: 1320, dur: 0.12, gain: 0.2, when: 0.06 });
  },
  questDone: () => {
    tone({ freq: 523, dur: 0.12, gain: 0.3 });
    tone({ freq: 659, dur: 0.12, gain: 0.3, when: 0.1 });
    tone({ freq: 784, dur: 0.2, gain: 0.3, when: 0.2 });
  },
  levelUp: () => {
    tone({ freq: 392, dur: 0.1, gain: 0.3 });
    tone({ freq: 523, dur: 0.1, gain: 0.3, when: 0.09 });
    tone({ freq: 659, dur: 0.1, gain: 0.3, when: 0.18 });
    tone({ freq: 784, dur: 0.25, gain: 0.35, when: 0.27 });
  },
  page: () => noise({ dur: 0.15, gain: 0.12, freq: 2400 }),
  creak: () => {
    tone({ freq: 160, to: 70, type: 'sawtooth', dur: 0.3, gain: 0.12 });
    noise({ dur: 0.12, gain: 0.08, freq: 600 });
  },
  hurt: () => tone({ freq: 200, to: 90, type: 'sawtooth', dur: 0.15, gain: 0.3 }),
};
