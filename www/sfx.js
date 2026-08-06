// sfx.js - pequenos efeitos sonoros sintetizados via Web Audio API.
// Sem arquivos de áudio externos, sem internet, sem permissão de microfone.
const SFX = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freq, startTime, duration, type, gainPeak) {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(gainPeak || 0.18, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  function playTap() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    tone(520, audioCtx.currentTime, 0.08, "triangle", 0.12);
  }

  function playCorrect() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    tone(587, t, 0.14, "sine", 0.16);
    tone(784, t + 0.09, 0.18, "sine", 0.18);
  }

  function playIncorrect() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    tone(220, t, 0.16, "sawtooth", 0.1);
    tone(180, t + 0.08, 0.18, "sawtooth", 0.09);
  }

  function playLevelComplete() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    [523, 659, 784, 1046].forEach((freq, i) => {
      tone(freq, t + i * 0.11, 0.22, "sine", 0.17);
    });
  }

  return { playTap, playCorrect, playIncorrect, playLevelComplete };
})();
