// app.js - lógica da tela de lição: monta a palavra arrastando as
// sílabas embaralhadas até os espaços corretos (sem voz).
(() => {
  const state = {
    currentLevel: null,
    wordPos: 0,
    slots: [], // sílabas corretas, na ordem certa (referência, não muda)
    filled: [], // bool por slot
    tiles: [], // { id, text } - sílabas ainda na bandeja, embaralhadas
    wrongCount: 0,
    dragTileId: null,
    stats: { wordsCompleted: 0, totalAttempts: 0 },
  };

  const wordImage = document.getElementById("wordImage");
  const slotsRow = document.getElementById("slotsRow");
  const tileTray = document.getElementById("tileTray");
  const wordCounter = document.getElementById("wordCounter");
  const levelBadge = document.getElementById("levelBadge");
  const progressFill = document.getElementById("progressFill");
  const feedback = document.getElementById("feedback");
  const backToMapBtn = document.getElementById("backToMapBtn");
  const mascot = document.getElementById("mascot");
  const completeOverlay = document.getElementById("completeOverlay");
  const completeTitle = document.getElementById("completeTitle");
  const completeStats = document.getElementById("completeStats");
  const continueBtn = document.getElementById("continueBtn");

  const MASCOT_STATES = ["idle", "happy", "sad"];
  function setMascotState(name) {
    MASCOT_STATES.forEach((s) => mascot.classList.remove("mascot--" + s));
    mascot.classList.add("mascot--" + name);
  }

  function currentWord() {
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

  function openLevel(level) {
    state.currentLevel = level;
    state.wordPos = level.start;
    state.stats = { wordsCompleted: 0, totalAttempts: 0 };
    levelBadge.textContent = "Nível " + level.id;
    renderWord();
  }
  window.LessonScreen = { open: openLevel };

  let tileIdSeq = 0;

  function renderWord() {
    const data = currentWord();
    state.slots = data.syllables.slice();
    state.filled = new Array(state.slots.length).fill(false);
    state.tiles = shuffle(
      data.syllables.map((text) => ({ id: "t" + tileIdSeq++, text }))
    );
    state.wrongCount = 0;
    feedback.textContent = "";
    feedback.className = "feedback";
    setMascotState("idle");

    wordImage.classList.remove("word-image--missing");
    wordImage.alt = data.word;
    wordImage.onerror = () => {
      wordImage.classList.add("word-image--missing");
    };
    wordImage.src = data.image || "";

    renderSlots();
    renderTray();

    const level = state.currentLevel;
    const localIndex = state.wordPos - level.start + 1;
    const levelSize = level.end - level.start;
    wordCounter.textContent = "Palavra " + localIndex + " de " + levelSize;
    progressFill.style.width = ((localIndex - 1) / levelSize) * 100 + "%";
  }

  function renderSlots() {
    slotsRow.innerHTML = "";
    state.slots.forEach((syl, i) => {
      const slot = document.createElement("div");
      slot.className = "slot" + (state.filled[i] ? " slot--filled" : "");
      slot.dataset.index = String(i);
      slot.textContent = state.filled[i] ? syl : "";
      slotsRow.appendChild(slot);
    });
  }

  function renderTray() {
    tileTray.innerHTML = "";
    state.tiles.forEach((tile) => {
      const el = document.createElement("div");
      el.className = "syllable-tile";
      el.textContent = tile.text;
      el.dataset.tileId = tile.id;
      el.dataset.text = tile.text;
      attachDrag(el, tile);
      tileTray.appendChild(el);
    });
  }

  function firstEmptySlotIndex() {
    return state.filled.indexOf(false);
  }

  function showHint() {
    const idx = firstEmptySlotIndex();
    if (idx === -1) return;
    const neededText = state.slots[idx];
    const tileEl = tileTray.querySelector('[data-text="' + neededText + '"]');
    if (tileEl) {
      tileEl.classList.add("syllable-tile--hint");
      setTimeout(() => tileEl.classList.remove("syllable-tile--hint"), 1500);
    }
  }

  function attachDrag(el, tile) {
    el.addEventListener("pointerdown", (e) => {
      if (state.dragTileId) return;
      state.dragTileId = tile.id;
      el.setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();
      el.classList.add("syllable-tile--dragging");
      el.style.width = rect.width + "px";
      el.style.position = "fixed";
      el.style.left = rect.left + "px";
      el.style.top = rect.top + "px";
      el.style.zIndex = "50";
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      function onMove(ev) {
        el.style.left = ev.clientX - offsetX + "px";
        el.style.top = ev.clientY - offsetY + "px";
      }

      function onUp(ev) {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        state.dragTileId = null;
        handleDrop(ev.clientX, ev.clientY, tile, el);
      }

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
    });
  }

  function handleDrop(clientX, clientY, tile, el) {
    const targets = document.elementsFromPoint(clientX, clientY);
    const slotEl = targets.find(
      (t) =>
        t.classList &&
        t.classList.contains("slot") &&
        !t.classList.contains("slot--filled")
    );

    el.classList.remove("syllable-tile--dragging");
    el.style.position = "";
    el.style.left = "";
    el.style.top = "";
    el.style.width = "";
    el.style.zIndex = "";

    if (!slotEl) {
      renderTray();
      return;
    }

    const slotIndex = parseInt(slotEl.dataset.index, 10);
    state.stats.totalAttempts++;
    Progress.addAttempt(Progress.load());

    if (state.slots[slotIndex] === tile.text) {
      state.filled[slotIndex] = true;
      state.tiles = state.tiles.filter((t) => t.id !== tile.id);
      SFX.playCorrect();
      setMascotState("happy");
      feedback.textContent = "";
      feedback.className = "feedback";
      renderSlots();
      renderTray();
      if (state.filled.every(Boolean)) {
        completeWord();
      } else {
        setTimeout(() => setMascotState("idle"), 500);
      }
    } else {
      state.wrongCount++;
      SFX.playIncorrect();
      setMascotState("sad");
      feedback.textContent = "❌ Quase lá! Tenta de novo.";
      feedback.className = "feedback incorrect";
      renderTray();
      setTimeout(() => {
        setMascotState("idle");
        feedback.textContent = "";
        feedback.className = "feedback";
      }, 900);
      if (state.wrongCount >= 3) {
        state.wrongCount = 0;
        showHint();
      }
    }
  }

  function completeWord() {
    state.stats.wordsCompleted++;
    Progress.addWordCompleted(Progress.load());
    feedback.textContent = "🎉 Palavra completa: " + currentWord().word + "!";
    feedback.className = "feedback complete";
    setMascotState("happy");

    setTimeout(() => {
      const level = state.currentLevel;
      state.wordPos++;
      if (state.wordPos >= level.end) {
        finishLevel();
      } else {
        renderWord();
      }
    }, 1400);
  }

  function finishLevel() {
    const level = state.currentLevel;
    Progress.completeLevel(Progress.load(), level.id, LEVELS.length);
    const isLastLevel = level.id >= LEVELS.length;
    SFX.playLevelComplete();

    completeTitle.textContent = isLastLevel
      ? "🎉 Você leu todas as palavras!"
      : "🌟 Ilha concluída!";
    completeStats.textContent =
      "Você completou " +
      state.stats.wordsCompleted +
      " palavras com " +
      state.stats.totalAttempts +
      " tentativas nesta ilha." +
      (isLastLevel ? "" : " Uma nova ilha foi desbloqueada no mapa!");
    completeOverlay.hidden = false;
  }

  continueBtn.addEventListener("click", () => {
    completeOverlay.hidden = true;
    if (window.showHome) window.showHome();
  });

  backToMapBtn.addEventListener("click", () => {
    if (window.showHome) window.showHome();
  });
})();
