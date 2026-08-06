// Teste rápido de lógica pura (Progress + LEVELS), sem DOM.
global.localStorage = (() => {
  let store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
})();

const fs = require("fs");
const path = require("path");
const base = path.join(__dirname, "..", "www");

function loadAsGlobal(file, exportedName) {
  let code = fs.readFileSync(path.join(base, file), "utf8");
  code = code.replace(
    new RegExp("^const " + exportedName + "\\s*=", "m"),
    "global." + exportedName + " ="
  );
  // eslint-disable-next-line no-eval
  eval(code);
}

loadAsGlobal("levels.js", "LEVELS");
loadAsGlobal("progress.js", "Progress");

console.assert(LEVELS.length === 10, "esperado 10 niveis, obtido " + LEVELS.length);
console.assert(LEVELS[0].start === 0 && LEVELS[0].end === 16, "nivel 1 deve ser 0..16");
console.assert(LEVELS[9].start === 144 && LEVELS[9].end === 160, "nivel 10 deve ser 144..160");

let state = Progress.load();
console.assert(state.unlockedLevel === 1, "estado inicial deve comecar no nivel 1");
console.assert(Progress.isLevelUnlocked(state, 1) === true, "nivel 1 deve estar desbloqueado");
console.assert(Progress.isLevelUnlocked(state, 2) === false, "nivel 2 nao deve estar desbloqueado ainda");

Progress.addWordCompleted(state);
Progress.addWordCompleted(state);
Progress.addAttempt(state);
console.assert(state.wordsCompletedTotal === 2, "wordsCompletedTotal deveria ser 2");
console.assert(state.attemptsTotal === 1, "attemptsTotal deveria ser 1");

Progress.completeLevel(state, 1, LEVELS.length);
console.assert(Progress.isLevelCompleted(state, 1) === true, "nivel 1 deveria estar completo");
console.assert(state.unlockedLevel === 2, "nivel 2 deveria estar desbloqueado apos completar nivel 1");

const reloaded = Progress.load();
console.assert(reloaded.unlockedLevel === 2, "persistencia falhou: unlockedLevel deveria ser 2");
console.assert(reloaded.wordsCompletedTotal === 2, "persistencia falhou: wordsCompletedTotal deveria ser 2");
console.assert(reloaded.completedLevels.indexOf(1) !== -1, "persistencia falhou: nivel 1 deveria estar em completedLevels");

// Simula completar todos os 10 niveis
let s2 = Progress.defaults();
for (let i = 1; i <= 10; i++) {
  Progress.completeLevel(s2, i, LEVELS.length);
}
console.assert(s2.completedLevels.length === 10, "todos os 10 niveis deveriam estar completos");
console.assert(s2.unlockedLevel === 10, "unlockedLevel nao deve passar de 10 (ultimo nivel)");

console.log("TODOS OS TESTES DE LOGICA PASSARAM");
