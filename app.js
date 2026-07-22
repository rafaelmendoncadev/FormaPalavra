// app.js - lógica principal do jogo
(() => {
  const state = {
    wordPos: 0,
    syllablePos: 0,
    stats: { wordsCompleted: 0, totalAttempts: 0 },
    busy: false,
  };

  const wordBoard = document.getElementById("wordBoard");
  const wordCounter = document.getElementById("wordCounter");
  const progressFill = document.getElementById("progressFill");
  const micStatus = document.getElementById("micStatus");
  const feedback = document.getElementById("feedback");
  const listenBtn = document.getElementById("listenBtn");
  const listenWordBtn = document.getElementById("listenWordBtn");
  const mascot = document.getElementById("mascot");
  const unsupportedOverlay = document.getElementById("unsupportedOverlay");
  const completeOverlay = document.getElementById("completeOverlay");
  const completeStats = document.getElementById("completeStats");
  const restartBtn = document.getElementById("restartBtn");

  const MASCOT = {
    idle: "🦊",
    listen: "🎤",
    happy: "🥳",
    sad: "🙈",
  };

  function currentWord() {
    return WORDS[state.wordPos];
  }

  function init() {
    try {
      if (typeof SpeechModule === "undefined" || typeof WORDS === "undefined") {
        throw new Error("recursos-nao-carregados");
      }
      if (!SpeechModule.isSupported()) {
        unsupportedOverlay.hidden = false;
      }
      restartBtn.addEventListener("click", onRestart);
      listenBtn.addEventListener("click", onListenSyllable);
      listenWordBtn.addEventListener("click", onListenWord);
      renderWord();
    } catch (e) {
      // Se algum arquivo (words.js/speech.js) não carregou por uma falha de
      // rede, mostramos um aviso claro em vez de deixar a tela em branco.
      feedback.textContent =
        "⚠️ Não consegui carregar o jogo. Recarregue a página (F5).";
      feedback.className = "feedback incorrect";
    }
  }

  function renderWord() {
    const data = currentWord();
    wordBoard.innerHTML = "";
    feedback.textContent = "";
    feedback.className = "feedback";
    micStatus.textContent = "";
    mascot.textContent = MASCOT.idle;
    state.busy = false;

    data.syllables.forEach((syl, idx) => {
      const btn = document.createElement("button");
      btn.className = "syllable-btn";
      btn.textContent = syl;
      btn.dataset.index = String(idx);

      if (idx < state.syllablePos) {
        btn.classList.add("done");
        btn.disabled = true;
      } else if (idx === state.syllablePos) {
        btn.classList.add("active");
        btn.addEventListener("click", () => onSyllableClick(idx));
      } else {
        btn.classList.add("locked");
        btn.disabled = true;
      }
      wordBoard.appendChild(btn);
    });

    wordCounter.textContent = `Palavra ${state.wordPos + 1} de ${WORDS.length}`;
    progressFill.style.width = `${(state.wordPos / WORDS.length) * 100}%`;
  }

  function getBtn(idx) {
    return wordBoard.querySelector(`[data-index="${idx}"]`);
  }

  function onSyllableClick(idx) {
    if (state.busy) return;
    if (idx !== state.syllablePos) return;

    const data = currentWord();
    const target = data.syllables[idx];
    const btn = getBtn(idx);

    state.busy = true;
    btn.classList.add("listening");
    micStatus.textContent = "🎤 Escutando... fale a sílaba!";
    mascot.textContent = MASCOT.listen;
    feedback.textContent = "";
    feedback.className = "feedback";

    SpeechModule.listenOnce({
      onResult: (alternatives) => {
        state.stats.totalAttempts++;
        btn.classList.remove("listening");
        micStatus.textContent = "";
        // Log de diagnóstico. Se uma sílaba não for reconhecida, abra o
        // Console (F12) e me diga o que apareceu nessa linha — assim
        // posso ampliar a tabela de variações do speech.js.
        console.log("[STT]", { target, alternatives });
        const correct = SpeechModule.matchesSyllable(alternatives, target);
        if (correct) {
          handleCorrect(idx, target);
        } else {
          handleIncorrect(idx, target);
        }
      },
      onError: (err) => {
        btn.classList.remove("listening");
        mascot.textContent = MASCOT.idle;
        if (err === "not-allowed" || err === "service-not-allowed") {
          micStatus.textContent =
            "⚠️ Permita o uso do microfone no navegador para jogar.";
        } else if (err === "no-speech") {
          micStatus.textContent = "Não ouvi nada. Clique e fale de novo!";
        } else {
          micStatus.textContent = "Não consegui te ouvir. Tenta de novo!";
        }
        state.busy = false;
      },
    });
  }

  function handleCorrect(idx, target) {
    const btn = getBtn(idx);
    btn.classList.remove("active");
    btn.classList.add("done", "correct-flash");
    btn.disabled = true;
    feedback.textContent = `✅ Isso mesmo! "${target}"`;
    feedback.className = "feedback correct";
    mascot.textContent = MASCOT.happy;

    const data = currentWord();
    const isLastSyllable = idx === data.syllables.length - 1;

    SpeechModule.speak(isLastSyllable ? data.word : target, {
      onEnd: () => {
        if (isLastSyllable) {
          completeWord();
        } else {
          state.syllablePos++;
          activateNextSyllable();
          state.busy = false;
        }
      },
    });
  }

  function activateNextSyllable() {
    const nextBtn = getBtn(state.syllablePos);
    if (nextBtn) {
      nextBtn.classList.remove("locked");
      nextBtn.classList.add("active");
      nextBtn.disabled = false;
      nextBtn.addEventListener("click", () =>
        onSyllableClick(state.syllablePos)
      );
    }
    feedback.textContent = "";
    feedback.className = "feedback";
    mascot.textContent = MASCOT.idle;
  }

  function handleIncorrect(idx, target) {
    const btn = getBtn(idx);
    btn.classList.add("incorrect-flash");
    setTimeout(() => btn.classList.remove("incorrect-flash"), 500);
    feedback.textContent = "❌ Quase lá! Escute e tente de novo:";
    feedback.className = "feedback incorrect";
    mascot.textContent = MASCOT.sad;

    SpeechModule.speak(target, {
      onEnd: () => {
        mascot.textContent = MASCOT.idle;
        state.busy = false;
      },
    });
  }

  function completeWord() {
    state.stats.wordsCompleted++;
    feedback.textContent = `🎉 Palavra completa: ${currentWord().word}!`;
    feedback.className = "feedback complete";
    mascot.textContent = MASCOT.happy;

    setTimeout(() => {
      state.wordPos++;
      state.syllablePos = 0;
      if (state.wordPos >= WORDS.length) {
        showComplete();
      } else {
        renderWord();
      }
    }, 1700);
  }

  function showComplete() {
    completeOverlay.hidden = false;
    completeStats.textContent = `Você completou ${state.stats.wordsCompleted} palavras com ${state.stats.totalAttempts} tentativas no total!`;
  }

  function onListenSyllable() {
    if (state.busy) return;
    const data = currentWord();
    const target = data.syllables[state.syllablePos];
    SpeechModule.speak(target);
  }

  function onListenWord() {
    if (state.busy) return;
    SpeechModule.speak(currentWord().word);
  }

  function onRestart() {
    state.wordPos = 0;
    state.syllablePos = 0;
    state.stats = { wordsCompleted: 0, totalAttempts: 0 };
    completeOverlay.hidden = true;
    renderWord();
  }

  init();
})();
