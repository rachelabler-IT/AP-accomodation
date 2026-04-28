const CACHE_NAME = "exam-app-v1";

const FILES = [
  "/AP-accomodation/",
  "/AP-accomodation/index.html",
  "/AP-accomodation/script.js",
  "/AP-accomodation/manifest.json"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
