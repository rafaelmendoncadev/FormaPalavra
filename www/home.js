// home.js - tela Home / Mapa da Trilha: renderiza as ilhas (níveis),
// mascote Sabi, barra de progresso e os modais de Jardim / Área dos pais.
(() => {
  const homeScreen = document.getElementById("homeScreen");
  const lessonScreen = document.getElementById("lessonScreen");
  const trailWrap = document.getElementById("trailWrap");
  const homeProgressFill = document.getElementById("homeProgressFill");
  const mascotDock = document.getElementById("mascotDock");

  const parentBtn = document.getElementById("parentBtn");
  const gardenBtn = document.getElementById("gardenBtn");

  const parentGateOverlay = document.getElementById("parentGateOverlay");
  const parentQuestionEl = document.getElementById("parentQuestion");
  const parentOptionsEl = document.getElementById("parentOptions");
  const parentCancelBtn = document.getElementById("parentCancelBtn");

  const parentReportOverlay = document.getElementById("parentReportOverlay");
  const parentReportBody = document.getElementById("parentReportBody");
  const parentReportCloseBtn = document.getElementById("parentReportCloseBtn");

  const gardenOverlay = document.getElementById("gardenOverlay");
  const gardenGrid = document.getElementById("gardenGrid");
  const gardenEmpty = document.getElementById("gardenEmpty");
  const gardenCloseBtn = document.getElementById("gardenCloseBtn");

  let currentAnswer = null;

  function renderTrail() {
    const state = Progress.load();
    // Limpa só os nós da trilha; o mascotDock é removido do DOM junto (ele
    // vive dentro de trailWrap), então precisamos religá-lo depois.
    trailWrap.innerHTML = "";

    LEVELS.forEach((level, idx) => {
      const unlocked = Progress.isLevelUnlocked(state, level.id);
      const completed = Progress.isLevelCompleted(state, level.id);
      const isCurrent = unlocked && !completed && level.id === state.unlockedLevel;

      const btn = document.createElement("button");
      btn.className =
        "trail-node " + (idx % 2 === 0 ? "trail-node--left" : "trail-node--right");
      if (!unlocked) btn.classList.add("trail-node--locked");
      if (isCurrent) btn.classList.add("trail-node--current");
      if (completed) btn.classList.add("trail-node--done");
      btn.dataset.level = String(level.id);

      const stone = '<span class="trail-node-stone" aria-hidden="true"></span>';
      if (!unlocked) {
        btn.innerHTML =
          stone + '<span class="trail-node-lock">' + ICONS.lock + "</span>";
        btn.disabled = true;
        btn.setAttribute("aria-label", "Ilha " + level.id + " bloqueada");
      } else {
        btn.innerHTML =
          stone +
          '<span class="trail-node-num">' +
          level.id +
          "</span>" +
          (completed ? '<span class="trail-node-badge">&#10003;</span>' : "");
        btn.setAttribute(
          "aria-label",
          "Ilha " + level.id + (completed ? " concluída" : " disponível")
        );
        btn.addEventListener("click", () => startLevel(level));
      }
      trailWrap.appendChild(btn);
    });

    // Religa o mascote (innerHTML="" acima o removeu do DOM).
    trailWrap.appendChild(mascotDock);

    const fillPct =
      LEVELS.length > 0
        ? (state.completedLevels.length / LEVELS.length) * 100
        : 0;
    homeProgressFill.style.width = fillPct + "%";

    positionMascot(state);
    scrollToCurrent();
  }

  function findCurrentNodeEl() {
    const current = trailWrap.querySelector(".trail-node--current");
    if (current) return current;
    // Sem "atual" (ex.: todas as ilhas concluídas) -> usa a última
    // desbloqueada, não a primeira, e nunca o mascotDock (que também é
    // filho de trailWrap).
    const unlocked = trailWrap.querySelectorAll(".trail-node:not(.trail-node--locked)");
    return unlocked.length > 0 ? unlocked[unlocked.length - 1] : null;
  }

  function positionMascot(state) {
    const el = findCurrentNodeEl();
    if (!el) return;
    const onLeft = el.classList.contains("trail-node--left");
    mascotDock.style.top = Math.max(0, el.offsetTop - 34) + "px";
    mascotDock.style.left = onLeft
      ? el.offsetLeft + el.offsetWidth + 4 + "px"
      : Math.max(0, el.offsetLeft - 62) + "px";
  }

  function scrollToCurrent() {
    const el = findCurrentNodeEl();
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ block: "center", behavior: "auto" });
    }
  }

  function startLevel(level) {
    if (!window.LessonScreen) return;
    homeScreen.hidden = true;
    lessonScreen.hidden = false;
    window.LessonScreen.open(level);
  }

  function returnHome() {
    lessonScreen.hidden = true;
    homeScreen.hidden = false;
    renderTrail();
  }
  window.showHome = returnHome;

  // ---- Jardim do Sabi ----
  function openGarden() {
    const state = Progress.load();
    const count = state.wordsCompletedTotal;
    gardenGrid.innerHTML = "";
    gardenEmpty.hidden = count > 0;
    const toRender = Math.min(count, 200);
    for (let i = 0; i < toRender; i++) {
      const span = document.createElement("span");
      span.innerHTML = ICONS.flower;
      gardenGrid.appendChild(span.firstChild);
    }
    gardenOverlay.hidden = false;
  }
  gardenBtn.addEventListener("click", openGarden);
  gardenCloseBtn.addEventListener("click", () => {
    gardenOverlay.hidden = true;
  });

  // ---- Área dos pais ----
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function renderParentQuestion() {
    const a = randomInt(2, 9);
    const b = randomInt(2, 9);
    currentAnswer = a + b;
    parentQuestionEl.textContent = a + " + " + b + " = ?";

    const options = new Set([currentAnswer]);
    while (options.size < 3) {
      const delta = randomInt(-3, 3);
      const candidate = currentAnswer + delta;
      if (candidate >= 0 && candidate !== currentAnswer) options.add(candidate);
    }
    const shuffled = Array.from(options).sort(() => Math.random() - 0.5);

    parentOptionsEl.innerHTML = "";
    shuffled.forEach((value) => {
      const b2 = document.createElement("button");
      b2.className = "parent-option-btn";
      b2.textContent = String(value);
      b2.addEventListener("click", () => checkParentAnswer(value));
      parentOptionsEl.appendChild(b2);
    });
  }

  function checkParentAnswer(value) {
    if (value === currentAnswer) {
      parentGateOverlay.hidden = true;
      openParentReport();
    } else {
      parentQuestionEl.classList.add("incorrect-flash");
      setTimeout(() => parentQuestionEl.classList.remove("incorrect-flash"), 500);
      renderParentQuestion();
    }
  }

  function openParentGate() {
    renderParentQuestion();
    parentGateOverlay.hidden = false;
  }
  parentBtn.addEventListener("click", openParentGate);
  parentCancelBtn.addEventListener("click", () => {
    parentGateOverlay.hidden = true;
  });

  function formatScreenTime(ms) {
    const totalMin = Math.round(ms / 60000);
    if (totalMin < 1) return "menos de 1 minuto";
    if (totalMin < 60) return totalMin + " minuto(s)";
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h + "h" + (m > 0 ? " " + m + "min" : "");
  }

  function openParentReport() {
    const state = Progress.load();
    parentReportBody.textContent =
      "Palavras aprendidas: " +
      state.wordsCompletedTotal +
      ". Tentativas: " +
      state.attemptsTotal +
      ". Ilhas concluídas: " +
      state.completedLevels.length +
      " de " +
      LEVELS.length +
      ". Tempo de tela: " +
      formatScreenTime(state.totalScreenMs) +
      ".";
    parentReportOverlay.hidden = false;
  }
  parentReportCloseBtn.addEventListener("click", () => {
    parentReportOverlay.hidden = true;
  });

  // ---- Tempo de tela (heartbeat simples) ----
  const HEARTBEAT_MS = 30000;
  setInterval(() => {
    if (document.visibilityState === "visible") {
      const state = Progress.load();
      Progress.addScreenMs(state, HEARTBEAT_MS);
    }
  }, HEARTBEAT_MS);

  renderTrail();
})();
