// speech.js - wrapper para síntese e reconhecimento de voz (pt-BR)
const SpeechModule = (() => {
  const synth = window.speechSynthesis || null;
  let ptVoice = null;

  // Quando rodando dentro do APK (Capacitor), o `window.Capacitor.Plugins`
  // expõe o plugin nativo de reconhecimento de voz. No navegador desktop
  // esse objeto não existe, e a gente cai no fallback do Web Speech API
  // (que não funciona de forma confiável no WebView do Android — fica
  // travado pedindo permissão sem nunca devolver resultado).
  function getNativeRecognizer() {
    if (typeof window === "undefined") return null;
    const cap = window.Capacitor;
    if (!cap || typeof cap.isNativePlatform !== "function" || !cap.isNativePlatform()) {
      return null;
    }
    return cap.Plugins && cap.Plugins.SpeechRecognition ? cap.Plugins.SpeechRecognition : null;
  }

  // Mesmo esquema pro TTS: dentro do APK, o `window.speechSynthesis` do
  // WebView pode existir sem produzir som nenhum (ou ficar preso em
  // "speaking" sem nenhum callback). O plugin nativo usa o
  // `android.speech.tts.TextToSpeech` real, que respeita volume do
  // dispositivo, vozes instaladas, etc.
  function getNativeTts() {
    if (typeof window === "undefined") return null;
    const cap = window.Capacitor;
    if (!cap || typeof cap.isNativePlatform !== "function" || !cap.isNativePlatform()) {
      return null;
    }
    return cap.Plugins && cap.Plugins.TextToSpeech ? cap.Plugins.TextToSpeech : null;
  }

  function pickVoice() {
    if (!synth) return;
    const voices = synth.getVoices();
    ptVoice =
      voices.find((v) => v.lang === "pt-BR") ||
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("pt")) ||
      null;
  }

  if (synth) {
    pickVoice();
    synth.onvoiceschanged = pickVoice;
  }

  function speak(text, { rate = 0.85, onEnd, onError } = {}) {
    const native = getNativeTts();
    if (native) {
      return speakNative({ native, text, rate, onEnd, onError });
    }
    return speakWeb({ text, rate, onEnd, onError });
  }

  function speakNative({ native, text, rate, onEnd, onError }) {
    // `queueStrategy: 0` (Flush) cancela qualquer fala em andamento e
    // começa a nova — comportamento equivalente ao `synth.cancel()` do
    // Web Speech API.
    native
      .speak({
        text: String(text),
        lang: "pt-BR",
        rate: rate,
        pitch: 1.0,
        volume: 1.0,
        queueStrategy: 0,
      })
      .then(() => {
        if (onEnd) onEnd();
      })
      .catch((err) => {
        const msg = (err && (err.message || err.errorMessage)) || "";
        // Se o dispositivo não tem TTS engine (ou pt-BR não tá instalado),
        // caímos pro Web Speech API como último recurso. Se nem ele
        // funcionar, a UI avisa o usuário em vez de ficar mudo.
        if (synth) {
          speakWeb({ text, rate, onEnd, onError });
        } else {
          if (onError) onError(msg || "tts-unavailable");
          if (onEnd) onEnd();
        }
      });
  }

  function speakWeb({ text, rate, onEnd, onError }) {
    if (!synth) {
      if (onError) onError("tts-unsupported");
      if (onEnd) onEnd();
      return;
    }
    try {
      synth.cancel();
    } catch (e) {
      /* ignore */
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-BR";
    if (ptVoice) utter.voice = ptVoice;
    utter.rate = rate;
    utter.onend = () => {
      if (onEnd) onEnd();
    };
    utter.onerror = () => {
      if (onError) onError("tts-failed");
      if (onEnd) onEnd();
    };
    try {
      synth.speak(utter);
    } catch (e) {
      if (onError) onError("tts-failed");
      if (onEnd) onEnd();
    }
  }

  const RecognitionCtor =
    window.SpeechRecognition || window.webkitSpeechRecognition || null;
  let recognizer = null;
  let listening = false;

  function isSupported() {
    return !!RecognitionCtor;
  }

  // Mapa de letras gregas e latim estendido que o reconhecedor do Google
  // às vezes devolve em vez das letras latinas equivalentes (ex.: quando
  // uma sílaba é falada isolada, ele já viu isso devolver "Π" em vez de
  // "PI"). Normalizamos para a letra latina equivalente antes de
  // comparar.
  const ALIAS_CHARS = {
    // Gregas
    "α": "a", "β": "b", "γ": "g", "δ": "d", "ε": "e", "ζ": "z",
    "η": "e", "θ": "t", "ι": "i", "κ": "k", "λ": "l", "μ": "m",
    "ν": "n", "ξ": "x", "ο": "o", "π": "pi", "ρ": "r", "σ": "s",
    "ς": "s", "τ": "t", "υ": "u", "φ": "f", "χ": "chi", "ψ": "ps",
    "ω": "o",
    // Latim estendido
    "đ": "d", "ł": "l", "ø": "o", "æ": "ae", "œ": "oe",
  };
  const ALIAS_RE = new RegExp(
    "[" + Object.keys(ALIAS_CHARS).join("") + "ΠΔΛΘΞΣΨΩ]",
    "gi"
  );

  function normalize(str) {
    const lower = String(str || "").toLowerCase();
    return (
      lower
        // Substitui caracteres gregos/latim estendido pela sua versão
        // latina (ex.: "π" -> "pi") antes de qualquer outra limpeza.
        .replace(ALIAS_RE, (ch) => ALIAS_CHARS[ch] || ch)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z]/g, "")
        .trim()
    );
  }

  // Junta letras repetidas seguidas (ex.: "saa" -> "sa"), útil quando a
  // criança alonga a vogal ou o reconhecedor duplica algum som.
  function collapseRepeats(str) {
    return str.replace(/(.)\1+/g, "$1");
  }

  // Alguns pares de letras soam exatamente igual em português (não é erro
  // de reconhecimento, é o mesmo som mesmo). Convertemos para uma forma
  // canônica antes de comparar, para não penalizar essas grafias.
  function phoneticKey(str) {
    return str
      .replace(/ge/g, "je")
      .replace(/gi/g, "ji")
      .replace(/ce/g, "se")
      .replace(/ci/g, "si");
  }

  // Na fala natural do português brasileiro, vogais átonas costumam "subir"
  // (e soa como i, o soa como u) — principalmente quando a sílaba é falada
  // isolada, fora de uma palavra. Ex.: "TE" soa como "TI", "DO" soa como "DU".
  // Aplicamos essa redução como uma camada extra e mais tolerante de
  // comparação, para não penalizar essa pronúncia naturalíssima.
  function relaxVowels(str) {
    return str.replace(/e/g, "i").replace(/o/g, "u");
  }

  // Quando uma sílaba de 2 letras é falada isolada (clicada na tela sem
  // contexto de palavra), o motor do Google às vezes devolve interjeições
  // como "ham"/"hã" (para RA) ou "léh"/"lê" (para LE), ou ainda adiciona
  // um "h" final aspirado. Aqui mapeamos as variações mais comuns
  // observadas para cada par consoante+vogal, para reduzir falsos
  // negativos sem confundir sílabas vizinhas (cada chave é única).
  const ISOLATED_SOUND = {
    ra: ["ham", "rra", "rra", "rrã", "rrá", "hã", "ha", "ar", "arra"],
    re: ["rre", "rre", "rrê", "er", "hé", "he"],
    ri: ["rri", "rri", "ir"],
    ro: ["rro", "rro", "rrô", "or"],
    ru: ["rru", "rru", "ur"],
    la: ["lah", "la"],
    le: ["leh", "lé"],
    li: ["li"],
    lo: ["loh", "lô"],
    lu: ["lu", "lú"],
    ma: ["mah", "ma"],
    me: ["meh", "mê"],
    mi: ["mi"],
    mo: ["moh", "mô"],
    mu: ["mu"],
    na: ["nah", "na"],
    ne: ["neh", "nê"],
    ni: ["ni"],
    no: ["noh", "nô"],
    nu: ["nu"],
    pa: ["pah", "pa"],
    pe: ["peh", "pê"],
    pi: ["pi", "chi", "pê", "pih"],
    po: ["poh", "pô"],
    pu: ["pu"],
    sa: ["sah", "sa"],
    se: ["seh", "sê"],
    si: ["si"],
    so: ["soh", "sô"],
    su: ["su"],
    ta: ["tah", "ta"],
    te: ["teh", "tê"],
    ti: ["ti"],
    to: ["toh", "tô"],
    tu: ["tu"],
    va: ["vah", "va"],
    ve: ["veh", "vê"],
    vi: ["vi"],
    vo: ["voh", "vô"],
    vu: ["vu"],
    ba: ["bah", "ba"],
    be: ["beh", "bê"],
    bi: ["bi"],
    bo: ["boh", "bô"],
    bu: ["bu"],
    da: ["dah", "da"],
    de: ["deh", "dê", "di"],
    di: ["di"],
    do: ["doh", "dô"],
    du: ["du"],
    fa: ["fah", "fa"],
    fe: ["feh", "fê"],
    fi: ["fi"],
    fo: ["foh", "fô"],
    fu: ["fu"],
    ga: ["gah", "ga"],
    ge: ["geh", "gê"],
    gi: ["gi"],
    go: ["goh", "gô"],
    gu: ["gu"],
    ja: ["jah", "ja"],
    je: ["jeh", "jê"],
    ji: ["ji"],
    jo: ["joh", "jô"],
    ju: ["ju"],
    za: ["zah", "za"],
    ze: ["zeh", "zê"],
    zi: ["zi"],
    zo: ["zoh", "zô"],
    zu: ["zu"],
    ca: ["cah", "ca"],
    ce: ["seh", "sê"],
    ci: ["si"],
    co: ["coh", "cô"],
    cu: ["cu"],
    xe: ["xê", "xeh"],
    xi: ["xi", "chi"],
    xo: ["xoh", "xô"],
    xu: ["xu"],
    cha: ["xah", "xa"],
    che: ["xê"],
    chi: ["xi"],
    cho: ["xô"],
    chu: ["xu"],
  };

  // Distância de edição simples (Levenshtein), usada para tolerar pequenas
  // diferenças de transcrição em sílabas com 3 ou mais letras.
  function levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = new Array(n + 1);
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++) {
      let prevDiag = dp[0];
      dp[0] = i;
      for (let j = 1; j <= n; j++) {
        const temp = dp[j];
        dp[j] =
          a[i - 1] === b[j - 1]
            ? prevDiag
            : 1 + Math.min(prevDiag, dp[j], dp[j - 1]);
        prevDiag = temp;
      }
    }
    return dp[n];
  }

  function matchesSyllable(alternatives, target) {
    const targetNorm = normalize(target);
    if (!targetNorm) return false;
    const targetCollapsed = collapseRepeats(targetNorm);
    const targetPhonetic = phoneticKey(targetNorm);
    const targetRelaxed = relaxVowels(targetPhonetic);

    // Variações específicas observadas para a sílaba alvo, quando ela tem
    // 2 letras. Cada chave do mapa é uma sílaba única, então não há risco
    // de confundir RA com LA ou BE, por exemplo.
    const isolatedVariants = ISOLATED_SOUND[targetNorm] || [];

    for (const alt of alternatives) {
      const altNorm = normalize(alt);
      if (!altNorm) continue;
      const altCollapsed = collapseRepeats(altNorm);
      const altPhonetic = phoneticKey(altNorm);

      // 0. Variantes mapeadas manualmente para sílabas de 2 letras
      //    (ex.: "ham" / "rrã" para "RA"). Verificado tanto na versão
      //    normal quanto colapsada.
      if (isolatedVariants.length > 0) {
        for (const variant of isolatedVariants) {
          const v = normalize(variant);
          if (altNorm === v || altCollapsed === collapseRepeats(v)) {
            return true;
          }
        }
      }

      // 1. Igual, com ou sem letras repetidas, pela forma fonética (ex.:
      //    "gi"/"ji", "ce"/"se" soam igual em português) ou com redução de
      //    vogal átona (ex.: "TE" falado como "TI", "DO" falado como "DU")
      if (
        altNorm === targetNorm ||
        altCollapsed === targetCollapsed ||
        altPhonetic === targetPhonetic ||
        relaxVowels(altPhonetic) === targetRelaxed
      ) {
        return true;
      }

      // 2. A sílaba aparece em qualquer posição do texto reconhecido, com
      //    pouca coisa "sobrando" (o reconhecedor pode captar um som extra
      //    antes ou depois da sílaba), considerando também a versão com
      //    vogal relaxada
      const extra = altNorm.length - targetNorm.length;
      if (extra >= 0 && extra <= 4 && altNorm.includes(targetNorm)) {
        return true;
      }
      const extraCollapsed = altCollapsed.length - targetCollapsed.length;
      if (
        extraCollapsed >= 0 &&
        extraCollapsed <= 4 &&
        altCollapsed.includes(targetCollapsed)
      ) {
        return true;
      }
      const altRelaxed = relaxVowels(altPhonetic);
      const extraRelaxed = altRelaxed.length - targetRelaxed.length;
      if (
        extraRelaxed >= 0 &&
        extraRelaxed <= 4 &&
        altRelaxed.includes(targetRelaxed)
      ) {
        return true;
      }

      // 3. Mesma(s) consoante(s) inicial(is) e mesmo tamanho, variando só a
      //    vogal final — cobre trocas naturais entre vogais átonas. As
      //    trocas que acontecem de verdade na fala do pt-BR são:
      //      a↔o (criança fala "á" rápido, vira "ô"), e↔i (TE→TI),
      //      o↔u (DO→DU). NÃO cobrimos a↔i nem a↔u porque "a" tem som
      //    bem distinto das outras (aceitar trocar VA por VI seria um
      //    falso positivo perigoso).
      if (
        targetNorm.length <= 3 &&
        altNorm.length === targetNorm.length &&
        altNorm.slice(0, -1) === targetNorm.slice(0, -1)
      ) {
        const vogalOriginal = targetNorm.slice(-1);
        const vogalAlt = altNorm.slice(-1);
        if (vogalOriginal === vogalAlt) {
          return true;
        }
        // Aceitamos trocas a↔o (criança fala "á" rápido e o Google
        // ouve "ô", e vice-versa). O reconhecedor trata esses dois
        // sons como próximos quando vêm isolados e sem contexto de
        // palavra. Não aceitamos trocar a vogal "a" por "i" nem "u",
        // nem "e" por "a" ou "o" — porque essas trocas mudam
        // significativamente a identidade da sílaba.
        if (
          (vogalOriginal === "a" && vogalAlt === "o") ||
          (vogalOriginal === "o" && vogalAlt === "a") ||
          (vogalOriginal === "e" && vogalAlt === "i") ||
          (vogalOriginal === "i" && vogalAlt === "e") ||
          (vogalOriginal === "o" && vogalAlt === "u") ||
          (vogalOriginal === "u" && vogalAlt === "o")
        ) {
          return true;
        }
      }

      // 4. Pequena tolerância a diferenças de transcrição.
      //    Para sílabas de 2 letras a vogal tem peso enorme na identidade
      //    do som (qualquer troca de vogal = sílaba diferente), e o tier 3
      //    acima já cobre as trocas de vogal realmente válidas (a↔o,
      //    e↔i, o↔u). Por isso tier 4 fica desativado para 2 letras.
      //    Para sílabas de 3+ letras mantemos Levenshtein com distância
      //    pequena, que cobre casos como "PÃO"→"PAU" ou "GATO"→"GATU".
      if (targetNorm.length >= 3) {
        const maxDistance = targetNorm.length <= 3 ? 1 : 2;
        if (
          levenshtein(altNorm, targetNorm) <= maxDistance ||
          levenshtein(altRelaxed, targetRelaxed) <= maxDistance
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function listenOnce({ onStart, onResult, onError, onEnd, timeoutMs }) {
    // Dentro do APK do Android, o Web Speech API fica travado sem nunca
    // devolver resultado. Usamos o plugin nativo do Capacitor, que
    // implementa o `SpeechRecognizer` do Android de verdade.
    const native = getNativeRecognizer();
    if (native) {
      // O popup nativo "Fale agora" leva ~1-2s pra abrir, e a criança
      // pode demorar pra ler a sílaba e falar. 30s cobre isso com folga
      // sem deixar a tela presa pra sempre se algo der errado.
      return listenOnceNative({ native, onStart, onResult, onError, onEnd, timeoutMs: timeoutMs || 30000 });
    }
    return listenOnceWeb({ onStart, onResult, onError, onEnd, timeoutMs: timeoutMs || 6000 });
  }

  function listenOnceNative({ native, onStart, onResult, onError, onEnd, timeoutMs }) {
    if (listening) return;
    let settled = false;
    let stopTimer = null;

    // Hard-stop de segurança caso o plugin não chame nenhum callback
    // (improvável, mas protege contra a "travada" original).
    const safetyTimer = setTimeout(() => {
      if (!settled) {
        settled = true;
        listening = false;
        try {
          native.stop();
        } catch (e) {
          /* ignore */
        }
        if (onError) onError("timeout");
      }
    }, timeoutMs + 2000);

    // Garante permissão antes de iniciar; sem isso, o `start()` rejeita
    // com "Missing permission" e a UI fica travada pra sempre.
    const perms = native.checkPermissions
      ? native.checkPermissions().catch(() => ({ speechRecognition: "denied" }))
      : Promise.resolve({ speechRecognition: "granted" });

    perms
      .then((status) => {
        if (status && status.speechRecognition && status.speechRecognition !== "granted") {
          return native.requestPermissions
            ? native.requestPermissions()
            : Promise.resolve(status);
        }
        return status;
      })
      .then(() => {
        listening = true;
        if (onStart) onStart();

        // `popup: true` mostra o diálogo nativo "Fale agora" do Android,
        // dando feedback visual pra criança. `partialResults: false`
        // porque (a) no Android parcial não funciona com popup ligado e
        // (b) o `matchesSyllable` daqui já lida bem com o resultado final.
        return native.start({
          language: "pt-BR",
          maxResults: 5,
          popup: true,
          partialResults: false,
        });
      })
      .then((result) => {
        if (settled) return;
        settled = true;
        listening = false;
        clearTimeout(safetyTimer);
        if (stopTimer) clearTimeout(stopTimer);
        const matches = (result && result.matches) || [];
        if (matches.length === 0) {
          if (onError) onError("no-speech");
        } else if (onResult) {
          onResult(matches);
        }
        if (onEnd) onEnd();
      })
      .catch((err) => {
        if (settled) return;
        settled = true;
        listening = false;
        clearTimeout(safetyTimer);
        if (stopTimer) clearTimeout(stopTimer);
        if (onError) {
          const msg = (err && (err.message || err.errorMessage)) || "";
          if (/permission/i.test(msg)) {
            onError("not-allowed");
          } else if (/no.match|no.speech|timeout/i.test(msg)) {
            onError("no-speech");
          } else if (/network/i.test(msg)) {
            onError("network");
          } else {
            onError(msg || "start-failed");
          }
        }
        if (onEnd) onEnd();
      });
  }

  function listenOnceWeb({ onStart, onResult, onError, onEnd, timeoutMs }) {
    if (!RecognitionCtor) {
      if (onError) onError("unsupported");
      return;
    }
    if (listening) return;

    recognizer = new RecognitionCtor();
    recognizer.lang = "pt-BR";
    recognizer.continuous = false;
    // Capturamos também os resultados intermediários: o motor de
    // reconhecimento às vezes "corrige" a transcrição final para a palavra
    // real mais próxima do dicionário, perdendo o som mais bruto/fonético
    // que aparecia no resultado intermediário. Guardar todas as variações
    // vistas ao longo do reconhecimento aumenta a chance de bater com a
    // sílaba falada.
    recognizer.interimResults = true;
    recognizer.maxAlternatives = 15;

    let settled = false;
    const seenAlternatives = [];
    const timer = setTimeout(() => {
      if (!settled) {
        try {
          recognizer.stop();
        } catch (e) {
          /* ignore */
        }
      }
    }, timeoutMs);

    recognizer.onstart = () => {
      listening = true;
      if (onStart) onStart();
    };

    recognizer.onresult = (event) => {
      const result = event.results && event.results[0];
      if (result) {
        for (let i = 0; i < result.length; i++) {
          seenAlternatives.push(result[i].transcript);
        }
      }
      if (result && result.isFinal) {
        settled = true;
        clearTimeout(timer);
        if (onResult) onResult(seenAlternatives.slice());
      }
    };

    recognizer.onerror = (event) => {
      settled = true;
      clearTimeout(timer);
      if (onError) onError(event.error);
    };

    recognizer.onend = () => {
      listening = false;
      clearTimeout(timer);
      if (onEnd) onEnd();
    };

    try {
      recognizer.start();
    } catch (e) {
      clearTimeout(timer);
      if (onError) onError("start-failed");
    }
  }

  function stopListening() {
    const native = getNativeRecognizer();
    if (native && listening) {
      try {
        native.stop();
      } catch (e) {
        /* ignore */
      }
      listening = false;
      return;
    }
    if (recognizer && listening) {
      try {
        recognizer.stop();
      } catch (e) {
        /* ignore */
      }
    }
  }

  return {
    speak,
    listenOnce,
    stopListening,
    isSupported,
    normalize,
    matchesSyllable,
  };
})();
