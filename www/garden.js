// garden.js - Jardim Interativo do Sabi com flores, sementes, árvores e animações de crescimento.
const Garden = (() => {
  const FLOWER_VARIETIES = [
    { icon: "🌱", label: "Brotinho" },
    { icon: "🌼", label: "Margarida" },
    { icon: "🌷", label: "Tulipa" },
    { icon: "🌸", label: "Flor de Cerejeira" },
    { icon: "🌻", label: "Girassol" },
    { icon: "🌺", label: "Hibisco" },
    { icon: "🌹", label: "Rosa Mágica" },
    { icon: "🦋", label: "Borboleta Dourada" },
    { icon: "🐞", label: "Joaninha Amiga" },
    { icon: "🌳", label: "Árvore Encantada" },
    { icon: "⛲", label: "Fonte do Saber" },
    { icon: "🌈", label: "Arco-Íris" },
  ];

  function getFloraForCount(index) {
    if (index === 0) return FLOWER_VARIETIES[0];
    if (index % 25 === 0) return FLOWER_VARIETIES[10]; // Fonte
    if (index % 15 === 0) return FLOWER_VARIETIES[9]; // Árvore
    if (index % 8 === 0) return FLOWER_VARIETIES[7]; // Borboleta
    if (index % 6 === 0) return FLOWER_VARIETIES[8]; // Joaninha
    return FLOWER_VARIETIES[1 + (index % 6)];
  }

  function renderGarden() {
    const grid = document.getElementById("gardenGrid");
    const countEl = document.getElementById("gardenCount");
    const gardenEmpty = document.getElementById("gardenEmpty");
    const gardenSabiQuote = document.getElementById("gardenSabiQuote");
    if (!grid) return;

    const state = Progress.load();
    const count = state.flowersTotal || 0;

    if (countEl) {
      countEl.textContent = count + " flores plantadas";
    }

    if (gardenSabiQuote) {
      if (count === 0) {
        gardenSabiQuote.textContent = "Complete palavras para ver as primeiras sementinhas brotarem!";
      } else if (count < 10) {
        gardenSabiQuote.textContent = "Olha só! Nossas primeiras plantinhas estão nascendo!";
      } else if (count < 50) {
        gardenSabiQuote.textContent = "Uau! Nosso jardim está ficando cheio de vida e cores!";
      } else {
        gardenSabiQuote.textContent = "Que paraíso florido! Você é o melhor jardineiro de palavras!";
      }
    }

    grid.innerHTML = "";
    if (gardenEmpty) {
      gardenEmpty.hidden = count > 0;
    }

    const itemsToRender = Math.min(count, 160);
    for (let i = 0; i < itemsToRender; i++) {
      const item = getFloraForCount(i);
      const btn = document.createElement("button");
      btn.className = "garden-item-btn";
      btn.setAttribute("aria-label", item.label);
      btn.innerHTML = `<span class="garden-item-icon">${item.icon}</span>`;

      // Interatividade lúdica: tocar na flor faz cócegas/animação com sonzinho
      btn.addEventListener("click", () => {
        btn.classList.remove("flower-bounce");
        void btn.offsetWidth; // trigger reflow
        btn.classList.add("flower-bounce");
        if (typeof SFX !== "undefined") SFX.playTap();
      });

      grid.appendChild(btn);
    }
  }

  return {
    renderGarden,
    FLOWER_VARIETIES,
  };
})();
