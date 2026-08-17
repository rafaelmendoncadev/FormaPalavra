// achievements.js - Catálogo de Conquistas (Badges), checagem e modal do Álbum de Medalhas.
const Achievements = (() => {
  const BADGES = [
    {
      id: "first_word",
      title: "Primeira Palavra",
      desc: "Montou a primeira palavra com sucesso!",
      icon: "🦉",
      check: (state) => state.wordsCompletedTotal >= 1,
    },
    {
      id: "first_flower",
      title: "Primeira Flor",
      desc: "Plantou a 1ª flor no Jardim do Sabi!",
      icon: "🌱",
      check: (state) => state.flowersTotal >= 1,
    },
    {
      id: "five_words",
      title: "Pequeno Leitor",
      desc: "Completou 5 palavras na sua jornada.",
      icon: "⭐",
      check: (state) => state.wordsCompletedTotal >= 5,
    },
    {
      id: "first_island",
      title: "Explorador da Ilha",
      desc: "Concluiu todas as palavras da primeira Ilha!",
      icon: "🏝️",
      check: (state) => state.completedLevels.length >= 1,
    },
    {
      id: "gardener_10",
      title: "Jardineiro Feliz",
      desc: "Cultivou 10 flores no Jardim do Sabi!",
      icon: "🌸",
      check: (state) => state.flowersTotal >= 10,
    },
    {
      id: "words_25",
      title: "Leitor Curioso",
      desc: "Descobriu 25 palavras na aventura.",
      icon: "📚",
      check: (state) => state.wordsCompletedTotal >= 25,
    },
    {
      id: "three_stars",
      title: "Estrela Brilhante",
      desc: "Conseguiu 3 estrelas perfeitas em uma ilha!",
      icon: "✨",
      check: (state) => Object.values(state.levelStars || {}).some((s) => s === 3),
    },
    {
      id: "words_50",
      title: "Super Leitor",
      desc: "Completou 50 palavras no Coruja Letrada!",
      icon: "🚀",
      check: (state) => state.wordsCompletedTotal >= 50,
    },
    {
      id: "gardener_50",
      title: "Mestre da Primavera",
      desc: "Cultivou 50 flores perfumadas no Jardim.",
      icon: "🌺",
      check: (state) => state.flowersTotal >= 50,
    },
    {
      id: "islands_5",
      title: "Grande Explorador",
      desc: "Completou 5 Ilhas Temáticas inteiras!",
      icon: "🗺️",
      check: (state) => state.completedLevels.length >= 5,
    },
    {
      id: "words_100",
      title: "Mestre das Sílabas",
      desc: "Chegou à marca impressionante de 100 palavras!",
      icon: "🎓",
      check: (state) => state.wordsCompletedTotal >= 100,
    },
    {
      id: "grand_master",
      title: "Rei das Palavras",
      desc: "Concluiu todas as 160 palavras do Coruja Letrada!",
      icon: "👑",
      check: (state) => state.wordsCompletedTotal >= 160,
    },
  ];

  function evaluateAll(state, onNewUnlock) {
    let unlockedAny = false;
    BADGES.forEach((badge) => {
      if (badge.check(state)) {
        const isNew = Progress.unlockAchievement(state, badge.id);
        if (isNew) {
          unlockedAny = true;
          if (onNewUnlock) onNewUnlock(badge);
          showUnlockToast(badge);
        }
      }
    });
    return unlockedAny;
  }

  function showUnlockToast(badge) {
    const toast = document.getElementById("badgeToast");
    const toastIcon = document.getElementById("badgeToastIcon");
    const toastTitle = document.getElementById("badgeToastTitle");
    const toastDesc = document.getElementById("badgeToastDesc");
    if (!toast) return;

    if (toastIcon) toastIcon.textContent = badge.icon;
    if (toastTitle) toastTitle.textContent = badge.title;
    if (toastDesc) toastDesc.textContent = badge.desc;

    if (typeof SFX !== "undefined") SFX.playBadgeUnlock();
    if (typeof SabiGuide !== "undefined") {
      SabiGuide.showSpeech("gameSabiSpeech", "🎉 " + SabiGuide.randomPhrase("badgeUnlocked"), 3000, true);
    }

    toast.classList.remove("hidden");
    toast.classList.add("visible");
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.classList.add("hidden"), 350);
    }, 4000);
  }

  function renderModal() {
    const grid = document.getElementById("achievementsGrid");
    const counterEl = document.getElementById("achievementsCounter");
    if (!grid) return;

    const state = Progress.load();
    const unlockedIds = new Set(state.unlockedAchievements || []);
    grid.innerHTML = "";

    if (counterEl) {
      counterEl.textContent = unlockedIds.size + " de " + BADGES.length + " desbloqueadas";
    }

    BADGES.forEach((badge) => {
      const isUnlocked = unlockedIds.has(badge.id);
      const card = document.createElement("div");
      card.className = "badge-card" + (isUnlocked ? " badge-card--unlocked" : " badge-card--locked");

      card.innerHTML = `
        <div class="badge-icon-wrap">
          <span class="badge-icon">${badge.icon}</span>
          ${!isUnlocked ? '<span class="badge-lock">🔒</span>' : '<span class="badge-check">✓</span>'}
        </div>
        <div class="badge-info">
          <h4 class="badge-title">${badge.title}</h4>
          <p class="badge-desc">${badge.desc}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  return {
    BADGES,
    evaluateAll,
    showUnlockToast,
    renderModal,
  };
})();
