// app.js - Lógica completa da tela de jogo e lição de sílabas do Coruja Letrada.
// Suporta interação híbrida (Toque + Drag & Drop), síntese de voz PT-BR, guia Sabi e gamificação.
(() => {
  const state = {
    currentLevel: null,
    wordPos: 0,
    slots: [], // sílabas esperadas na ordem correta
    filled: [], // array de strings ou null para cada slot
    tiles: [], // { id, text } sílabas disponíveis na bandeja
    wrongCountWord: 0, // erros na palavra atual
    wrongCountIsland: 0, // erros no nível
    dragTileId: null,
    stats: { wordsCompleted: 0, totalAttempts: 0 },
  };

  // Elementos da UI
  const wordImage = document.getElementById("wordImage");
  const slotsRow = document.getElementById("slotsRow");
  const tileTray = document.getElementById("tileTray");
  const wordCounter = document.getElementById("wordCounter");
  const levelBadge = document.getElementById("levelBadge");
  const progressFill = document.getElementById("progressFill");
  const feedback = document.getElementById("feedback");
  const backToNavBtn = document.getElementById("backToNavBtn");
  const mascot = document.getElementById("mascot");
  const speakWordBtn = document.getElementById("speakWordBtn");

  // Modais de Celebração
  const wordCelebrationOverlay = document.getElementById("wordCelebrationOverlay");
  const wordCelebrationTitle = document.getElementById("wordCelebrationTitle");
  const wordCelebrationWord = document.getElementById("wordCelebrationWord");
  const wordStarsRow = document.getElementById("wordStarsRow");
  const wordNextBtn = document.getElementById("wordNextBtn");

  const completeOverlay = document.getElementById("completeOverlay");
  const completeTitle = document.getElementById("completeTitle");
  const completeSubtitle = document.getElementById("completeSubtitle");
  const completeStats = document.getElementById("completeStats");
  const islandStarsWrap = document.getElementById("islandStarsWrap");
  const continueBtn = document.getElementById("continueBtn");
  const confettiCanvas = document.getElementById("confettiCanvas");

  let tileIdSeq = 0;

  function currentWordData() {
    if (state.currentLevel && state.currentLevel.customWords) {
      return state.currentLevel.customWords[state.wordPos] || state.currentLevel.customWords[0];
    }
    return WORDS[state.wordPos];
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function openLevel(level, startWordPos) {
    state.currentLevel = level;
    state.wordPos = typeof startWordPos === "number" ? startWordPos : level.start;
    state.stats = { wordsCompleted: 0, totalAttempts: 0 };
    state.wrongCountIsland = 0;

    levelBadge.textContent = level.name ? level.name : "Ilha " + level.id;
    renderWord();
  }
  window.LessonScreen = { open: openLevel };

  function renderWord() {
    const data = currentWordData();
    if (!data) {
      finishLevel();
      return;
    }

    state.slots = data.syllables.slice();
    state.filled = new Array(state.slots.length).fill(null);
    state.tiles = shuffle(
      data.syllables.map((text) => ({ id: "t" + tileIdSeq++, text }))
    );
    state.wrongCountWord = 0;

    if (feedback) {
      feedback.textContent = "";
      feedback.className = "feedback";
    }

    // Atualiza estado e fala da Sabi
    SabiGuide.setMascotMood("mascot", "idle");
    SabiGuide.showSpeech("gameSabiSpeech", SabiGuide.randomPhrase("startWord"), 4000);

    // Imagem da palavra
    wordImage.classList.remove("word-image--missing");
    wordImage.alt = data.word;
    wordImage.onerror = () => wordImage.classList.add("word-image--missing");
    wordImage.src = data.image || "";

    // Botão de falar palavra
    if (speakWordBtn) {
      speakWordBtn.onclick = () => {
        AppAudio.speakWord(data.word);
        if (typeof SFX !== "undefined") SFX.playTap();
      };
    }

    renderSlots();
    renderTray();

    // Contadores e Barra de Progresso
    const level = state.currentLevel;
    const localIndex = state.wordPos - level.start + 1;
    const levelSize = level.end - level.start;
    wordCounter.textContent = `Palavra ${localIndex} de ${levelSize}`;
    progressFill.style.width = ((localIndex - 1) / levelSize) * 100 + "%";
  }

  function renderSlots() {
    slotsRow.innerHTML = "";
    state.slots.forEach((targetSyl, i) => {
      const slot = document.createElement("div");
      const filledText = state.filled[i];
      slot.className = "slot" + (filledText ? " slot--filled" : "");
      slot.dataset.index = String(i);
      slot.textContent = filledText || "";

      // Interação Acessível: Tocar no slot preenchido devolve a sílaba para a bandeja!
      if (filledText) {
        slot.setAttribute("title", "Toque para retirar a sílaba");
        slot.addEventListener("click", () => {
          removeTileFromSlot(i);
        });
      }

      slotsRow.appendChild(slot);
    });
  }

  function removeTileFromSlot(slotIndex) {
    const text = state.filled[slotIndex];
    if (!text) return;
    state.filled[slotIndex] = null;
    state.tiles.push({ id: "t" + tileIdSeq++, text });
    if (typeof SFX !== "undefined") SFX.playTap();
    renderSlots();
    renderTray();
  }

  function renderTray() {
    tileTray.innerHTML = "";
    state.tiles.forEach((tile) => {
      const el = document.createElement("div");
      el.className = "syllable-tile";
      el.textContent = tile.text;
      el.dataset.tileId = tile.id;
      el.dataset.text = tile.text;

      // Suporte duplo: Toque Simples (Tap-to-Place) e Drag & Drop
      attachDragAndTap(el, tile);
      tileTray.appendChild(el);
    });
  }

  function firstEmptySlotIndex() {
    return state.filled.indexOf(null);
  }

  function attachDragAndTap(el, tile) {
    let hasMoved = false;
    let startX = 0;
    let startY = 0;

    el.addEventListener("pointerdown", (e) => {
      if (state.dragTileId) return;
      state.dragTileId = tile.id;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;

      el.setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      // Fala a pronúncia da sílaba ao interagir
      AppAudio.speakSyllable(tile.text);
      if (typeof SFX !== "undefined") SFX.playTilePick();

      function onMove(ev) {
        const dx = Math.abs(ev.clientX - startX);
        const dy = Math.abs(ev.clientY - startY);
        if (dx > 8 || dy > 8) {
          hasMoved = true;
          el.classList.add("syllable-tile--dragging");
          el.style.position = "fixed";
          el.style.left = ev.clientX - offsetX + "px";
          el.style.top = ev.clientY - offsetY + "px";
          el.style.width = rect.width + "px";
          el.style.zIndex = "500";
        }
      }

      function onUp(ev) {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        state.dragTileId = null;

        el.classList.remove("syllable-tile--dragging");
        el.style.position = "";
        el.style.left = "";
        el.style.top = "";
        el.style.width = "";
        el.style.zIndex = "";

        if (hasMoved) {
          // Soltou após arrastar
          handleDrop(ev.clientX, ev.clientY, tile);
        } else {
          // Apenas um toque (Tap-to-Place para acessibilidade)
          handleTapPlace(tile);
        }
      }

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
    });
  }

  // Mecânica Tap-to-Place: Encaixa no primeiro slot vazio disponível
  function handleTapPlace(tile) {
    const slotIdx = firstEmptySlotIndex();
    if (slotIdx === -1) return;
    evaluatePlacement(slotIdx, tile);
  }

  // Mecânica Drag & Drop
  function handleDrop(clientX, clientY, tile) {
    const targets = document.elementsFromPoint(clientX, clientY);
    const slotEl = targets.find(
      (t) => t.classList && t.classList.contains("slot") && !t.classList.contains("slot--filled")
    );

    if (!slotEl) {
      renderTray();
      return;
    }

    const slotIndex = parseInt(slotEl.dataset.index, 10);
    evaluatePlacement(slotIndex, tile);
  }

  function evaluatePlacement(slotIndex, tile) {
    state.stats.totalAttempts++;
    const targetWord = currentWordData().word;
    const expectedSyl = state.slots[slotIndex];
    const isCorrect = expectedSyl === tile.text;

    // Registra tentativa no progresso analítico
    const curProgress = Progress.load();
    Progress.recordAttempt(curProgress, isCorrect, targetWord, isCorrect ? null : tile.text);

    if (isCorrect) {
      // Acerto
      state.filled[slotIndex] = tile.text;
      state.tiles = state.tiles.filter((t) => t.id !== tile.id);

      SFX.playCorrect();
      SabiGuide.setMascotMood("mascot", "happy");
      SabiGuide.showSpeech("gameSabiSpeech", SabiGuide.randomPhrase("correctSyllable"), 1500);

      feedback.textContent = "✨ Muito bem!";
      feedback.className = "feedback";

      renderSlots();
      renderTray();

      if (state.filled.every((v) => v !== null)) {
        completeWord();
      } else {
        setTimeout(() => SabiGuide.setMascotMood("mascot", "idle"), 800);
      }
    } else {
      // Erro suave / sem punição
      state.wrongCountWord++;
      state.wrongCountIsland++;

      SFX.playIncorrect();
      SabiGuide.setMascotMood("mascot", "encouraging");
      SabiGuide.showSpeech("gameSabiSpeech", SabiGuide.randomPhrase("softError"), 2000);

      feedback.textContent = "Quase lá! Tente outra sílaba.";
      feedback.className = "feedback incorrect";

      renderTray();

      setTimeout(() => {
        SabiGuide.setMascotMood("mascot", "idle");
        if (feedback.textContent.includes("Quase")) feedback.textContent = "";
      }, 1400);

      // Se errar 3 vezes, mostra dica suave iluminando a correta
      if (state.wrongCountWord >= 3) {
        showHint(slotIndex);
      }
    }
  }

  function showHint(slotIndex) {
    const neededText = state.slots[slotIndex];
    const tileEl = tileTray.querySelector(`[data-text="${neededText}"]`);
    if (tileEl) {
      tileEl.classList.add("syllable-tile--hint");
      SabiGuide.showSpeech("gameSabiSpeech", SabiGuide.randomPhrase("hint"), 2500);
      setTimeout(() => tileEl.classList.remove("syllable-tile--hint"), 2500);
    }
  }

  function completeWord() {
    const data = currentWordData();
    state.stats.wordsCompleted++;

    // Registra conclusão e ganho de flor/estrelas
    let curProgress = Progress.load();
    const { state: updatedProgress, stars } = Progress.recordWordResult(
      curProgress,
      data,
      state.wordPos,
      state.wrongCountWord
    );

    // Avalia desbloqueio de Conquistas/Badges
    Achievements.evaluateAll(updatedProgress);

    // Efeitos de comemoração
    SFX.playWordComplete();
    AppAudio.speakWord(data.word);
    SabiGuide.setMascotMood("mascot", "celebrating");

    const praise = stars === 3 ? SabiGuide.randomPhrase("perfectWord") : SabiGuide.randomPhrase("goodWord");
    SabiGuide.showSpeech("gameSabiSpeech", praise, 3000);

    feedback.textContent = `🎉 Palavra completa: ${data.word}!`;
    feedback.className = "feedback complete";

    // Avança para a próxima palavra após breve pausa
    setTimeout(() => {
      const level = state.currentLevel;
      state.wordPos++;
      if (state.wordPos >= level.end) {
        finishLevel();
      } else {
        renderWord();
      }
    }, 1800);
  }

  function finishLevel() {
    const level = state.currentLevel;
    const stars = state.wrongCountIsland === 0 ? 3 : state.wrongCountIsland <= 3 ? 2 : 1;

    let curProgress = Progress.load();
    curProgress = Progress.completeLevel(curProgress, level.id, stars, LEVELS.length);
    Achievements.evaluateAll(curProgress);

    SFX.playLevelComplete();
    startConfetti();

    completeTitle.textContent = `🎉 Ilha ${level.id} Concluída!`;
    completeSubtitle.textContent = `Você dominou todas as palavras de ${level.name}!`;

    if (islandStarsWrap) {
      islandStarsWrap.innerHTML = "⭐".repeat(stars);
    }

    if (completeStats) {
      completeStats.innerHTML = `
        <p>Você aprendeu <strong>${state.stats.wordsCompleted} novas palavras</strong>!</p>
        <p>🌸 Ganhou <strong>${state.stats.wordsCompleted} flores</strong> para o Jardim do Sabi!</p>
      `;
    }

    completeOverlay.hidden = false;
  }

  // Sistema performático e leve de confetes via Canvas
  function startConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ["#6C63FF", "#FFD166", "#5CCB8A", "#FF70A6", "#54A0FF"];
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      r: Math.random() * 8 + 4,
      d: Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngle: 0,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
    }));

    let animationFrame = null;
    let startTime = Date.now();

    function draw() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) * 1.5;
        p.tilt = Math.sin(p.tiltAngle) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });

      if (Date.now() - startTime < 4000) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }
    draw();
  }

  // Ações de botões
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      completeOverlay.hidden = true;
      if (window.showMap) window.showMap();
      else if (window.showHome) window.showHome();
    });
  }

  if (backToNavBtn) {
    backToNavBtn.addEventListener("click", () => {
      if (typeof SFX !== "undefined") SFX.playTap();
      if (window.showMap) window.showMap();
      else if (window.showHome) window.showHome();
    });
  }
})();
