// Original boot chime. Not sampled, not derived from any product.
// A soft ascending open chord with a shimmer tail, built from sine oscillators.

export async function playBootChime(gain = 0.65) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  if (ctx.state === "suspended") {
    try { await ctx.resume(); } catch { /* blocked */ }
  }

  const now = ctx.currentTime;

  // Original voicing: C add9 — C(261.63), E(329.63), G(392.00), D(587.33), E(659.25)
  const voices = [261.63, 329.63, 392.00, 587.33, 659.25];
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(gain, now + 0.12);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
  master.connect(ctx.destination);

  voices.forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = Math.max(0.05, 0.32 - i * 0.045);
    osc.connect(g).connect(master);
    osc.start(now + i * 0.06);
    osc.stop(now + 2.55);
  });

  // Shimmer: a triangle sweep way up top
  const shimmer = ctx.createOscillator();
  shimmer.type = "triangle";
  shimmer.frequency.setValueAtTime(1046.5, now + 0.3);
  shimmer.frequency.exponentialRampToValueAtTime(1864.66, now + 2.0);
  const sg = ctx.createGain();
  sg.gain.setValueAtTime(0.0001, now);
  sg.gain.exponentialRampToValueAtTime(0.045, now + 0.6);
  sg.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);
  shimmer.connect(sg).connect(master);
  shimmer.start(now + 0.25);
  shimmer.stop(now + 2.35);

  return new Promise((r) => setTimeout(r, 2550));
}
