// sabi.js - Sistema da personagem guia Sabi: expressões, falas contextuais e balão de diálogo.
const SabiGuide = (() => {
  const PHRASES = {
    welcome: [
      "Oi! Vamos descobrir algumas palavras?",
      "Olá, amiguinho! Que bom te ver por aqui!",
      "Preparado para uma aventura divertida?",
      "Vamos brincar e aprender juntos hoje?",
    ],
    startWord: [
      "Vamos montar essa palavra!",
      "Qual sílaba vem primeiro?",
      "Olha a imagem! Que palavra será?",
      "Você consegue montar!",
    ],
    correctSyllable: [
      "Muito bem!",
      "Isso mesmo!",
      "Boa! Continue assim!",
      "Você acertou!",
    ],
    perfectWord: [
      "Uau! Você acertou sem errar!",
      "Sensacional! Perfeito de primeira!",
      "Estrela dourada pra você! Parabéns!",
    ],
    goodWord: [
      "Muito bem! Você conseguiu!",
      "Que legal! Palavra montada!",
      "Parabéns! Mais uma palavra pro seu conhecimento!",
    ],
    softError: [
      "Quase! Vamos tentar novamente?",
      "Não desista! Tenta outra sílaba.",
      "Tudo bem errar! Vamos descobrir juntos!",
      "Você está quase lá!",
    ],
    hint: [
      "Dica da Sabi: olha a sílaba brilhando!",
      "Veja essa dica especial pra você!",
    ],
    levelComplete: [
      "Parabéns! Você completou essa ilha!",
      "Que incrível! Você é um verdadeiro explorador!",
      "Sensacional! Todas as palavras desta ilha foram conquistadas!",
    ],
    gardenReward: [
      "Olha só! Uma nova flor apareceu no meu jardim!",
      "Nosso jardim está ficando cada vez mais lindo!",
      "Mais uma sementinha cresceu e floresceu!",
    ],
    badgeUnlocked: [
      "Viva! Você ganhou uma nova conquista!",
      "Olha só a sua medalha brilhante!",
    ],
  };

  function randomPhrase(type) {
    const list = PHRASES[type] || PHRASES.welcome;
    return list[Math.floor(Math.random() * list.length)];
  }

  function setMascotMood(elementId, mood) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.remove("sabi--idle", "sabi--happy", "sabi--thinking", "sabi--celebrating", "sabi--encouraging");
    el.classList.add("sabi--" + (mood || "idle"));
  }

  function showSpeech(speechElId, text, autoHideMs = 0, speakVoice = false) {
    const el = document.getElementById(speechElId);
    if (!el) return;
    el.textContent = text;
    el.classList.remove("hidden");
    el.classList.add("visible");

    if (speakVoice && typeof AppAudio !== "undefined") {
      AppAudio.speakPhrase(text);
    }

    if (autoHideMs > 0) {
      setTimeout(() => {
        if (el.textContent === text) {
          el.classList.remove("visible");
          el.classList.add("hidden");
        }
      }, autoHideMs);
    }
  }

  return {
    PHRASES,
    randomPhrase,
    setMascotMood,
    showSpeech,
  };
})();
