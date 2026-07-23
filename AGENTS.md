# AGENTS.md

Compact guide for working in this repo. Full product docs live in `README.md`.

## What this is

A vanilla HTML/CSS/JS kids' app ("Jogo das Sílabas") wrapped with Capacitor for Android/iOS. The web assets in `www/` are the source of truth; `android/` and `ios/` are generated/native shells produced by `npx cap`.

## Layout

- `www/` — actual app source (no build step)
  - `index.html`, `style.css`, `app.js` (game state/flow), `speech.js` (TTS + STT wrapper), `words.js` (160 words with syllable splits)
- `android/`, `ios/` — Capacitor-generated native projects. Don't hand-edit unless you mean it; regenerate via `npx cap sync`.
- `iniciar.bat` — one-click local dev server (Windows + Python).
- `generate_icon.py` — regenerates `android/app/src/main/res/mipmap-*/ic_launcher*.png` (orange "BA BE BI BO BU" speech-bubble icon).
- `capacitor.config.json` — `appId: com.rafaelmendonca.jogodassilabas`, `webDir: www`.

## Dev commands

- Local dev (Windows): double-click `iniciar.bat` — starts `python -m http.server 8000` and opens `http://localhost:8000/index.html`. Requires Python on PATH.
- Local dev (any OS): `python -m http.server 8000` or `npx serve .` **Required:** serve from `localhost`/HTTPS. Opening `index.html` via `file://` will not work — the Web Speech API needs a secure context.
- After editing anything under `www/`: `npm run sync:android` (alias for `npx cap sync android`) to copy assets into the Android project.
- Android debug APK: `npm run build:android` — runs `cap sync` then `./gradlew assembleDebug` from `android/`. APK ends up at `android/app/build/outputs/apk/debug/app-debug.apk`.
- Open in Android Studio: `npm run android`.
- iOS: `npx cap add ios` (one-time, already present), then `npx cap open ios` from a macOS host.

## Constraints worth knowing

- **No build, no tests, no lint, no typecheck.** `package.json` only has Capacitor scripts. Don't invent `npm test` or ESLint configs without asking.
- **Browser requirement for the app itself:** Chrome or Edge (desktop or Android). Firefox/Safari don't support the recognition API used in `speech.js`. Internet is required at runtime — STT audio is processed by Google's servers.
- **Required runtime permissions on Android:** `INTERNET`, `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS` (already declared in `android/app/src/main/AndroidManifest.xml`).
- **Port 8000 is hard-coded** in `iniciar.bat`. If something else owns it, the script reuses the running instance and just opens the browser.
- **`generate_icon.py` has a hard-coded absolute path** (`C:\Users\Rafael\.verdent\verdent-projects\baseado-nesse-material-crie\android\app\src\main\res`). Move/edit the project and it breaks. It also requires `pip install Pillow`.
- **Word list (`www/words.js`) is the single source of curriculum content** — 160 entries with pre-split syllables. Don't compute splits at runtime; they're hand-curated.

## Workflow tips

- Pure web change (HTML/CSS/JS, `words.js`): edit, refresh browser. No sync needed for the web preview.
- Web change that should ship in the Android build: edit `www/`, then `npm run sync:android` before `gradlew assembleDebug`.
- Don't commit `node_modules/`, `android/.gradle/`, `android/build/`, or anything under `android/app/build/` — they're in `.gitignore`.
- `.verdent/` is the agent working directory; ignored.
