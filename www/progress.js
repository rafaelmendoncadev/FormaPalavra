// progress.js - persistência simples do progresso da criança (trilha,
// palavras completas, tentativas e tempo de tela), usada pela tela Home
// (mapa da trilha), pela lição de sílabas e pela área dos pais.
const Progress = (() => {
  const KEY = "corujaLetradaProgressV1";

  function defaults() {
    return {
      unlockedLevel: 1, // maior nível (1-based) já desbloqueado
      completedLevels: [], // ids de níveis totalmente concluídos
      wordsCompletedTotal: 0,
      attemptsTotal: 0,
      totalScreenMs: 0,
      firstSeenAt: Date.now(),
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
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
      /* localStorage indisponível (modo privado etc.) - segue sem salvar */
    }
  }

  function isLevelUnlocked(state, levelId) {
    return levelId <= state.unlockedLevel;
  }

  function isLevelCompleted(state, levelId) {
    return state.completedLevels.indexOf(levelId) !== -1;
  }

  function completeLevel(state, levelId, totalLevels) {
    if (!isLevelCompleted(state, levelId)) {
      state.completedLevels.push(levelId);
    }
    if (levelId >= state.unlockedLevel && levelId < totalLevels) {
      state.unlockedLevel = levelId + 1;
    }
    save(state);
    return state;
  }

  function addWordCompleted(state) {
    state.wordsCompletedTotal++;
    save(state);
    return state;
  }

  function addAttempt(state) {
    state.attemptsTotal++;
    save(state);
    return state;
  }

  function addScreenMs(state, ms) {
    state.totalScreenMs += ms;
    save(state);
    return state;
  }

  return {
    load,
    save,
    defaults,
    isLevelUnlocked,
    isLevelCompleted,
    completeLevel,
    addWordCompleted,
    addAttempt,
    addScreenMs,
  };
})();
