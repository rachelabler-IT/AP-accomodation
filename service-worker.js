const CACHE_NAME = "exam-app-v1";

const FILES = [
  "./",
  "./index.html",
  "./script.js",
  "./manifest.json"
];

// Install and cache files
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

// Activate immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Serve cached files
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
