// home.js - Gerenciador da Tela Inicial (Hub da Criança), Mapa da Trilha e Navegação Geral.
(() => {
  const homeScreen = document.getElementById("homeScreen");
  const mapScreen = document.getElementById("mapScreen");
  const lessonScreen = document.getElementById("lessonScreen");

  const trailWrap = document.getElementById("trailWrap");
  const mascotDock = document.getElementById("mascotDock");
  const mapProgressFill = document.getElementById("mapProgressFill");
  const mapProgressSubtitle = document.getElementById("mapProgressSubtitle");

  // Botões do Hub da Criança
  const homeContinueBtn = document.getElementById("homeContinueBtn");
  const homeContinueSub = document.getElementById("homeContinueSub");
  const homeAdventureBtn = document.getElementById("homeAdventureBtn");
  const homeGardenBtn = document.getElementById("homeGardenBtn");
  const homeGardenQuickBtn = document.getElementById("homeGardenQuickBtn");
  const homeBadgesBtn = document.getElementById("homeBadgesBtn");
  const mapBackToHomeBtn = document.getElementById("mapBackToHomeBtn");
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const soundToggleIcon = document.getElementById("soundToggleIcon");

  // Estatísticas no Hub
  const hubFlowerCount = document.getElementById("hubFlowerCount");
  const hubStarCount = document.getElementById("hubStarCount");
  const hubSabiSpeech = document.getElementById("hubSabiSpeech");

  // Modais de Jardim e Conquistas
  const gardenOverlay = document.getElementById("gardenOverlay");
  const gardenCloseBtn = document.getElementById("gardenCloseBtn");
  const achievementsOverlay = document.getElementById("achievementsOverlay");
  const achievementsCloseBtn = document.getElementById("achievementsCloseBtn");

  function updateHub() {
    const state = Progress.load();

    // Atualiza contadores do topo
    if (hubFlowerCount) hubFlowerCount.textContent = String(state.flowersTotal || 0);

    let totalStars = 0;
    Object.values(state.levelStars || {}).forEach((s) => (totalStars += s));
    if (hubStarCount) hubStarCount.textContent = String(totalStars);

    // Texto do botão Continuar
    const currentLevelId = Math.min(state.unlockedLevel || 1, LEVELS.length);
    const levelObj = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];
    const lastWordIndex = state.lastPlayedWordIndex || levelObj.start;
    const wordLocalIndex = Math.min(Math.max(1, lastWordIndex - levelObj.start + 1), levelObj.end - levelObj.start);

    if (homeContinueSub) {
      homeContinueSub.textContent = `Ilha ${levelObj.id} (${levelObj.name}) • Palavra ${wordLocalIndex}`;
    }

    // Frase da Sabi
    if (hubSabiSpeech && typeof SabiGuide !== "undefined") {
      hubSabiSpeech.textContent = SabiGuide.randomPhrase("welcome");
    }

    // Estado do botão de áudio
    updateSoundIcon();
  }

  function updateSoundIcon() {
    const state = Progress.load();
    const isMuted = state.settings && (state.settings.voice === false && state.settings.sfx === false);
    if (soundToggleIcon) {
      soundToggleIcon.textContent = isMuted ? "🔇" : "🔊";
    }
  }

  function toggleAudio() {
    const state = Progress.load();
    const currentlyMuted = state.settings && (state.settings.voice === false && state.settings.sfx === false);
    const newState = !currentlyMuted; // true = unmuted, false = muted

    Progress.updateSettings(state, {
      voice: !newState ? false : true,
      sfx: !newState ? false : true,
    });

    if (typeof AppAudio !== "undefined") {
      AppAudio.setVoiceEnabled(!newState ? false : true);
      AppAudio.setSfxEnabled(!newState ? false : true);
    }

    if (newState && typeof SFX !== "undefined") {
      SFX.playTap();
    }

    updateSoundIcon();
  }
  if (soundToggleBtn) soundToggleBtn.addEventListener("click", toggleAudio);

  // Renderização do Mapa de Ilhas Temáticas
  function renderTrail() {
    const state = Progress.load();
    trailWrap.innerHTML = "";

    LEVELS.forEach((level) => {
      const unlocked = Progress.isLevelUnlocked(state, level.id);
      const completed = Progress.isLevelCompleted(state, level.id);
      const isCurrent = unlocked && !completed && level.id === state.unlockedLevel;
      const stars = state.levelStars ? state.levelStars[level.id] || 0 : 0;

      const card = document.createElement("div");
      card.className = "island-card-node";
      if (!unlocked) card.classList.add("island-card-node--locked");
      if (isCurrent) card.classList.add("island-card-node--current");
      if (completed) card.classList.add("island-card-node--done");

      card.dataset.level = String(level.id);

      let starsHtml = "";
      if (completed) {
        starsHtml = "⭐".repeat(Math.max(1, stars));
      }

      let statusPillHtml = "";
      if (!unlocked) {
        statusPillHtml = '<span class="island-status-pill island-status-pill--locked">🔒 Bloqueada</span>';
      } else if (completed) {
        statusPillHtml = '<span class="island-status-pill island-status-pill--done">✓ Concluída</span>';
      } else {
        statusPillHtml = '<span class="island-status-pill island-status-pill--current">▶ Jogar Agora</span>';
      }

      card.innerHTML = `
        <div class="island-icon-badge" style="background-color: ${level.color}20; color: ${level.color}">
          <span>${level.icon}</span>
        </div>
        <div class="island-info">
          <span class="island-num-tag">Ilha ${level.id}</span>
          <h3 class="island-name">${level.name}</h3>
          <span class="island-theme">${level.theme}</span>
        </div>
        <div class="island-status-badge">
          ${starsHtml ? `<span class="island-stars">${starsHtml}</span>` : ""}
          ${statusPillHtml}
        </div>
      `;

      if (unlocked) {
        card.addEventListener("click", () => {
          if (typeof SFX !== "undefined") SFX.playTap();
          startLevel(level);
        });
      }

      trailWrap.appendChild(card);
    });

    // Reposiciona o mascote Sabi na ilha atual
    trailWrap.appendChild(mascotDock);
    positionMascot(state);

    // Progresso do mapa
    const completedCount = state.completedLevels.length;
    if (mapProgressSubtitle) {
      mapProgressSubtitle.textContent = `${completedCount} de ${LEVELS.length} Ilhas Concluídas`;
    }
    const fillPct = (completedCount / LEVELS.length) * 100;
    if (mapProgressFill) mapProgressFill.style.width = fillPct + "%";
  }
  window.renderHomeTrail = renderTrail;

  function positionMascot(state) {
    const currentEl = trailWrap.querySelector(".island-card-node--current") || trailWrap.querySelector(".island-card-node:not(.island-card-node--locked)");
    if (!currentEl) return;
    mascotDock.style.top = Math.max(0, currentEl.offsetTop + 10) + "px";
    mascotDock.style.right = "10px";
    mascotDock.style.left = "auto";
  }

  function startLevel(level, startWordPos) {
    if (!window.LessonScreen) return;
    homeScreen.hidden = true;
    mapScreen.hidden = true;
    lessonScreen.hidden = false;
    window.LessonScreen.open(level, startWordPos);
  }

  function continueAdventure() {
    const state = Progress.load();
    const currentLevelId = Math.min(state.unlockedLevel || 1, LEVELS.length);
    const levelObj = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];
    let startWord = state.lastPlayedWordIndex || levelObj.start;
    if (startWord < levelObj.start || startWord >= levelObj.end) {
      startWord = levelObj.start;
    }
    if (typeof SFX !== "undefined") SFX.playTap();
    startLevel(levelObj, startWord);
  }

  // Navegação
  if (homeContinueBtn) homeContinueBtn.addEventListener("click", continueAdventure);

  if (homeAdventureBtn) {
    homeAdventureBtn.addEventListener("click", () => {
      if (typeof SFX !== "undefined") SFX.playTap();
      homeScreen.hidden = true;
      mapScreen.hidden = false;
      renderTrail();
    });
  }

  if (mapBackToHomeBtn) {
    mapBackToHomeBtn.addEventListener("click", () => {
      if (typeof SFX !== "undefined") SFX.playTap();
      mapScreen.hidden = true;
      homeScreen.hidden = false;
      updateHub();
    });
  }

  function openGardenModal() {
    if (typeof SFX !== "undefined") SFX.playTap();
    Garden.renderGarden();
    gardenOverlay.hidden = false;
  }
  if (homeGardenBtn) homeGardenBtn.addEventListener("click", openGardenModal);
  if (homeGardenQuickBtn) homeGardenQuickBtn.addEventListener("click", openGardenModal);
  if (gardenCloseBtn) gardenCloseBtn.addEventListener("click", () => (gardenOverlay.hidden = true));

  function openBadgesModal() {
    if (typeof SFX !== "undefined") SFX.playTap();
    Achievements.renderModal();
    achievementsOverlay.hidden = false;
  }
  if (homeBadgesBtn) homeBadgesBtn.addEventListener("click", openBadgesModal);
  if (achievementsCloseBtn) achievementsCloseBtn.addEventListener("click", () => (achievementsOverlay.hidden = true));

  function returnHome() {
    lessonScreen.hidden = true;
    mapScreen.hidden = true;
    homeScreen.hidden = false;
    updateHub();
  }
  window.showHome = returnHome;

  function returnToMap() {
    lessonScreen.hidden = true;
    homeScreen.hidden = true;
    mapScreen.hidden = false;
    renderTrail();
  }
  window.showMap = returnToMap;

  // Heartbeat do tempo de tela da criança
  const HEARTBEAT_MS = 30000;
  setInterval(() => {
    if (document.visibilityState === "visible") {
      const state = Progress.load();
      Progress.addScreenMs(state, HEARTBEAT_MS);
    }
  }, HEARTBEAT_MS);

  // Inicialização
  ParentsArea.init();
  updateHub();
})();
