// audio.js - Sistema de áudio e síntese de voz (SpeechSynthesis) em pt-BR
// com fallback gracioso e controles de áudio (mudo / voz).
const AppAudio = (() => {
  let voiceEnabled = true;
  let sfxEnabled = true;
  let ptVoice = null;
  let voiceInitialized = false;

  function initVoices() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prioriza vozes pt-BR nativas / de alta qualidade
    ptVoice =
      voices.find((v) => v.lang === "pt-BR" && (v.name.includes("Google") || v.name.includes("Luciana") || v.name.includes("Maria") || v.name.includes("Natural"))) ||
      voices.find((v) => v.lang === "pt-BR") ||
      voices.find((v) => v.lang.startsWith("pt")) ||
      null;
    voiceInitialized = true;
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = initVoices;
    initVoices();
  }

  function speakText(text, rate = 0.85, pitch = 1.1) {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel(); // cancela falas anteriores em fila
      const utterance = new SpeechSynthesisUtterance(text);
      if (!voiceInitialized) initVoices();
      if (ptVoice) utterance.voice = ptVoice;
      utterance.lang = "pt-BR";
      utterance.rate = rate; // fala um pouco mais pausada para crianças
      utterance.pitch = pitch; // tom ligeiramente amigável / lúdico
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("SpeechSynthesis error:", e);
    }
  }

  function speakSyllable(syllable) {
    speakText(syllable.toLowerCase(), 0.8, 1.15);
  }

  function speakWord(word) {
    speakText(word.toLowerCase(), 0.85, 1.05);
  }

  function speakPhrase(phrase) {
    speakText(phrase, 0.95, 1.1);
  }

  function isVoiceEnabled() {
    return voiceEnabled;
  }

  function setVoiceEnabled(val) {
    voiceEnabled = Boolean(val);
    if (!voiceEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function isSfxEnabled() {
    return sfxEnabled;
  }

  function setSfxEnabled(val) {
    sfxEnabled = Boolean(val);
  }

  return {
    speakText,
    speakSyllable,
    speakWord,
    speakPhrase,
    isVoiceEnabled,
    setVoiceEnabled,
    isSfxEnabled,
    setSfxEnabled,
  };
})();
