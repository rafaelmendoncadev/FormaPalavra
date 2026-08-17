// sw.js - Service Worker simples para suporte offline do Coruja Letrada
const CACHE_NAME = "coruja-letrada-v2.2";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=2.2",
  "./icons.js?v=2.2",
  "./words.js?v=2.2",
  "./levels.js?v=2.2",
  "./progress.js?v=2.2",
  "./audio.js?v=2.2",
  "./sfx.js?v=2.2",
  "./sabi.js?v=2.2",
  "./garden.js?v=2.2",
  "./achievements.js?v=2.2",
  "./parents.js?v=2.2",
  "./home.js?v=2.2",
  "./app.js?v=2.2",
  "./favicon.svg",
  "./assets/images/mascot-sabi-owl.png",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => console.warn("SW addAll non-fatal:", err));
    })
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).catch(() => res);
    })
  );
});
