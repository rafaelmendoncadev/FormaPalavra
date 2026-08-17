// progress.js - Persistência completa do progresso infantil, gamificação e analytics.
// Mantém 100% de compatibilidade retroativa com versões anteriores.
const Progress = (() => {
  const KEY = "corujaLetradaProgressV2";
  const OLD_KEY = "corujaLetradaProgressV1";

  function defaults() {
    return {
      unlockedLevel: 1, // maior nível desbloqueado (1 a 10)
      completedLevels: [], // IDs de ilhas finalizadas
      levelStars: {}, // { "1": 3, "2": 2 }
      wordStars: {}, // { "0": 3, "1": 2 } por índice de palavra
      wordsCompletedTotal: 0,
      attemptsTotal: 0,
      correctAttemptsTotal: 0,
      flowersTotal: 0, // flores no jardim
      unlockedAchievements: [], // ["first_word", "first_flower", ...]
      wordMistakes: {}, // { "CORUJA": 2, "XÍCARA": 1 }
      syllableMistakes: {}, // { "XÍ": 3, "BRA": 2 }
      totalScreenMs: 0,
      firstSeenAt: Date.now(),
      lastPlayedWordIndex: 0,
      settings: {
        voice: true,
        sfx: true,
      },
    };
  }

  function load() {
    try {
      let raw = localStorage.getItem(KEY);
      if (!raw) {
        // Tenta migrar do V1 se existir
        const oldRaw = localStorage.getItem(OLD_KEY);
        if (oldRaw) {
          const oldData = JSON.parse(oldRaw);
          const migrated = Object.assign(defaults(), oldData, {
            flowersTotal: oldData.wordsCompletedTotal || 0,
          });
          save(migrated);
          return migrated;
        }
        return defaults();
      }
      const parsed = JSON.parse(raw);
      return Object.assign(defaults(), parsed);
    } catch (e) {
      return defaults();
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* localStorage indisponível ou quota */
    }
  }

  function isLevelUnlocked(state, levelId) {
    return levelId <= state.unlockedLevel;
  }

  function isLevelCompleted(state, levelId) {
    return state.completedLevels.indexOf(levelId) !== -1;
  }

  function completeLevel(state, levelId, stars = 3, totalLevels = 10) {
    if (!isLevelCompleted(state, levelId)) {
      state.completedLevels.push(levelId);
    }
    // Salva a melhor pontuação de estrelas
    const prevStars = state.levelStars[levelId] || 0;
    if (stars > prevStars) {
      state.levelStars[levelId] = stars;
    }
    if (levelId >= state.unlockedLevel && levelId < totalLevels) {
      state.unlockedLevel = levelId + 1;
    }
    save(state);
    return state;
  }

  function recordWordResult(state, wordData, wordIndex, wrongAttempts) {
    state.wordsCompletedTotal++;
    state.flowersTotal++;
    state.lastPlayedWordIndex = wordIndex;

    // Cálculo das estrelas da palavra
    let stars = 3;
    if (wrongAttempts >= 3) stars = 1;
    else if (wrongAttempts > 0) stars = 2;

    const prevWordStars = state.wordStars[wordIndex] || 0;
    if (stars > prevWordStars) {
      state.wordStars[wordIndex] = stars;
    }

    save(state);
    return { state, stars };
  }

  function recordAttempt(state, isCorrect, targetWord, wrongSyllable) {
    state.attemptsTotal++;
    if (isCorrect) {
      state.correctAttemptsTotal++;
    } else {
      if (targetWord) {
        state.wordMistakes[targetWord] = (state.wordMistakes[targetWord] || 0) + 1;
      }
      if (wrongSyllable) {
        state.syllableMistakes[wrongSyllable] = (state.syllableMistakes[wrongSyllable] || 0) + 1;
      }
    }
    save(state);
    return state;
  }

  function unlockAchievement(state, achievementId) {
    if (state.unlockedAchievements.indexOf(achievementId) === -1) {
      state.unlockedAchievements.push(achievementId);
      save(state);
      return true; // novo desbloqueio
    }
    return false;
  }

  function addScreenMs(state, ms) {
    state.totalScreenMs += ms;
    save(state);
    return state;
  }

  function updateSettings(state, newSettings) {
    state.settings = Object.assign(state.settings || {}, newSettings);
    save(state);
    return state;
  }

  function resetProgress() {
    const d = defaults();
    save(d);
    return d;
  }

  return {
    load,
    save,
    defaults,
    isLevelUnlocked,
    isLevelCompleted,
    completeLevel,
    recordWordResult,
    recordAttempt,
    unlockAchievement,
    addScreenMs,
    updateSettings,
    resetProgress,
  };
})();
