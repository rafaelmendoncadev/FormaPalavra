// parents.js - Área dos Pais & Educadores: Dashboard analítico, identificação de dificuldades,
// modo adaptativo de prática e configurações do aplicativo.
const ParentsArea = (() => {
  let currentGateAnswer = null;

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function formatTime(ms) {
    const totalSec = Math.floor((ms || 0) / 1000);
    const totalMin = Math.floor(totalSec / 60);
    if (totalMin < 1) return "Menos de 1 min";
    if (totalMin < 60) return totalMin + " min";
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h + "h " + (m > 0 ? m + "min" : "");
  }

  function openGate() {
    const gateOverlay = document.getElementById("parentGateOverlay");
    const questionEl = document.getElementById("parentGateQuestion");
    const optionsEl = document.getElementById("parentGateOptions");
    if (!gateOverlay || !questionEl || !optionsEl) return;

    const a = randomInt(3, 9);
    const b = randomInt(3, 9);
    currentGateAnswer = a * b;
    questionEl.textContent = `${a} × ${b} = ?`;

    const options = new Set([currentGateAnswer]);
    while (options.size < 3) {
      const delta = randomInt(-5, 5);
      const val = currentGateAnswer + delta;
      if (val > 0 && val !== currentGateAnswer) options.add(val);
    }
    const shuffled = Array.from(options).sort(() => Math.random() - 0.5);

    optionsEl.innerHTML = "";
    shuffled.forEach((ans) => {
      const btn = document.createElement("button");
      btn.className = "btn parent-gate-btn";
      btn.textContent = String(ans);
      btn.addEventListener("click", () => {
        if (ans === currentGateAnswer) {
          gateOverlay.hidden = true;
          openDashboard();
        } else {
          questionEl.classList.add("incorrect-flash");
          setTimeout(() => questionEl.classList.remove("incorrect-flash"), 500);
          openGate();
        }
      });
      optionsEl.appendChild(btn);
    });

    gateOverlay.hidden = false;
  }

  function openDashboard() {
    const overlay = document.getElementById("parentDashboardOverlay");
    if (!overlay) return;

    renderDashboardData();
    overlay.hidden = false;
  }

  function renderDashboardData() {
    const state = Progress.load();
    const totalWords = (typeof WORDS !== "undefined" && WORDS.length) || 160;

    // Métricas principais
    const pct = Math.min(100, Math.round(((state.wordsCompletedTotal || 0) / totalWords) * 100));
    const accuracy =
      state.attemptsTotal > 0
        ? Math.round(((state.correctAttemptsTotal || state.wordsCompletedTotal) / state.attemptsTotal) * 100)
        : 100;

    const elPct = document.getElementById("parentProgPct");
    const elProgBar = document.getElementById("parentProgFill");
    const elWords = document.getElementById("parentWordsLearned");
    const elAccuracy = document.getElementById("parentAccuracy");
    const elTime = document.getElementById("parentStudyTime");
    const elStars = document.getElementById("parentTotalStars");
    const elFlowers = document.getElementById("parentTotalFlowers");

    if (elPct) elPct.textContent = pct + "%";
    if (elProgBar) elProgBar.style.width = pct + "%";
    if (elWords) elWords.textContent = `${state.wordsCompletedTotal || 0} / ${totalWords}`;
    if (elAccuracy) elAccuracy.textContent = `${accuracy}%`;
    if (elTime) elTime.textContent = formatTime(state.totalScreenMs);

    // Contagem de estrelas ganhas
    let starsCount = 0;
    Object.values(state.levelStars || {}).forEach((s) => (starsCount += s));
    if (elStars) elStars.textContent = String(starsCount);
    if (elFlowers) elFlowers.textContent = String(state.flowersTotal || 0);

    // Dificuldades detectadas
    renderDifficulties(state);

    // Configurações de áudio / voz
    const voiceToggle = document.getElementById("parentVoiceToggle");
    const sfxToggle = document.getElementById("parentSfxToggle");
    if (voiceToggle) {
      voiceToggle.checked = state.settings ? state.settings.voice !== false : true;
      voiceToggle.onchange = () => {
        Progress.updateSettings(state, { voice: voiceToggle.checked });
        if (typeof AppAudio !== "undefined") AppAudio.setVoiceEnabled(voiceToggle.checked);
      };
    }
    if (sfxToggle) {
      sfxToggle.checked = state.settings ? state.settings.sfx !== false : true;
      sfxToggle.onchange = () => {
        Progress.updateSettings(state, { sfx: sfxToggle.checked });
        if (typeof AppAudio !== "undefined") AppAudio.setSfxEnabled(sfxToggle.checked);
      };
    }
  }

  function renderDifficulties(state) {
    const container = document.getElementById("parentDifficultiesList");
    const recommendCard = document.getElementById("parentRecommendCard");
    const recommendText = document.getElementById("parentRecommendText");
    const practiceBtn = document.getElementById("parentPracticeBtn");
    if (!container) return;

    const syllableMistakes = state.syllableMistakes || {};
    const sortedSyl = Object.entries(syllableMistakes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const wordMistakes = state.wordMistakes || {};
    const sortedWords = Object.entries(wordMistakes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    if (sortedSyl.length === 0 && sortedWords.length === 0) {
      container.innerHTML = `<p class="parent-empty-msg">🎉 A criança está avançando com excelente desempenho e sem padrões recorrentes de dificuldade!</p>`;
      if (recommendCard) recommendCard.hidden = true;
      return;
    }

    let html = `<div class="diff-tags-wrap">`;
    if (sortedSyl.length > 0) {
      html += `<div class="diff-group"><span class="diff-label">Sílabas que exigiram atenção:</span> <div class="diff-badges">`;
      sortedSyl.forEach(([syl, count]) => {
        html += `<span class="diff-tag">${syl} <em>(${count} ${count > 1 ? "vezes" : "vez"})</em></span>`;
      });
      html += `</div></div>`;
    }

    if (sortedWords.length > 0) {
      html += `<div class="diff-group"><span class="diff-label">Palavras para reforço:</span> <div class="diff-badges">`;
      sortedWords.forEach(([word, count]) => {
        html += `<span class="diff-tag diff-tag--word">${word} <em>(${count}x)</em></span>`;
      });
      html += `</div></div>`;
    }
    html += `</div>`;
    container.innerHTML = html;

    if (recommendCard && recommendText && practiceBtn) {
      recommendCard.hidden = false;
      const topWord = sortedWords[0] ? sortedWords[0][0] : null;
      const topSyl = sortedSyl[0] ? sortedSyl[0][0] : null;
      let recMsg = "Praticar palavras selecionadas para fixar o aprendizado!";
      if (topWord && topSyl) {
        recMsg = `Vamos reforçar a leitura de palavras com <strong>${topSyl}</strong> como <strong>${topWord}</strong>?`;
      } else if (topSyl) {
        recMsg = `Vamos praticar palavras com a sílaba <strong>${topSyl}</strong>?`;
      }
      recommendText.innerHTML = recMsg;

      practiceBtn.onclick = () => {
        const overlay = document.getElementById("parentDashboardOverlay");
        if (overlay) overlay.hidden = true;
        launchAdaptivePractice(sortedWords.map((w) => w[0]));
      };
    }
  }

  function launchAdaptivePractice(targetWordNames) {
    if (typeof WORDS === "undefined" || !window.LessonScreen) return;
    let targetWords = WORDS.filter((w) => targetWordNames.includes(w.word));
    if (targetWords.length === 0) {
      targetWords = WORDS.slice(0, 8);
    }
    // Cria um mini-nível adaptativo de reforço
    const practiceLevel = {
      id: "pratica",
      name: "Treino Personalizado",
      icon: "🎯",
      theme: "Reforço Adaptativo",
      customWords: targetWords,
      start: 0,
      end: targetWords.length,
    };
    const homeScreen = document.getElementById("homeScreen");
    const mapScreen = document.getElementById("mapScreen");
    const lessonScreen = document.getElementById("lessonScreen");
    if (homeScreen) homeScreen.hidden = true;
    if (mapScreen) mapScreen.hidden = true;
    if (lessonScreen) lessonScreen.hidden = false;
    window.LessonScreen.open(practiceLevel);
  }

  function init() {
    const parentGateBtn = document.getElementById("parentBtn");
    const parentGateCancelBtn = document.getElementById("parentGateCancelBtn");
    const parentCloseBtn = document.getElementById("parentCloseBtn");
    const resetProgressBtn = document.getElementById("parentResetProgressBtn");

    if (parentGateBtn) parentGateBtn.addEventListener("click", openGate);
    if (parentGateCancelBtn) {
      parentGateCancelBtn.addEventListener("click", () => {
        const gate = document.getElementById("parentGateOverlay");
        if (gate) gate.hidden = true;
      });
    }
    if (parentCloseBtn) {
      parentCloseBtn.addEventListener("click", () => {
        const overlay = document.getElementById("parentDashboardOverlay");
        if (overlay) overlay.hidden = true;
      });
    }

    if (resetProgressBtn) {
      resetProgressBtn.addEventListener("click", () => {
        if (confirm("Tem certeza de que deseja reiniciar todo o progresso de palavras, estrelas e jardim da criança?")) {
          Progress.resetProgress();
          renderDashboardData();
          if (typeof window.renderHomeTrail === "function") window.renderHomeTrail();
          if (typeof SFX !== "undefined") SFX.playTap();
        }
      });
    }
  }

  return {
    init,
    openGate,
    openDashboard,
    formatTime,
  };
})();
