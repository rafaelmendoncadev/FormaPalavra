// sfx.js - efeitos sonoros sintetizados via Web Audio API.
// Sem arquivos de áudio externos, sem dependências, 100% offline.
const SFX = (() => {
  let ctx = null;

  function getCtx() {
    if (typeof AppAudio !== "undefined" && !AppAudio.isSfxEnabled()) return null;
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
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainPeak || 0.16, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    } catch (e) {
      console.warn("SFX error:", e);
    }
  }

  function playTap() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    tone(520, audioCtx.currentTime, 0.06, "sine", 0.1);
  }

  function playTilePick() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    tone(440, t, 0.07, "triangle", 0.12);
  }

  function playCorrect() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    // Acorde alegre de acerto (Dó - Sol - Dó maior alto)
    tone(523.25, t, 0.12, "sine", 0.15); // C5
    tone(659.25, t + 0.07, 0.14, "sine", 0.16); // E5
    tone(783.99, t + 0.14, 0.2, "sine", 0.18); // G5
  }

  function playWordComplete() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    // Fanfarra alegre de palavra completa
    tone(523.25, t, 0.1, "sine", 0.15);
    tone(659.25, t + 0.08, 0.1, "sine", 0.15);
    tone(783.99, t + 0.16, 0.12, "sine", 0.18);
    tone(1046.5, t + 0.24, 0.28, "triangle", 0.2);
  }

  function playIncorrect() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    // Som amigável e suave (sem punição ou estrondo)
    tone(330, t, 0.12, "sine", 0.08);
    tone(293.66, t + 0.09, 0.16, "sine", 0.07);
  }

  function playStar() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    tone(987.77, t, 0.15, "triangle", 0.16);
    tone(1318.51, t + 0.08, 0.25, "sine", 0.18);
  }

  function playReward() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      tone(freq, t + idx * 0.08, 0.18, "sine", 0.14);
    });
  }

  function playLevelComplete() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, i) => {
      tone(freq, t + i * 0.1, 0.24, "triangle", 0.18);
    });
  }

  function playBadgeUnlock() {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, i) => {
      tone(freq, t + i * 0.09, 0.28, "sine", 0.18);
    });
  }

  return {
    playTap,
    playTilePick,
    playCorrect,
    playWordComplete,
    playIncorrect,
    playStar,
    playReward,
    playLevelComplete,
    playBadgeUnlock,
  };
})();
